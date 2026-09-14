/*
  # Phase 0a — Fix project_submissions grade-tampering gap

  Same class of bug already found and fixed once in submissions/
  quiz_attempts (20260901140000_lms_security_hardening.sql), missed in
  this table because it was added later, in a different migration.

  Two holes, both closed here:
    1. INSERT: "project submissions own write" only checks
       student_id = auth.uid() — nothing stops a student from creating
       a submission that is already status='approved' with a perfect
       score on day one.
    2. UPDATE: "project submissions own update" lets a student PATCH
       their own row's score/status/reviewed_by directly.

  Unlike submissions/quiz_attempts, this table has UNIQUE(milestone_id,
  student_id) — a student is *meant* to UPDATE their one row to
  resubmit, so UPDATE can't just be removed. Fixed with the same
  trigger pattern already used for discussions' pin/close columns:
  block changes to the grading columns unless the actor is course
  staff.
*/

-- 1. INSERT: a new submission must start in the ungraded state.
DROP POLICY IF EXISTS "project submissions own write" ON project_submissions;
CREATE POLICY "project_submissions_student_insert" ON project_submissions
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND status = 'submitted'
    AND score IS NULL
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
  );

-- 2. UPDATE: students may still update their own row (that's how
--    resubmission works here), but a trigger blocks non-staff from
--    touching the grading columns, regardless of what the client sends.
CREATE OR REPLACE FUNCTION enforce_project_submission_grading_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course_id uuid;
  v_is_staff boolean;
BEGIN
  SELECT p.course_id INTO v_course_id
  FROM project_milestones pm JOIN learning_projects p ON p.id = pm.project_id
  WHERE pm.id = NEW.milestone_id;

  v_is_staff := is_lms_admin() OR (v_course_id IS NOT NULL AND is_course_instructor(v_course_id));

  IF NOT v_is_staff AND (
    NEW.score IS DISTINCT FROM OLD.score
    OR NEW.status IS DISTINCT FROM OLD.status
    OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
    OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
  ) THEN
    RAISE EXCEPTION 'Only course staff can grade or change the review status of a project submission';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_project_submission_grading_columns ON project_submissions;
CREATE TRIGGER trg_enforce_project_submission_grading_columns
  BEFORE UPDATE ON project_submissions
  FOR EACH ROW
  EXECUTE FUNCTION enforce_project_submission_grading_columns();

-- The existing "project submissions own update" USING/WITH CHECK clause
-- (who may attempt an update at all) is still correct and is left in
-- place — the trigger adds the missing column-level restriction on
-- top of it, it doesn't replace it.
