/*
  # Fix — career_opportunities readable by anonymous visitors

  /career-hub is routed as a public marketing page in App.jsx (not
  behind ProtectedRoute) — it's meant to attract prospective students
  with real internship/job listings, the same audience as /careers.

  But the existing SELECT policy is scoped `to authenticated` only, so
  a logged-out visitor — the primary audience for a public career page
  — gets zero rows from RLS and always sees the "being curated" empty
  state, even when real opportunities are published. Confirmed by
  reading the page's actual route placement, not assumed.

  Fix: add anon to the same policy condition (published = true is
  still required either way — this does not expose unpublished/draft
  opportunities to anyone who couldn't already see them).
*/

DROP POLICY IF EXISTS "published career opportunities readable" ON career_opportunities;

CREATE POLICY "published_career_opportunities_readable" ON career_opportunities
  FOR SELECT
  TO anon, authenticated
  USING (published = true OR is_lms_admin());
