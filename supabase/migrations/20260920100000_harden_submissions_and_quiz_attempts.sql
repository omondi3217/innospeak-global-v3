/*
  # Harden submissions & quiz_attempts against grade-tampering
  # + fix a broken column reference in submit_quiz_attempt()

  Same regression pattern as project_submissions (see
  20260920090000_fix_project_submissions_grading_v2.sql): the schema
  was rebuilt under a second, then a third migration lineage
  (20260915.../20260916...), each adding its own differently-named
  policies without dropping the earlier ones. Because CREATE POLICY has
  no IF NOT EXISTS guard and Postgres OR's RLS policies together per
  command, EVERY permissive policy ever created for a table is still
  live unless dropped by its exact name. Confirmed by reading every
  migration that touches these two tables, not assumed.

  Concretely, before this migration:
    - quiz_attempts "update_own_attempts" (20260915/20260916) has NO
      restriction beyond student_id = auth.uid() — a student can PATCH
      their own attempt and set score/max_score/passed/status to
      anything, at any time. This is worse than the original bug.
    - quiz_attempts "insert_own_attempts" (20260915/20260916) has the
      same gap at INSERT time.
    - submissions "insert_submissions" (20260915/20260916) has no
      restriction on score/status/feedback/graded_at either.
    - submissions "update_submissions" omits WITH CHECK, so Postgres
      reuses USING as the check — which happens to block changing
      `status` away from 'submitted', but does NOT stop a student
      leaving status='submitted' while silently setting their own
      score/feedback/graded_at in the same request.

  Also fixed: submit_quiz_attempt() (20260917084225_lms_rpc_functions_
  core.sql) does `UPDATE quiz_attempts SET ... score_percent = v_pct ...`
  but no migration ever added a score_percent column to quiz_attempts.
  Calling this RPC currently errors with "column score_percent does not
  exist" — a functional bug independent of RLS, caught while tracing
  this function to design the trigger bypass below.

  Bypass mechanism: grade_submission() and submit_quiz_attempt() are
  SECURITY DEFINER, called BY the student/instructor themselves — so
  auth.uid() inside the trigger is the caller, not "the system", and a
  naive "only staff may change these columns" trigger would incorrectly
  block the student's own legitimate auto-grading call. Both RPCs now
  set a transaction-local flag immediately before their grading UPDATE;
  the trigger allows the write through when that flag is set OR the
  caller is genuinely staff — never for an ordinary client-issued UPDATE,
  since only these two trusted function bodies ever set it.
*/

-- ============================================================
-- 0. Fix the broken column reference
-- ============================================================
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS score_percent numeric;

-- ============================================================
-- 1. submissions — drop every permissive INSERT/UPDATE policy from
--    every lineage, by its exact name
-- ============================================================
DROP POLICY IF EXISTS "student_manage_own_submissions" ON submissions;
DROP POLICY IF EXISTS "student_insert_own_submissions" ON submissions;
DROP POLICY IF EXISTS "instructor_grade_submissions" ON submissions;
DROP POLICY IF EXISTS "insert_submissions" ON submissions;
DROP POLICY IF EXISTS "update_submissions" ON submissions;
DROP POLICY IF EXISTS "delete_submissions" ON submissions;

CREATE POLICY "submissions_student_insert" ON submissions
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND status = 'submitted'
    AND score IS NULL
    AND graded_by IS NULL
    AND graded_at IS NULL
    AND EXISTS (
      SELECT 1 FROM assignments a JOIN lms_enrollments e ON e.course_id = a.course_id
      WHERE a.id = submissions.assignment_id AND e.student_id = auth.uid() AND e.status = 'active'
    )
  );

CREATE POLICY "submissions_update" ON submissions
  FOR UPDATE TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM assignments a JOIN lms_courses c ON c.id = a.course_id WHERE a.id = submissions.assignment_id AND can_manage_course(c.id))
  )
  WITH CHECK (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM assignments a JOIN lms_courses c ON c.id = a.course_id WHERE a.id = submissions.assignment_id AND can_manage_course(c.id))
  );

