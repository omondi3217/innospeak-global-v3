/*
  # Restore project_submissions grade-tampering fix (regressed)

  This exact fix was applied once already (20260910090000_fix_project_
  submissions_grading.sql) and was lost when the schema was rebuilt
  under a second migration lineage on 2026-09-16. Worse: that rebuild
  left TWO sets of policies live simultaneously —

    "project submissions own update"   (spaced name,  20260909100000)
    "project_submissions_own_update"   (underscore,   20260916122944)

  — because CREATE POLICY has no IF NOT EXISTS guard and the names
  differ, so neither migration replaced the other. Postgres OR's RLS
  policies together per command, so a student could exploit whichever
  of the two was more permissive. Both must be dropped explicitly by
  their exact names — dropping only one leaves the hole open.

  Same two bugs as before, confirmed still present in both lineages:
    1. INSERT: no restriction on score/status/reviewed_by — a student
       could create a submission already marked 'approved' with a
       perfect score.
    2. UPDATE: student_id = auth.uid() alone permits the update, with
       nothing stopping the client from setting score/status/
       reviewed_by/reviewed_at in the same request.

  Fix is identical in approach to the original: INSERT must start
  ungraded; UPDATE stays available to students (that's how resubmission
  works, via the same row) but a trigger blocks the grading columns
  for anyone who isn't course staff.
*/

DROP POLICY IF EXISTS "project submissions own write" ON project_submissions;
DROP POLICY IF EXISTS "project submissions own update" ON project_submissions;
DROP POLICY IF EXISTS "project_submissions_own_write" ON project_submissions;
DROP POLICY IF EXISTS "project_submissions_own_update" ON project_submissions;

CREATE POLICY "project_submissions_student_insert" ON project_submissions
  FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND status = 'submitted'
    AND score IS NULL
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
  );

CREATE POLICY "project_submissions_student_update" ON project_submissions
  FOR UPDATE TO authenticated
  USING (
    student_id = auth.uid()
    OR is_lms_admin()
    OR EXISTS (
      SELECT 1 FROM project_milestones pm JOIN learning_projects p ON p.id = pm.project_id
      WHERE pm.id = milestone_id AND is_course_instructor(p.course_id)
    )
  )
  WITH CHECK (
    student_id = auth.uid()
    OR is_lms_admin()
    OR EXISTS (
      SELECT 1 FROM project_milestones pm JOIN learning_projects p ON p.id = pm.project_id
      WHERE pm.id = milestone_id AND is_course_instructor(p.course_id)
    )
  );

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
