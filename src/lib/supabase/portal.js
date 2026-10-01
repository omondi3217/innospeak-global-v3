import { supabase } from './client';

/**
 * portal — enrollment data layer for the public course pages.
 *
 * Bridges the public catalogue (static data in lib/data/programmeData.js
 * and labsCourses.js, keyed by a course CODE like "DA5-101") to the LMS
 * database (lms_courses / lms_enrollments, keyed by UUID).
 *
 * A catalogue course only becomes enrollable once a matching PUBLISHED
 * row exists in lms_courses with the same `code`. Until then there is
 * nothing to enroll into and no lessons to deliver, so the UI says so
 * rather than creating an enrollment that leads nowhere.
 */

function assertConfigured() {
  if (!supabase) {
    throw new Error('Enrollment is unavailable because Supabase has not been configured.');
  }
}

/**
 * Resolve a catalogue course code to its published LMS course row.
 * @returns {Object|null} { id, title, code } or null if not published yet.
 */
export async function getLmsCourseByCode(code) {
  if (!supabase || !code) return null;
  const { data, error } = await supabase
    .from('lms_courses')
    .select('id, title, code, status')
    .eq('code', code)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Get the current user's enrollment for a catalogue course code.
 * @returns {Object|null} the lms_enrollments row, or null.
 */
export async function getEnrollmentByCode(code) {
  if (!supabase) return null;
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  if (!uid) return null;

  const course = await getLmsCourseByCode(code);
  if (!course) return null;

  const { data, error } = await supabase
    .from('lms_enrollments')
    .select('id, status, enrolled_at, course_id')
    .eq('course_id', course.id)
    .eq('student_id', uid)
    .maybeSingle();
  if (error) throw error;

  return data ? { ...data, courseId: course.id } : null;
}

/**
 * Enrol the current user into a catalogue course by its code.
 * @returns {Object} the created enrollment row (with courseId).
 */
export async function enrollInCourse({ code }) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  if (!uid) throw new Error('You must be logged in to enroll.');

  const course = await getLmsCourseByCode(code);
  if (!course) {
    throw new Error('This course is not open for enrollment yet. Please check back soon or contact us.');
  }

  const { data, error } = await supabase
    .from('lms_enrollments')
    .insert([{ course_id: course.id, student_id: uid }])
    .select('id, status, enrolled_at, course_id')
    .single();

  if (error) {
    if (error.code === '23505') {
      // Already enrolled — return the existing row rather than erroring.
      return getEnrollmentByCode(code);
    }
    throw error;
  }

  return { ...data, courseId: course.id };
}

/**
 * The current user's enrollments, for the portal dashboard.
 */
export async function getMyEnrollments() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('lms_enrollments')
    .select('id, status, enrolled_at, completed_at, lms_courses ( id, code, title )')
    .order('enrolled_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