CREATE POLICY "submissions_delete" ON submissions
  FOR DELETE TO authenticated
  USING (student_id = auth.uid());

CREATE OR REPLACE FUNCTION enforce_submission_grading_columns()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_course_id uuid;
  v_is_staff boolean;
  v_bypass boolean;
BEGIN
  v_bypass := COALESCE(current_setting('app.bypass_grade_lock', true), 'false') = 'true';
  IF v_bypass THEN
    RETURN NEW;
  END IF;

  SELECT a.course_id INTO v_course_id FROM assignments a WHERE a.id = NEW.assignment_id;
  v_is_staff := v_course_id IS NOT NULL AND can_manage_course(v_course_id);

  IF NOT v_is_staff AND (
    NEW.score IS DISTINCT FROM OLD.score
    OR NEW.status IS DISTINCT FROM OLD.status
    OR NEW.feedback IS DISTINCT FROM OLD.feedback
    OR NEW.graded_by IS DISTINCT FROM OLD.graded_by
    OR NEW.graded_at IS DISTINCT FROM OLD.graded_at
  ) THEN
    RAISE EXCEPTION 'Only course staff can grade or change the review status of a submission';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_submission_grading_columns ON submissions;
CREATE TRIGGER trg_enforce_submission_grading_columns
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION enforce_submission_grading_columns();

-- ============================================================
-- 2. quiz_attempts — same treatment
-- ============================================================
DROP POLICY IF EXISTS "student_manage_own_attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "student_insert_own_attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "insert_own_attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "update_own_attempts" ON quiz_attempts;

CREATE POLICY "quiz_attempts_student_insert" ON quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND status = 'in_progress'
    AND score = 0
    AND passed = false
  );

CREATE POLICY "quiz_attempts_student_update" ON quiz_attempts
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());
-- Ownership check only here on purpose — the grading-column lock is
-- enforced by the trigger below, the same pattern as submissions,
-- so submit_quiz_attempt() (bypass flag) still works while a direct
-- client PATCH of score/status/passed/max_score is blocked.

CREATE OR REPLACE FUNCTION enforce_quiz_attempt_grading_columns()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_bypass boolean;
BEGIN
  v_bypass := COALESCE(current_setting('app.bypass_grade_lock', true), 'false') = 'true';
  IF v_bypass THEN
    RETURN NEW;
  END IF;

  IF NEW.score IS DISTINCT FROM OLD.score
    OR NEW.max_score IS DISTINCT FROM OLD.max_score
    OR NEW.score_percent IS DISTINCT FROM OLD.score_percent
    OR NEW.passed IS DISTINCT FROM OLD.passed
    OR NEW.status IS DISTINCT FROM OLD.status
  THEN
    RAISE EXCEPTION 'Quiz attempts can only be graded via submit_quiz_attempt()';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_quiz_attempt_grading_columns ON quiz_attempts;
CREATE TRIGGER trg_enforce_quiz_attempt_grading_columns
  BEFORE UPDATE ON quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION enforce_quiz_attempt_grading_columns();

