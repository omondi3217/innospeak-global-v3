import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, CircleCheck, LogIn, TriangleAlert, CreditCard, Sparkles, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEnrollmentByCode, enrollInCourse } from '../../lib/supabase/portal';
import { parseFee } from '../../lib/data/programmeData';
import { checkCoursePaid } from '../../lib/supabase/payments';
import CheckoutModal from './CheckoutModal';

/**
 * EnrollButton — self-service enrollment for a course.
 * Free courses enroll directly. Paid courses open CheckoutModal.
 */
export default function EnrollButton({ course }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const [enrollment, setEnrollment] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const coursePrice = parseFee(course?.fees);
  const isPaid = coursePrice > 0 && course?.isFree !== true;

  useEffect(() => {
    if (!user) {
      setIsChecking(false);
      return;
    }
    let cancelled = false;
    setIsChecking(true);

    const checks = [getEnrollmentByCode(course.code)];
    if (isPaid) {
      checks.push(checkCoursePaid(course.code).catch(() => null));
    }

    Promise.all(checks)
      .then(([data, paid]) => {
        if (cancelled) return;
        setEnrollment(data);
        if (paid) setPaymentConfirmed(true);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, course.code, isPaid]);

  async function handleEnroll() {
    setError(null);
    setIsEnrolling(true);
    try {
      const data = await enrollInCourse({
        code: course.code,
        title: course.name,
        pathway: course.pathway,
      });
      setEnrollment(data);
    } catch (err) {
      setError(err.message || 'Could not enroll you right now. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  }

  /* ── Loading ── */
  if (authLoading || isChecking) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center rounded-2xl border border-navy-100 bg-white px-6 py-6 shadow-premium">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-100 border-t-gold-500" />
      </div>
    );
  }

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-premium sm:flex-row sm:justify-between sm:p-7">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
            <GraduationCap size={20} />
          </span>
          <div>
            <p className="font-body text-sm font-bold text-navy-900">
              Log in to enroll in {course.name}
            </p>
            <p className="mt-0.5 font-body text-xs text-navy-500">
              Track your progress and access learning materials.
            </p>
          </div>
        </div>
        <Link
          to="/login"
          state={{ from: location }}
          className="btn-gold inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap sm:w-auto"
        >
          <LogIn size={15} />
          Log In to Enroll
        </Link>
      </div>
    );
  }

  /* ── Already enrolled / paid ── */
  if (enrollment || paymentConfirmed) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border-2 border-emerald-300/60 bg-emerald-50 p-6 shadow-premium sm:flex-row sm:justify-between sm:p-7">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <CircleCheck size={20} />
          </span>
          <div>
            <p className="font-body text-sm font-bold text-emerald-900">
              {enrollment ? "You're enrolled in this course" : 'Payment confirmed'}
            </p>
            <p className="mt-0.5 font-body text-xs text-emerald-800">
              {enrollment
                ? 'Continue from where you left off.'
                : 'Your enrollment is being activated.'}
            </p>
          </div>
        </div>
        <Link
          to={enrollment?.courseId ? `/learn/courses/${enrollment.courseId}` : '/learn'}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-body text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-700 sm:w-auto"
        >
          Continue Learning
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  /* ── Ready to enroll ── */
  const enrollLabel = isPaid
    ? `Enroll Now — ${course.fees}`
    : 'Enroll Now — Free';

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-navy-100 bg-white p-6 shadow-premium sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isPaid
                  ? 'bg-navy-900 text-gold-400'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isPaid ? <CreditCard size={20} /> : <Sparkles size={20} />}
            </span>
            <div>
              <p className="font-body text-sm font-bold text-navy-900">
                {isPaid ? 'Ready to enroll?' : 'This course is free to complete'}
              </p>
              <p className="mt-0.5 font-body text-xs text-navy-500">
                {isPaid
                  ? 'Pay securely by M-PESA or card. Access granted instantly.'
                  : 'No payment required. Certificate issued on completion.'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => (isPaid ? setCheckoutOpen(true) : handleEnroll())}
              disabled={isEnrolling}
              className="btn-gold inline-flex w-full items-center justify-center gap-2 px-6 py-3 sm:w-auto disabled:opacity-60"
            >
              {isEnrolling ? (
                'Enrolling…'
              ) : (
                <>
                  {enrollLabel}
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
            <Link
              to="/contact"
              className="text-center font-body text-[11px] font-semibold text-navy-500 transition-colors hover:text-navy-900"
            >
              Need help? Contact us
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-body text-sm text-navy-800">
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {isPaid && (
        <CheckoutModal
          course={course}
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            setPaymentConfirmed(true);
            setCheckoutOpen(false);
          }}
        />
      )}
    </div>
  );
}