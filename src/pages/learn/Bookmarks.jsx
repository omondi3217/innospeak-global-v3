import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookOpen } from 'lucide-react';
import Seo from '../../components/ui/Seo.jsx';
import SectionCard from '../../components/portal/SectionCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../../components/portal/PortalStates.jsx';
import { listMyBookmarks } from '../../lib/supabase/lms';

export default function Bookmarks() {
  const [state, setState] = useState({ loading: true, error: null, bookmarks: [] });

  useEffect(() => {
    listMyBookmarks()
      .then((bookmarks) => setState({ loading: false, error: null, bookmarks }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load your bookmarks.', bookmarks: [] }));
  }, []);

  return (
    <>
      <Seo title="Bookmarked Lessons" description="Lessons you've saved for quick access." path="/learn/bookmarks" />

      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Learn</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">Bookmarked Lessons</h1>
      </div>

      <SectionCard className="mt-6">
        {state.loading && <LoadingState />}
        {!state.loading && state.error && <ErrorState message={state.error} />}
        {!state.loading && !state.error && state.bookmarks.length === 0 && (
          <EmptyState
            icon={Bookmark}
            title="No bookmarks yet"
            message="Tap the bookmark icon on any lesson to save it here for quick access."
          />
        )}
        {!state.loading && !state.error && state.bookmarks.length > 0 && (
          <div className="space-y-2">
            {state.bookmarks.map((b) => {
              const lesson = b.lessons;
              const module = lesson?.modules;
              const course = module?.lms_courses;
              if (!lesson || !module || !course) return null;
              return (
                <Link
                  key={b.id}
                  to={`/learn/courses/${course.id}/lessons/${lesson.id}`}
                  className="flex items-center gap-3 rounded-xl border border-navy-100 px-4 py-3 hover:bg-navy-50/60"
                >
                  <BookOpen size={15} className="shrink-0 text-navy-400" />
                  <div className="min-w-0">
                    <p className="truncate font-body text-sm font-semibold text-navy-900">{lesson.title}</p>
                    <p className="truncate font-body text-xs text-navy-500">{course.title} · {module.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </SectionCard>
    </>
  );
}
