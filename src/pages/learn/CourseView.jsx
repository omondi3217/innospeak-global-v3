import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Circle, BookOpen, FileCheck2, ListChecks, Megaphone, ArrowLeft } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState } from '../../components/portal/PortalStates.jsx';
import DiscussionBoard from '../../components/lms/DiscussionBoard.jsx';
import {
  getCourse,
  listModulesWithLessons,
  listModuleAssignments,
  listModuleQuizzes,
  getCourseProgress,
  getLessonProgress,
  listCourseAnnouncements,
} from '../../lib/supabase/lms';
import { useAuth } from '../../context/AuthContext';

export default function CourseView() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, course: null, modules: [], progress: null, announcements: [] });

  useEffect(() => {
    Promise.all([getCourse(courseId), listModulesWithLessons(courseId), getCourseProgress(courseId, user.id), listCourseAnnouncements(courseId).catch(() => [])])
      .then(async ([course, modules, progress, announcements]) => {
        const enriched = await Promise.all(
          modules.map(async (m) => {
            const [assignments, quizzes, lessonsWithProgress] = await Promise.all([
              listModuleAssignments(m.id).catch(() => []),
              listModuleQuizzes(m.id).catch(() => []),
              Promise.all(
                m.lessons.map(async (l) => ({ ...l, progress: await getLessonProgress(l.id).catch(() => null) }))
              ),
            ]);
            return { ...m, lessons: lessonsWithProgress, assignments, quizzes: quizzes.filter((q) => q.status === 'published') };
          })
        );
        setState({ loading: false, error: null, course, modules: enriched, progress, announcements });
      })
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load this course.', course: null, modules: [], progress: null, announcements: [] }));
  }, [courseId, user?.id]);

  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} />;

  return (
    <>
      <Seo title={state.course.title} description={state.course.description} path={`/learn/courses/${courseId}`} />

      <Link to="/learn" className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-navy-500 hover:text-navy-800">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="mt-4">
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Learn</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">{state.course.title}</h1>
        {state.course.description && <p className="mt-2 font-body text-sm text-navy-500">{state.course.description}</p>}
      </div>

      <SectionCard className="mt-6">
        <div className="flex items-center justify-between">
          <p className="font-body text-sm font-semibold text-navy-900">Course Progress</p>
          <p className="font-body text-sm text-gold-700">{state.progress?.percent ?? 0}%</p>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-navy-100">
          <div className="h-2 rounded-full bg-gold-500" style={{ width: `${state.progress?.percent ?? 0}%` }} />
        </div>
      </SectionCard>

      {state.announcements.length > 0 && (
        <SectionCard title="Announcements" className="mt-6">
          <div className="space-y-3">
            {state.announcements.map((a) => (
              <div key={a.id} className="rounded-lg bg-gold-500/5 px-3 py-3">
                <p className="flex items-center gap-2 font-body text-sm font-semibold text-navy-900">
                  <Megaphone size={13} className="text-gold-600" /> {a.title}
                </p>
                <p className="mt-1 font-body text-sm text-navy-700">{a.body}</p>
                <p className="mt-1 font-body text-xs text-navy-400">{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <div className="mt-6 space-y-4">
        {state.modules.map((module) => (
          <SectionCard key={module.id} title={module.title} description={module.description}>
            <div className="space-y-2">
              {module.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/learn/lessons/${lesson.id}`}
                  className="flex items-center justify-between rounded-lg bg-navy-50/60 px-3 py-2 hover:bg-navy-50"
                >
                  <span className="flex items-center gap-2 font-body text-sm text-navy-800">
                    {lesson.progress?.status === 'completed' ? (
                      <CheckCircle2 size={15} className="text-emerald-600" />
                    ) : (
                      <Circle size={15} className="text-navy-300" />
                    )}
                    <BookOpen size={13} className="text-navy-400" />
                    {lesson.title}
                  </span>
                </Link>
              ))}
              {module.assignments.map((a) => (
                <Link key={a.id} to={`/learn/assignments/${a.id}`} className="flex items-center justify-between rounded-lg bg-gold-500/5 px-3 py-2 hover:bg-gold-500/10">
                  <span className="flex items-center gap-2 font-body text-sm text-navy-800">
                    <FileCheck2 size={13} className="text-gold-600" />
                    {a.title}
                  </span>
                  {a.due_at && <span className="font-body text-xs text-navy-400">Due {new Date(a.due_at).toLocaleDateString()}</span>}
                </Link>
              ))}
              {module.quizzes.map((q) => (
                <Link key={q.id} to={`/learn/quizzes/${q.id}`} className="flex items-center justify-between rounded-lg bg-navy-500/5 px-3 py-2 hover:bg-navy-500/10">
                  <span className="flex items-center gap-2 font-body text-sm text-navy-800">
                    <ListChecks size={13} className="text-navy-600" />
                    {q.title}
                  </span>
                </Link>
              ))}
              {module.lessons.length === 0 && module.assignments.length === 0 && module.quizzes.length === 0 && (
                <p className="font-body text-sm text-navy-400">No content in this module yet.</p>
              )}
            </div>
          </SectionCard>
        ))}
      </div>

      <DiscussionBoard courseId={courseId} isInstructor={false} />
    </>
  );
}
