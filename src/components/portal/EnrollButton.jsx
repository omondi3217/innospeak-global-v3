import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, CircleCheck, LogIn, TriangleAlert, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEnrollmentByCode, enrollInCourse } from '../../lib/supabase/portal';
import { parseFee } from '../../lib/data/programmeData';
import { checkCoursePaid } from '../../lib/supabase/payments';
import CheckoutModal from './CheckoutModal';

/**
 * EnrollButton — self-service enrollment for a course. Shown on every
 * /courses/:courseCode page — Academy and Labs courses both route
 * through CourseDetails.jsx, so this one component covers both.
 *
 * Free courses (price = 0) use the existing enrollment flow directly.
 * Paid courses open a CheckoutModal for M-PESA or PayPal payment.
 * Access is only granted after server-side payment confirmation.
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
  const isPaid = coursePrice > 0;

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

  if (authLoading || isChecking) {
    return (
      <div className="mx-auto flex max-w-xl items-center justify-center gap-2 rounded-2xl border border-navy-100 bg-white px-6 py-5 shadow-premium">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy-100 border-t-gold-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-navy-100 bg-white px-6 py-6 text-center shadow-premium sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
            <GraduationCap size={18} />
          </span>
          <p className="font-body text-sm text-navy-700">
            Log in to enroll in <strong>{course.name}</strong> and track your progress.
          </p>
        </div>
        <Link
          to="/login"
          state={{ from: location }}
          className="btn-gold shrink-0 whitespace-nowrap"
        >
          <LogIn size={15} className="mr-1.5" />
          Log In to Enroll
        </Link>
      </div>
    );
  }

  if (enrollment || paymentConfirmed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-gold-300/60 bg-gold-50 px-6 py-6 text-center shadow-premium sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-700 ring-1 ring-gold-500/30">
            <CircleCheck size={18} />
          </span>
          <p className="font-body text-sm text-navy-800">
            {enrollment ? 'You\u2019re enrolled in this course.' : 'Payment confirmed \u2014 your enrollment is being activated.'}
          </p>
        </div>
        <Link
          to={enrollment?.courseId ? `/learn/courses/${enrollment.courseId}` : '/learn'}
          className="btn-outline shrink-0 whitespace-nowrap"
        >
          Continue Learning
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
      {isPaid ? (
        <>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="btn-gold w-full max-w-xs"
          >
            <CreditCard size={15} className="mr-2" />
            Enroll for {course.fees}
          </motion.button>
          <CheckoutModal
            course={course}
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            onSuccess={() => {
              setPaymentConfirmed(true);
              setCheckoutOpen(false);
            }}
          />
        </>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleEnroll}
          disabled={isEnrolling}
          className="btn-gold w-full max-w-xs disabled:opacity-60"
        >
          {isEnrolling ? 'Enrolling\u2026' : 'Enroll Now — Free'}
        </motion.button>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 font-body text-sm text-navy-800">
          <TriangleAlert size={16} className="mt-0.5 shrink-0 text-gold-700" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
