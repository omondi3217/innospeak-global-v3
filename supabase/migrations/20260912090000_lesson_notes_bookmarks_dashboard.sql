/*
  # Lesson notes, bookmarks, and student dashboard aggregates

  Two small private-per-student tables (notes, bookmarks) plus three
  SECURITY DEFINER aggregate functions that back a richer student
  dashboard — each one computed live from real rows (enrollments,
  lesson_progress, submissions, quiz_attempts, certificates,
  assignments, quizzes), per the existing "no mock data, single
  authoritative source" pattern already used by get_course_progress().
*/

-- ============================================================
-- 1. lesson_notes — private per-student notes, one per lesson
-- ============================================================
CREATE TABLE IF NOT EXISTS lesson_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE (lesson_id, student_id)
);

ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_manage_own_notes" ON lesson_notes;
CREATE POLICY "student_manage_own_notes" ON lesson_notes
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid() AND is_enrolled(course_id_for_lesson(lesson_id)));

DROP TRIGGER IF EXISTS trg_lesson_notes_updated_at ON lesson_notes;
CREATE TRIGGER trg_lesson_notes_updated_at BEFORE UPDATE ON lesson_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 2. lesson_bookmarks — private per-student, one per lesson
-- ============================================================
CREATE TABLE IF NOT EXISTS lesson_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (lesson_id, student_id)
);

ALTER TABLE lesson_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_manage_own_bookmarks" ON lesson_bookmarks;
CREATE POLICY "student_manage_own_bookmarks" ON lesson_bookmarks
  FOR ALL TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid() AND is_enrolled(course_id_for_lesson(lesson_id)));

-- ============================================================
-- 3. get_student_dashboard_stats — KPI numbers, one query
-- ============================================================
CREATE OR REPLACE FUNCTION get_student_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_enrolled integer;
  v_active integer;
  v_completed_courses integer;
  v_avg_progress numeric;
  v_assignments_due integer;
  v_quiz_avg numeric;
  v_certificates integer;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Must be signed in';
  END IF;

  SELECT count(*) FILTER (WHERE status IN ('active','completed')),
         count(*) FILTER (WHERE status = 'active'),
         count(*) FILTER (WHERE status = 'completed')
  INTO v_enrolled, v_active, v_completed_courses
  FROM lms_enrollments WHERE student_id = v_uid;

  SELECT COALESCE(AVG((get_course_progress(course_id, v_uid)->>'percent')::numeric), 0)
  INTO v_avg_progress
  FROM lms_enrollments WHERE student_id = v_uid AND status = 'active';

  SELECT count(*) INTO v_assignments_due
  FROM assignments a
  JOIN modules m ON m.id = a.module_id
  JOIN lms_enrollments e ON e.course_id = m.course_id AND e.student_id = v_uid AND e.status = 'active'
  WHERE a.status = 'published'
    AND (a.due_at IS NULL OR a.due_at > now())
    AND NOT EXISTS (SELECT 1 FROM submissions s WHERE s.assignment_id = a.id AND s.student_id = v_uid);

  SELECT COALESCE(AVG(score / NULLIF(max_score, 0) * 100), 0) INTO v_quiz_avg
  FROM quiz_attempts WHERE student_id = v_uid AND score IS NOT NULL;

  SELECT count(*) INTO v_certificates FROM certificates WHERE student_id = v_uid AND status = 'issued';

  RETURN jsonb_build_object(
    'courses_enrolled', v_enrolled,
    'active_courses', v_active,
    'completed_courses', v_completed_courses,
    'avg_progress_percent', round(v_avg_progress, 1),
    'assignments_due', v_assignments_due,
    'quiz_avg_percent', round(v_quiz_avg, 1),
    'certificates_earned', v_certificates
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_student_dashboard_stats() TO authenticated;

-- ============================================================
-- 4. get_continue_learning — the single most relevant next step
-- ============================================================
CREATE OR REPLACE FUNCTION get_continue_learning()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_result jsonb;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Must be signed in';
  END IF;

  -- Most recently touched course with an active enrollment
  WITH last_touch AS (
    SELECT m.course_id, lp.lesson_id, lp.updated_at
    FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    JOIN modules m ON m.id = l.module_id
    WHERE lp.student_id = v_uid
    ORDER BY lp.updated_at DESC
    LIMIT 1
  ),
  target_course AS (
    SELECT COALESCE(
      (SELECT course_id FROM last_touch),
      (SELECT course_id FROM lms_enrollments WHERE student_id = v_uid AND status = 'active' ORDER BY enrolled_at DESC LIMIT 1)
    ) AS course_id
  ),
  next_lesson AS (
    SELECT l.id, l.title, m.title AS module_title
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = v_uid
    WHERE m.course_id = (SELECT course_id FROM target_course)
      AND (lp.status IS NULL OR lp.status <> 'completed')
    ORDER BY m.position, l.position
    LIMIT 1
  )
  SELECT jsonb_build_object(
    'course_id', c.id,
    'course_title', c.title,
    'next_lesson_id', nl.id,
    'next_lesson_title', nl.title,
    'next_module_title', nl.module_title,
    'progress', get_course_progress(c.id, v_uid)
  )
  INTO v_result
  FROM target_course tc
  JOIN lms_courses c ON c.id = tc.course_id
  LEFT JOIN next_lesson nl ON true;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_continue_learning() TO authenticated;

-- ============================================================
-- 5. get_upcoming_deadlines — assignments + quizzes, across all
--    actively-enrolled courses, real data only
-- ============================================================
CREATE OR REPLACE FUNCTION get_upcoming_deadlines(result_limit integer DEFAULT 10)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_result jsonb;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Must be signed in';
  END IF;

  WITH pending_assignments AS (
    SELECT
      a.id, a.title, c.title AS course_title, a.due_at,
      'assignment' AS item_type,
      (a.due_at IS NOT NULL AND a.due_at < now()) AS is_overdue
    FROM assignments a
    JOIN modules m ON m.id = a.module_id
    JOIN lms_courses c ON c.id = m.course_id
    JOIN lms_enrollments e ON e.course_id = c.id AND e.student_id = v_uid AND e.status = 'active'
    WHERE a.status = 'published'
      AND NOT EXISTS (SELECT 1 FROM submissions s WHERE s.assignment_id = a.id AND s.student_id = v_uid)
  ),
  pending_quizzes AS (
    SELECT
      q.id, q.title, c.title AS course_title, q.available_until AS due_at,
      'quiz' AS item_type,
      (q.available_until IS NOT NULL AND q.available_until < now()) AS is_overdue
    FROM quizzes q
    JOIN modules m ON m.id = q.module_id
    JOIN lms_courses c ON c.id = m.course_id
    JOIN lms_enrollments e ON e.course_id = c.id AND e.student_id = v_uid AND e.status = 'active'
    WHERE q.status = 'published'
      AND NOT EXISTS (SELECT 1 FROM quiz_attempts qa WHERE qa.quiz_id = q.id AND qa.student_id = v_uid AND qa.status <> 'in_progress')
  ),
  combined AS (
    SELECT * FROM pending_assignments
    UNION ALL
    SELECT * FROM pending_quizzes
  )
  SELECT COALESCE(jsonb_agg(row_to_json(combined) ORDER BY (due_at IS NULL), due_at), '[]'::jsonb)
  INTO v_result
  FROM (SELECT * FROM combined ORDER BY is_overdue DESC, due_at NULLS LAST LIMIT result_limit) combined;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_upcoming_deadlines(integer) TO authenticated;
