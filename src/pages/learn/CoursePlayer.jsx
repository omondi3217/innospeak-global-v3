import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, BookOpen, FileCheck2, ListChecks,
  Bookmark, BookmarkCheck, PanelRightOpen, PanelRightClose, ChevronDown, ChevronUp,
  Megaphone, X,
} from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import { LoadingState, ErrorState } from '../../components/portal/PortalStates.jsx';
import DiscussionBoard from '../../components/lms/DiscussionBoard.jsx';
import {
  getCourse,
  listModulesWithLessons,
  listModuleAssignments,
  listModuleQuizzes,
  getLesson,
  getLessonProgress,
  markLessonStarted,
  markLessonComplete,
  getCourseProgress,
  getLessonNote,
  saveLessonNote,
  isLessonBookmarked,
  toggleLessonBookmark,
  listCourseAnnouncements,
} from '../../lib/supabase/lms';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { id: 'content', label: 'Lesson' },
  { id: 'notes', label: 'My Notes' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'resources', label: 'Resources' },
];

function ModuleProgressRing({ percent, size = 28 }) {
  const r = (size - 4) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e9f0" strokeWidth={2.5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={percent >= 100 ? '#c9a84c' : '#3b82f6'}
        strokeWidth={2.5}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent / 100)}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [expandedModules, setExpandedModules] = useState([]);

  const [course, setCourse] = useState({ loading: true, error: null, data: null, modules: [], progress: null, announcements: [] });
  const [lesson, setLesson] = useState({ loading: true, error: null, data: null, progress: null, note: '', noteLoaded: false, bookmarked: false });
  const [completing, setCompleting] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  // Load course structure once per courseId.
  const loadCourse = useCallback(async () => {
    try {
      const [data, modules, progress, announcements] = await Promise.all([
        getCourse(courseId),
        listModulesWithLessons(courseId),
        getCourseProgress(courseId, user.id),
        listCourseAnnouncements(courseId).catch(() => []),
      ]);
      const enriched = await Promise.all(
        modules.map(async (m) => {
          const [assignments, quizzes, lessonsWithProgress] = await Promise.all([
            listModuleAssignments(m.id).catch(() => []),
            listModuleQuizzes(m.id).catch(() => []),
            Promise.all(m.lessons.map(async (l) => ({ ...l, progress: await getLessonProgress(l.id).catch(() => null) }))),
          ]);
          return { ...m, lessons: lessonsWithProgress, assignments, quizzes: quizzes.filter((q) => q.status === 'published') };
        })
      );
      setCourse({ loading: false, error: null, data, modules: enriched, progress, announcements });
      setExpandedModules(enriched.filter((m) => m.lessons.some((l) => l.id === lessonId)).map((m) => m.id));

      if (!lessonId) {
        const flat = enriched.flatMap((m) => m.lessons);
        const firstIncomplete = flat.find((l) => l.progress?.status !== 'completed') || flat[0];
        if (firstIncomplete) navigate(`/learn/courses/${courseId}/lessons/${firstIncomplete.id}`, { replace: true });
      }
    } catch (err) {
      setCourse((prev) => ({ ...prev, loading: false, error: err.message || 'Could not load this course.' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user?.id]);

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Load the active lesson whenever lessonId changes.
  const loadLesson = useCallback(async () => {
    if (!lessonId) return;
    setLesson((prev) => ({ ...prev, loading: true }));
    try {
      const [data, progress, note, bookmarked] = await Promise.all([
        getLesson(lessonId),
        getLessonProgress(lessonId),
        getLessonNote(lessonId).catch(() => null),
        isLessonBookmarked(lessonId).catch(() => false),
      ]);
      await markLessonStarted(lessonId).catch(() => {});
      setLesson({ loading: false, error: null, data, progress, note: note?.content || '', noteLoaded: true, bookmarked });
      setActiveTab('content');
    } catch (err) {
      setLesson((prev) => ({ ...prev, loading: false, error: err.message || 'Could not load this lesson.' }));
    }
  }, [lessonId]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  function toggleModule(moduleId) {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
  }

  const flatLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = flatLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;
  const isComplete = lesson.progress?.status === 'completed';

  async function handleComplete() {
    setCompleting(true);
    try {
      await markLessonComplete(lessonId);
      const [progress, courseProgress] = await Promise.all([getLessonProgress(lessonId), getCourseProgress(courseId, user.id)]);
      setLesson((prev) => ({ ...prev, progress }));
      setCourse((prev) => ({ ...prev, progress: courseProgress }));
      if (nextLesson) {
        setTimeout(() => navigate(`/learn/courses/${courseId}/lessons/${nextLesson.id}`), 500);
      }
    } finally {
      setCompleting(false);
    }
  }

  async function handleSaveNote() {
    setSavingNote(true);
    try {
      await saveLessonNote(lessonId, lesson.note);
    } finally {
      setSavingNote(false);
    }
  }

  async function handleToggleBookmark() {
    const next = !lesson.bookmarked;
    setLesson((prev) => ({ ...prev, bookmarked: next }));
    try {
      await toggleLessonBookmark(lessonId, next);
    } catch {
      setLesson((prev) => ({ ...prev, bookmarked: !next }));
    }
  }

  if (course.loading) return <LoadingState />;
  if (course.error) return <ErrorState message={course.error} />;

  return (
    <>
      <Seo title={lesson.data?.title || course.data.title} description="Course player." path={`/learn/courses/${courseId}/lessons/${lessonId || ''}`} />

      <div className="-m-5 flex h-[calc(100vh-9rem)] overflow-hidden rounded-2xl border border-navy-100 bg-white sm:-m-8 lg:m-0">
        {/* LEFT — module/lesson tree */}
        <div
          className={`flex shrink-0 flex-col overflow-hidden border-r border-navy-100 bg-navy-50/40 transition-all duration-200 ${
            sidebarOpen ? 'w-72' : 'w-0'
          }`}
        >
          {sidebarOpen && (
            <>
              <div className="border-b border-navy-100 px-4 py-3">
                <Link to="/learn" className="font-body text-xs font-semibold text-navy-500 hover:text-navy-800">
                  ← My Learning
                </Link>
                <p className="mt-2 font-display text-sm font-bold text-navy-900">{course.data.title}</p>
                <p className="mt-0.5 font-body text-xs text-navy-500">
                  {course.progress?.completed_lessons ?? 0}/{course.progress?.total_lessons ?? 0} lessons · {course.progress?.percent ?? 0}%
                </p>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {course.modules.map((module) => {
                  const isExpanded = expandedModules.includes(module.id);
                  const doneCount = module.lessons.filter((l) => l.progress?.status === 'completed').length;
                  const modulePercent = module.lessons.length ? Math.round((doneCount / module.lessons.length) * 100) : 0;
                  return (
                    <div key={module.id} className="mb-1">
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-navy-100/50"
                      >
                        <ModuleProgressRing percent={modulePercent} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-body text-xs font-semibold text-navy-900">{module.title}</p>
                          <p className="font-body text-[11px] text-navy-500">{doneCount}/{module.lessons.length} complete</p>
                        </div>
                        {isExpanded ? <ChevronUp size={13} className="text-navy-400" /> : <ChevronDown size={13} className="text-navy-400" />}
                      </button>

                      {isExpanded && (
                        <div className="ml-4 border-l border-navy-100 pl-2">
                          {module.lessons.map((l) => {
                            const active = l.id === lessonId;
                            const done = l.progress?.status === 'completed';
                            return (
                              <button
                                key={l.id}
                                type="button"
                                onClick={() => navigate(`/learn/courses/${courseId}/lessons/${l.id}`)}
                                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-body text-xs transition-colors ${
                                  active ? 'bg-gold-500/10 text-gold-800' : 'text-navy-700 hover:bg-navy-100/50'
                                }`}
                              >
                                {done ? <CheckCircle2 size={13} className="shrink-0 text-emerald-600" /> : <Circle size={13} className="shrink-0 text-navy-300" />}
                                <BookOpen size={12} className="shrink-0 text-navy-400" />
                                <span className="truncate">{l.title}</span>
                              </button>
                            );
                          })}
                          {module.assignments.map((a) => (
                            <Link
                              key={a.id}
                              to={`/learn/assignments/${a.id}`}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-2 font-body text-xs text-navy-700 hover:bg-navy-100/50"
                            >
                              <FileCheck2 size={12} className="shrink-0 text-gold-600" />
                              <span className="truncate">{a.title}</span>
                            </Link>
                          ))}
                          {module.quizzes.map((q) => (
                            <Link
                              key={q.id}
                              to={`/learn/quizzes/${q.id}`}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-2 font-body text-xs text-navy-700 hover:bg-navy-100/50"
                            >
                              <ListChecks size={12} className="shrink-0 text-navy-600" />
                              <span className="truncate">{q.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* CENTER — lesson content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-navy-100 px-5 py-3">
            <button type="button" onClick={() => setSidebarOpen((v) => !v)} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700">
              {sidebarOpen ? <PanelRightOpen size={16} className="rotate-180" /> : <PanelRightClose size={16} className="rotate-180" />}
            </button>
            <h1 className="min-w-0 flex-1 truncate font-display text-base font-bold text-navy-900">{lesson.data?.title || 'Loading…'}</h1>
            <button type="button" onClick={handleToggleBookmark} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-gold-600">
              {lesson.bookmarked ? <BookmarkCheck size={17} className="text-gold-600" /> : <Bookmark size={17} />}
            </button>
            <button type="button" onClick={() => setInfoPanelOpen((v) => !v)} className="hidden rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700 lg:inline-flex">
              {infoPanelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-navy-100 px-4">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`border-b-2 px-3 py-2.5 font-body text-xs font-semibold transition-colors ${
                  activeTab === t.id ? 'border-gold-500 text-gold-700' : 'border-transparent text-navy-500 hover:text-navy-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {lesson.loading && <div className="p-6"><LoadingState /></div>}
            {!lesson.loading && lesson.error && <div className="p-6"><ErrorState message={lesson.error} /></div>}
            {!lesson.loading && !lesson.error && lesson.data && (
              <>
                {activeTab === 'content' && (
                  <div className="mx-auto max-w-3xl p-6">
                    {lesson.data.content_type === 'video' && lesson.data.video_url && (
                      <video controls className="mb-5 w-full rounded-xl" src={lesson.data.video_url} />
                    )}
                    {lesson.data.content_type === 'link' && lesson.data.external_url && (
                      <a href={lesson.data.external_url} target="_blank" rel="noreferrer" className="mb-5 inline-block font-body text-sm font-semibold text-gold-700 hover:underline">
                        Open external resource →
                      </a>
                    )}
                    {lesson.data.content && (
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap font-body text-navy-800">{lesson.data.content}</div>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="mx-auto max-w-2xl p-6">
                    <p className="font-body text-sm font-semibold text-navy-900">My Notes</p>
                    <p className="mt-0.5 font-body text-xs text-navy-500">Private notes, saved just for you on this lesson.</p>
                    <textarea
                      value={lesson.note}
                      onChange={(e) => setLesson((prev) => ({ ...prev, note: e.target.value }))}
                      rows={12}
                      placeholder="Key concepts, questions to follow up on…"
                      className="mt-3 w-full rounded-xl border border-navy-200 px-3 py-2 font-body text-sm"
                    />
                    <button type="button" onClick={handleSaveNote} disabled={savingNote} className="btn-gold mt-3 text-sm disabled:opacity-60">
                      {savingNote ? 'Saving…' : 'Save Notes'}
                    </button>
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="mx-auto max-w-2xl p-6">
                    <DiscussionBoard courseId={courseId} isInstructor={false} />
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="mx-auto max-w-2xl p-6">
                    <p className="font-body text-sm font-semibold text-navy-900">Lesson Resources</p>
                    {(lesson.data.lesson_resources || []).length === 0 ? (
                      <p className="mt-2 font-body text-sm text-navy-400">No resources attached to this lesson.</p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {lesson.data.lesson_resources.map((r) => (
                          <li key={r.id}>
                            <a href={r.file_url} target="_blank" rel="noreferrer" className="font-body text-sm text-gold-700 hover:underline">
                              {r.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-navy-100 px-5 py-3">
            {prevLesson ? (
              <button type="button" onClick={() => navigate(`/learn/courses/${courseId}/lessons/${prevLesson.id}`)} className="btn-outline inline-flex items-center gap-2 text-xs">
                <ArrowLeft size={14} /> Previous
              </button>
            ) : (
              <span />
            )}

            {isComplete ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 font-body text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={16} /> Completed
              </span>
            ) : (
              <button type="button" onClick={handleComplete} disabled={completing} className="btn-gold inline-flex items-center gap-2 disabled:opacity-60">
                <CheckCircle2 size={16} /> {completing ? 'Saving…' : 'Mark Complete'}
              </button>
            )}

            {nextLesson ? (
              <button type="button" onClick={() => navigate(`/learn/courses/${courseId}/lessons/${nextLesson.id}`)} className="btn-outline inline-flex items-center gap-2 text-xs">
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <span />
            )}
          </div>
        </div>

        {/* RIGHT — course info panel */}
        {infoPanelOpen && (
          <div className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-navy-100 bg-navy-50/40 lg:flex">
            <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
              <p className="font-body text-sm font-bold text-navy-900">Course Panel</p>
              <button type="button" onClick={() => setInfoPanelOpen(false)} className="text-navy-400 hover:text-navy-700">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-5 p-4">
              <div>
                <p className="font-body text-xs font-bold uppercase text-navy-500">Overall Progress</p>
                <div className="mt-2 flex items-center justify-between font-body text-sm">
                  <span className="text-navy-700">Course</span>
                  <span className="font-bold text-gold-700">{course.progress?.percent ?? 0}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-navy-100">
                  <div className="h-2 rounded-full bg-gold-500" style={{ width: `${course.progress?.percent ?? 0}%` }} />
                </div>
              </div>

              {course.announcements.length > 0 && (
                <div>
                  <p className="font-body text-xs font-bold uppercase text-navy-500">Announcements</p>
                  <div className="mt-2 space-y-2">
                    {course.announcements.slice(0, 3).map((a) => (
                      <div key={a.id} className="rounded-lg bg-gold-500/5 p-2.5">
                        <p className="flex items-center gap-1.5 font-body text-xs font-semibold text-navy-900">
                          <Megaphone size={11} className="text-gold-600" /> {a.title}
                        </p>
                        <p className="mt-1 font-body text-xs text-navy-600">{a.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="font-body text-xs font-bold uppercase text-navy-500">All Lesson Resources</p>
                <div className="mt-2 space-y-1">
                  {course.modules
                    .flatMap((m) => m.lessons)
                    .flatMap((l) => l.lesson_resources || [])
                    .length === 0 ? (
                    <p className="font-body text-xs text-navy-400">None added yet.</p>
                  ) : (
                    course.modules
                      .flatMap((m) => m.lessons)
                      .flatMap((l) => l.lesson_resources || [])
                      .map((r) => (
                        <a key={r.id} href={r.file_url} target="_blank" rel="noreferrer" className="block font-body text-xs text-gold-700 hover:underline">
                          {r.title}
                        </a>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