-- ============================================================
-- 3. Make the two trusted grading RPCs set the bypass flag, and fix
--    submit_quiz_attempt's broken column write while touching it.
-- ============================================================
CREATE OR REPLACE FUNCTION submit_quiz_attempt(target_attempt_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_attempt quiz_attempts%ROWTYPE;
  v_quiz quizzes%ROWTYPE;
  v_total_marks numeric := 0;
  v_earned_marks numeric := 0;
  v_pass boolean := false;
  v_pct numeric;
  v_question record;
  v_answer record;
  v_correct_option_ids uuid[];
  v_selected_ids uuid[];
BEGIN
  SELECT * INTO v_attempt FROM quiz_attempts WHERE id = target_attempt_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  IF v_attempt.status = 'submitted' OR v_attempt.status = 'graded' THEN RAISE EXCEPTION 'Attempt already submitted'; END IF;

  SELECT * INTO v_quiz FROM quizzes WHERE id = v_attempt.quiz_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Quiz not found'; END IF;

  FOR v_question IN SELECT * FROM quiz_questions WHERE quiz_id = v_quiz.id ORDER BY position
  LOOP
    v_total_marks := v_total_marks + v_question.marks;
    SELECT * INTO v_answer FROM quiz_answers WHERE attempt_id = v_attempt.id AND question_id = v_question.id;

    IF v_question.question_type IN ('multiple_choice', 'true_false') THEN
      SELECT array_agg(id ORDER BY position) INTO v_correct_option_ids
      FROM quiz_question_options WHERE question_id = v_question.id AND is_correct = true;
      v_selected_ids := COALESCE(v_answer.selected_option_ids::uuid[], ARRAY[]::uuid[]);
      IF array_length(v_selected_ids, 1) = array_length(v_correct_option_ids, 1)
         AND v_selected_ids = v_correct_option_ids THEN
        v_earned_marks := v_earned_marks + v_question.marks;
        UPDATE quiz_answers SET is_correct = true, awarded_marks = v_question.marks WHERE attempt_id = v_attempt.id AND question_id = v_question.id;
      ELSE
        UPDATE quiz_answers SET is_correct = false, awarded_marks = 0 WHERE attempt_id = v_attempt.id AND question_id = v_question.id;
      END IF;
    ELSIF v_question.question_type = 'short_answer' THEN
      IF v_answer.text_answer IS NOT NULL
         AND LOWER(TRIM(v_answer.text_answer)) = LOWER(TRIM(COALESCE(v_question.correct_short_answer, ''))) THEN
        v_earned_marks := v_earned_marks + v_question.marks;
        UPDATE quiz_answers SET is_correct = true, awarded_marks = v_question.marks WHERE attempt_id = v_attempt.id AND question_id = v_question.id;
      ELSE
        UPDATE quiz_answers SET is_correct = false, awarded_marks = 0 WHERE attempt_id = v_attempt.id AND question_id = v_question.id;
      END IF;
    END IF;
  END LOOP;

  v_pct := CASE WHEN v_total_marks > 0 THEN ROUND((v_earned_marks / v_total_marks) * 100) ELSE 0 END;
  v_pass := v_pct >= v_quiz.passing_score_percent;

  PERFORM set_config('app.bypass_grade_lock', 'true', true);

  UPDATE quiz_attempts
  SET status = 'graded', score = v_earned_marks, max_score = v_total_marks, score_percent = v_pct, passed = v_pass, submitted_at = now()
  WHERE id = v_attempt.id;

  RETURN jsonb_build_object('attempt_id', v_attempt.id, 'score', v_earned_marks, 'max_score', v_total_marks, 'percent', v_pct, 'passed', v_pass);
END;
$$;

GRANT EXECUTE ON FUNCTION submit_quiz_attempt(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION grade_submission(p_submission_id uuid, p_score integer, p_feedback text DEFAULT '', p_status text DEFAULT 'graded')
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM submissions s JOIN assignments a ON a.id = s.assignment_id JOIN lms_courses c ON c.id = a.course_id
    WHERE s.id = p_submission_id AND can_manage_course(c.id)
  ) THEN
    RAISE EXCEPTION 'You can only grade submissions for your own courses.';
  END IF;

  PERFORM set_config('app.bypass_grade_lock', 'true', true);

  UPDATE submissions SET score = p_score, feedback = p_feedback, status = p_status, graded_by = auth.uid(), graded_at = now()
  WHERE id = p_submission_id;
END;
$$;

GRANT EXECUTE ON FUNCTION grade_submission(uuid, integer, text, text) TO authenticated;
