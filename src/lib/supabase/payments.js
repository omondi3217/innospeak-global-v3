import { supabase } from './client';

/**
 * payments — data layer for course payments (M-PESA + PayPal).
 *
 * Free courses (price = 0) skip this layer entirely and use the
 * existing enrollment flow. Paid courses create a pending payment,
 * go through the provider's checkout, and only after server-side
 * confirmation does the enrollment get activated.
 */

function assertConfigured() {
  if (!supabase) {
    throw new Error('Payments are unavailable because Supabase has not been configured.');
  }
}

/**
 * Create a pending payment record in the database.
 * The edge function will update it after provider confirmation.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createPendingPayment({ courseId, courseCode, amount, currency, provider, phone }) {
  assertConfigured();
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id;
  if (!uid) throw new Error('You must be logged in to make a payment.');

  // payments.course_id is a uuid column, but catalogue courses are
  // identified by a text code (e.g. "DA5-101") and may not have an
  // lms_courses row yet. Passing a code here would fail with a Postgres
  // type error, so only set course_id when we genuinely have a UUID —
  // course_code is the column that always carries the catalogue code.
  const resolvedCourseId = UUID_RE.test(String(courseId || '')) ? courseId : null;

  const { data, error } = await supabase
    .from('payments')
    .insert([
      {
        student_id: uid,
        course_id: resolvedCourseId,
        course_code: courseCode || (UUID_RE.test(String(courseId || '')) ? null : courseId) || null,
        amount,
        currency,
        provider,
        phone: phone || null,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    // Handle duplicate active payment
    if (error.code === '23505') {
      throw new Error('You already have an active payment for this course. Please complete or cancel it first.');
    }
    throw error;
  }
  return data;
}

/**
 * Initiate M-PESA STK Push via edge function.
 */
export async function initiateMpesaPayment({ paymentId, courseId, courseCode, amount, currency, phone }) {
  assertConfigured();
  const { data, error } = await supabase.functions.invoke('mpesa-pay', {
    body: {
      action: 'initiate',
      paymentId,
      courseId,
      courseCode,
      amount,
      currency,
      phone,
    },
  });
  if (error) throw new Error(error.message || 'Could not initiate M-PESA payment.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Create a PayPal order via edge function.
 * Returns { orderId, approvalUrl }.
 */
export async function createPaypalOrder({ paymentId, courseId, courseCode, amount, currency }) {
  assertConfigured();
  const { data, error } = await supabase.functions.invoke('paypal-pay', {
    body: {
      action: 'create-order',
      paymentId,
      courseId,
      courseCode,
      amount,
      currency,
    },
  });
  if (error) throw new Error(error.message || 'Could not create PayPal order.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Capture a PayPal order after buyer approval.
 */
export async function capturePaypalOrder({ paymentId, orderId }) {
  assertConfigured();
  const { data, error } = await supabase.functions.invoke('paypal-pay', {
    body: {
      action: 'capture',
      paymentId,
      orderId,
    },
  });
  if (error) throw new Error(error.message || 'Could not capture PayPal payment.');
  if (data?.error) throw new Error(data.error);
  return data;
}

/**
 * Get the current user's payments.
 */
export async function listMyPayments() {
  assertConfigured();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Check if a student has a paid payment for a course.
 */
export async function checkCoursePaid(courseRef) {
  assertConfigured();
  // Accepts either an lms_courses UUID or a catalogue course code —
  // matches on whichever column actually holds that kind of value.
  const column = UUID_RE.test(String(courseRef || '')) ? 'course_id' : 'course_code';
  const { data, error } = await supabase
    .from('payments')
    .select('id, status')
    .eq(column, courseRef)
    .eq('status', 'paid')
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Get a single payment by ID.
 */
export async function getPayment(paymentId) {
  assertConfigured();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ============================================================
// Admin: list all payments
// ============================================================
export async function listAllPayments() {
  assertConfigured();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
