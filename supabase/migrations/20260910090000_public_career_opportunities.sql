/*
# Public read access for published career opportunities

/career-hub is a public route (not behind login), but the existing RLS
policy on career_opportunities only grants SELECT to the `authenticated`
role -- so any logged-out visitor (prospective students, exactly who a
public opportunities board should reach) currently sees zero results
regardless of how many opportunities are actually published, since RLS
silently filters everything out for the anon role.

Published opportunities are meant to be public marketing/recruiting
content, not private student data, so this adds anon read access for
rows where published = true. Unpublished rows remain fully restricted
to staff (is_lms_admin()), matching the existing policy below.
*/

DROP POLICY IF EXISTS "published career opportunities public readable" ON public.career_opportunities;
CREATE POLICY "published career opportunities public readable"
ON public.career_opportunities FOR SELECT
TO anon USING (published = true);