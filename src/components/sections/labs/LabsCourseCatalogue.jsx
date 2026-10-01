import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { COURSES } from '../../../lib/data/programmeData.js';
import { TRACKS } from '../../../lib/data/registry.js';

const TRACK_ICONS = {
  'software-engineering': '💻',
  'data-analytics': '📊',
  'ai-intelligent-systems': '🤖',
  'cloud-infrastructure': '☁️',
  cybersecurity: '🔐',
  'engineering-smart-systems': '⚙️',
  'creative-technology': '🎨',
};

export default function LabsCourseCatalogue() {
  const labCourses = useMemo(
    () => COURSES.filter((course) => course.division === 'labs'),
    []
  );

  return (
    <section className="relative overflow-hidden bg-gray-50 py-20">
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-100 blur-3xl opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-primary-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-700 shadow-sm">
            InnoSpeak Labs
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Build{' '}
            <span className="text-primary-600">Job-Ready Skills</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            Hands-on learning across software engineering, AI, data, cloud,
            cybersecurity, engineering and creative technology.
          </p>
        </div>

        {/* Tracks */}
        <div className="space-y-10">
          {TRACKS.map((track) => {
            const courses = labCourses.filter(
              (course) => course.pathwayId === track.id
            );

            if (!courses.length) return null;

            return (
              <div
                key={track.id}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg shadow-gray-200/40 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Track header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-950 via-gray-900 to-primary-950 px-6 py-7 sm:px-8">
                  <div className="absolute -right-12 -top-24 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl" />

                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-500/20 text-2xl ring-1 ring-primary-400/20">
                        {TRACK_ICONS[track.id] || '🧪'}
                      </div>

                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                            {track.code}
                          </span>

                          <span className="rounded-full bg-primary-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-200">
                            {courses.length} Courses
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                          {track.title}
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                          {track.shortDescription}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/labs?track=${track.id}`}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-gray-900"
                    >
                      Explore track
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                </div>

                {/* Courses */}
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                  {courses.slice(0, 6).map((course) => (
                    <Link
                      key={course.code}
                      to={`/courses/${course.code}`}
                      className="group/course relative flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-lg"
                    >
                      {course.featured && (
                        <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          Featured
                        </span>
                      )}

                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-lg transition group-hover/course:bg-primary-600 group-hover/course:text-white">
                        ⚡
                      </div>

                      <h4 className="pr-2 text-base font-bold leading-6 text-gray-900 transition group-hover/course:text-primary-700">
                        {course.name}
                      </h4>

                      {course.shortDescription && (
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
                          {course.shortDescription}
                        </p>
                      )}

                      <div className="mt-auto pt-5">
                        <div className="flex flex-wrap gap-2">
                          {course.level && (
                            <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-gray-100">
                              {course.level}
                            </span>
                          )}

                          {course.duration && (
                            <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-gray-100">
                              {course.duration}
                            </span>
                          )}

                          {course.studyMode && (
                            <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-gray-100">
                              {course.studyMode}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                          {course.isFree ? (
                            <span className="font-bold text-emerald-600">
                              Free
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-gray-700">
                              {course.fees || 'View fees'}
                            </span>
                          )}

                          <span className="text-sm font-bold text-primary-600 transition group-hover/course:translate-x-1">
                            View course →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {courses.length > 6 && (
                  <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 text-center">
                    <Link
                      to={`/labs?track=${track.id}`}
                      className="text-sm font-bold text-primary-600 transition hover:text-primary-800"
                    >
                      View all {courses.length} courses in this track →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
