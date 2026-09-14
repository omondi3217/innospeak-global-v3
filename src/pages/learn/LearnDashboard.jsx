import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  TrendingUp,
  Award,
  Compass,
  Clock3,
  ArrowRight,
  ClipboardList,
  Megaphone,
  GraduationCap,
} from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listMyEnrollments, getCourseProgress, listMyNotifications, listMyUpcomingAssignments } from '../../lib/supabase/lms';
import { listMyCertificates } from '../../lib/supabase/learning.js';
import { useAuth } from '../../context/AuthContext';

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ dueAt }) {
  const days = daysUntil(dueAt);
  if (days === null) return null;
  if (days < 0) return <span className="rounded-full bg-rose-500/15 px-2.5 py-1 font-body text-xs font-bold text-rose-300">Overdue</span>;
  if (days === 0) return <span className="rounded-full bg-amber-500/15 px-2.5 py-1 font-body text-xs font-bold text-amber-300">Due today</span>;
  return <span className="rounded-full bg-sky-500/15 px-2.5 py-1 font-body text-xs font-bold text-sky-300">{days}d remaining</span>;
}

export default function LearnDashboard() {
  const { user, profile } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, enrollments: [], notifications: [], upcoming: [], certificates: [] });

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([listMyEnrollments(), listMyNotifications(6), listMyUpcomingAssignments(), listMyCertificates()])
      .then(async ([enrollments, notifications, upcoming, certificates]) => {
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
        setState({ loading: false, error: null, enrollments: withProgress, notifications, upcoming, certificates });
      })
      .catch((err) => setState((prev) => ({ ...prev, loading: false, error: err.message || 'Could not load your dashboard.' })));
  }, [user?.id]);

  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} />;

  const active = state.enrollments.filter((e) => e.status === 'active');
  const completed = state.enrollments.filter((e) => e.status === 'completed');
  const inProgress = active.filter((e) => (e.progress?.percent ?? 0) > 0 && (e.progress?.percent ?? 0) < 100);
  const continueCourse = inProgress[0] || active[0];
  const avgCompletion = active.length
    ? Math.round(active.reduce((sum, e) => sum + (e.progress?.percent ?? 0), 0) / active.length)
    : 0;

  return (
    <>
      <Seo title="My Learning" description="Your learning dashboard." path="/learn" />

      {/* Welcome banner */}
      <div className="rounded-2xl bg-navy-gradient p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">👋 Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}</h1>
            <p className="mt-2 font-body text-sm text-white/60">
              {profile?.student_number ? `${profile.student_number} · ` : ''}
              {active.length} active course{active.length === 1 ? '' : 's'}
            </p>
          </div>
          <Link to="/learn/catalog" className="btn-gold inline-flex items-center gap-2 text-sm">
            <Compass size={15} /> Browse Courses
          </Link>
        </div>
      </div>

      {/* Continue learning */}
      {continueCourse && (
        <div className="mt-6 rounded-2xl border-t-2 border-gold-500 bg-navy-900 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-body text-xs font-bold uppercase tracking-wide text-gold-400">Continue Learning</p>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-body text-xs font-bold text-emerald-300">
              {continueCourse.status === 'completed' ? 'Completed' : 'In Progress'}
            </span>
          </div>
          <h2 className="mt-3 font-display text-xl font-bold sm:text-2xl">{continueCourse.lms_courses?.title}</h2>

          <div className="mt-4">
            <div className="flex items-center justify-between font-body text-xs text-white/60">
              <span>Course progress</span>
              <span className="font-bold text-gold-300">{continueCourse.progress?.percent ?? 0}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-gold-500" style={{ width: `${continueCourse.progress?.percent ?? 0}%` }} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="font-body text-xs text-white/50">
              {continueCourse.progress ? `${continueCourse.progress.completed_lessons} / ${continueCourse.progress.total_lessons} lessons complete` : 'Progress unavailable'}
            </p>
            <Link to={`/learn/courses/${continueCourse.course_id}`} className="btn-gold inline-flex items-center gap-2 text-sm">
              Resume Course <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}

      {/* Stat row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-navy-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-white/40">Courses Enrolled</span>
            <BookOpen size={18} className="text-gold-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold">{state.enrollments.length}</p>
          <p className="mt-1 font-body text-xs text-white/40">{active.length} active · {completed.length} completed</p>
        </div>
        <div className="rounded-2xl bg-navy-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-white/40">Completion Rate</span>
            <TrendingUp size={18} className="text-gold-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold">{avgCompletion}%</p>
          <p className="mt-1 font-body text-xs text-white/40">Average across active courses</p>
        </div>
        <div className="rounded-2xl bg-navy-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-white/40">Certificates Earned</span>
            <Award size={18} className="text-gold-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold">{state.certificates.length}</p>
          <Link to="/learn/certificates" className="mt-1 inline-block font-body text-xs text-gold-400 hover:text-gold-300">View all →</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* My Courses */}
        <div className="rounded-2xl bg-navy-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">My Courses</h2>
            <Link to="/learn/courses" className="font-body text-xs font-bold text-gold-400 hover:text-gold-300">View all →</Link>
          </div>
          {state.enrollments.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No courses yet"
              message="Browse the catalog to enroll in your first course."
              action={<Link to="/learn/catalog" className="btn-gold text-sm">Browse Courses</Link>}
            />
          ) : (
            <div className="mt-4 space-y-3">
              {state.enrollments.slice(0, 4).map((e) => (
                <Link key={e.id} to={`/learn/courses/${e.course_id}`} className="block rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-body text-sm font-semibold">{e.lms_courses?.title}</p>
                    <span className="shrink-0 font-body text-xs font-bold text-gold-400">{e.progress?.percent ?? 0}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full bg-gold-500" style={{ width: `${e.progress?.percent ?? 0}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-2xl bg-navy-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold"><ClipboardList size={18} className="text-gold-400" /> Upcoming Deadlines</h2>
          </div>
          {state.upcoming.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Nothing due" message="Published assignments with due dates will show up here." />
          ) : (
            <div className="mt-4 space-y-3">
              {state.upcoming.slice(0, 4).map((a) => (
                <Link key={a.id} to={`/learn/assignments/${a.id}`} className="block rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-body text-xs text-white/40">{a.course_title}</p>
                      <p className="mt-0.5 truncate font-body text-sm font-semibold">{a.title}</p>
                      {a.due_at && (
                        <p className="mt-1 flex items-center gap-1 font-body text-xs text-white/40">
                          <Clock3 size={12} /> Due {new Date(a.due_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <DeadlineBadge dueAt={a.due_at} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Announcements / Notifications */}
      <div className="mt-6 rounded-2xl bg-navy-900 p-6 text-white">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Megaphone size={18} className="text-gold-400" /> Recent Activity</h2>
        {state.notifications.length === 0 ? (
          <EmptyState icon={Megaphone} title="Nothing new" message="Course announcements and updates will appear here." />
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {state.notifications.map((n) => (
              <li key={n.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className={`truncate font-body text-sm ${n.is_read ? 'text-white/60' : 'font-semibold text-white'}`}>{n.title}</p>
                  {n.body && <p className="mt-0.5 truncate font-body text-xs text-white/40">{n.body}</p>}
                </div>
                <span className="shrink-0 font-body text-xs text-white/30">{new Date(n.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
