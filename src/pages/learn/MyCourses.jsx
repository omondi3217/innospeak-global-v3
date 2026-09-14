import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Compass, Clock3 } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listMyEnrollments, getCourseProgress } from '../../lib/supabase/lms';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function MyCourses() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, enrollments: [] });
  const [tab, setTab] = useState('all');

  useEffect(() => {
    if (!user?.id) return;
    listMyEnrollments()
      .then(async (enrollments) => {
        const withProgress = await Promise.all(
          enrollments.map(async (e) => {
            try {
              const progress = await getCourseProgress(e.course_id, user.id);
              return { ...e, progress };
            } catch {
              return { ...e, progress: null };
            }
          })
        );
        setState({ loading: false, error: null, enrollments: withProgress });
      })
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load your courses.', enrollments: [] }));
  }, [user?.id]);

  const filtered = useMemo(() => {
    if (tab === 'all') return state.enrollments;
    if (tab === 'active') return state.enrollments.filter((e) => e.status === 'active');
    return state.enrollments.filter((e) => e.status === 'completed');
  }, [state.enrollments, tab]);

  const counts = {
    all: state.enrollments.length,
    active: state.enrollments.filter((e) => e.status === 'active').length,
    completed: state.enrollments.filter((e) => e.status === 'completed').length,
  };

  return (
    <>
      <Seo title="My Courses" description="Every course you're enrolled in." path="/learn/courses" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Student Portal</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">My Courses</h1>
        </div>
        <Link to="/learn/catalog" className="btn-outline inline-flex items-center gap-2 text-sm">
          <Compass size={15} /> Browse Courses
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors ${
              tab === t.key ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
            }`}
          >
            {t.label} <span className="ml-1 opacity-70">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <SectionCard className="mt-6">
        {state.loading && <LoadingState />}
        {!state.loading && state.error && <ErrorState message={state.error} />}
        {!state.loading && !state.error && filtered.length === 0 && (
          <EmptyState
            icon={GraduationCap}
            title={state.enrollments.length === 0 ? "You're not enrolled in any course yet" : 'Nothing in this filter'}
            message="Browse the catalog to find a course to start learning."
            action={
              <Link to="/learn/catalog" className="btn-gold text-sm">
                Browse Courses
              </Link>
            }
          />
        )}
        {!state.loading && !state.error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((e) => (
              <Link
                key={e.id}
                to={`/learn/courses/${e.course_id}`}
                className="block rounded-xl border border-navy-100 px-4 py-4 transition-colors hover:bg-navy-50/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-body text-sm font-semibold text-navy-900">{e.lms_courses?.title}</p>
                    <p className="mt-1 flex items-center gap-1 font-body text-xs text-navy-500">
                      <Clock3 size={12} /> Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                      {e.status === 'completed' && ` · Completed ${new Date(e.completed_at).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span className="font-body text-xs font-semibold text-gold-700">
                    {e.status === 'completed' ? 'Review →' : 'Continue →'}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-navy-100">
                  <div className="h-2 rounded-full bg-gold-500" style={{ width: `${e.progress?.percent ?? 0}%` }} />
                </div>
                <p className="mt-1 font-body text-xs text-navy-500">
                  {e.progress
                    ? `${e.progress.percent ?? 0}% · ${e.progress.completed_lessons} / ${e.progress.total_lessons} lessons complete`
                    : 'Progress unavailable'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  );
}
