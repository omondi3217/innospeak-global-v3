import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Code,
  BarChart3,
  Brain,
  Cloud,
  ShieldCheck,
  Cog,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';
import { COURSES } from '../../../lib/data/programmeData.js';
import { TRACKS } from '../../../lib/data/registry.js';

const TRACK_ICONS = {
  'software-engineering': Code,
  'data-analytics': BarChart3,
  'ai-intelligent-systems': Brain,
  'cloud-infrastructure': Cloud,
  cybersecurity: ShieldCheck,
  'engineering-smart-systems': Cog,
  'creative-technology': Sparkles,
};

const container = staggerContainer(0.12, 0.1);

export default function LabsCourseCatalogue() {
  const labCourses = useMemo(
    () => COURSES.filter((course) => course.division === 'labs'),
    []
  );

  return (
    <section id="labs-catalogue" className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <SectionHeading
            eyebrow="InnoSpeak Labs"
            title="Build Job-Ready Skills"
            subtitle="Hands-on learning across software engineering, AI, data, cloud, cybersecurity, engineering and creative technology."
          />

          <div className="mt-12 space-y-10">
            {TRACKS.map((track) => {
              const courses = labCourses.filter(
                (course) => course.pathwayId === track.id
              );

              if (!courses.length) return null;

              const TrackIcon = TRACK_ICONS[track.id] || Sparkles;

              return (
                <motion.div
                  key={track.id}
                  variants={fadeUpItem}
                  className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium transition-all duration-300 hover:shadow-premium-lg"
                >
                  {/* Track header */}
                  <div className="relative overflow-hidden rounded-t-2xl bg-navy-900 px-6 py-7 sm:px-8">
                    <div className="pointer-events-none absolute -right-12 -top-24 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-gradient text-navy-900">
                          <TrackIcon size={26} strokeWidth={1.8} aria-hidden="true" />
                        </div>

                        <div>
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white/70">
                              {track.code}
                            </span>

                            <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300">
                              {courses.length} Courses
                            </span>
                          </div>

                          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                            {track.title}
                          </h3>

                          <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/65">
                            {track.shortDescription}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/labs?track=${track.id}`}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-body text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-gold-400/40 hover:bg-gold-500/10 hover:text-gold-300"
                      >
                        Explore track
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>

                  {/* Courses */}
                  <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                    {courses.slice(0, 6).map((course) => (
                      <Link
                        key={course.code}
                        to={`/courses/${course.code}`}
                        className="group/course flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-premium"
                      >
                        {course.featured && (
                          <span className="absolute right-4 top-4 rounded-full bg-gold-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-700">
                            Featured
                          </span>
                        )}

                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover/course:bg-gold-gradient group-hover/course:text-navy-900">
                          <Zap size={18} strokeWidth={1.8} aria-hidden="true" />
                        </div>

                        <h4 className="pr-2 font-display text-base font-bold leading-6 text-navy-900 transition-colors group-hover/course:text-gold-700">
                          {course.name}
                        </h4>

                        {course.shortDescription && (
                          <p className="mt-2 line-clamp-2 font-body text-sm leading-5 text-navy-600">
                            {course.shortDescription}
                          </p>
                        )}

                        <div className="mt-auto pt-5">
                          <div className="flex flex-wrap gap-2">
                            {course.level && (
                              <span className="rounded-md bg-navy-50 px-2.5 py-1 font-body text-[11px] font-medium text-navy-700">
                                {course.level}
                              </span>
                            )}

                            {course.duration && (
                              <span className="rounded-md bg-navy-50 px-2.5 py-1 font-body text-[11px] font-medium text-navy-700">
                                {course.duration}
                              </span>
                            )}

                            {course.studyMode && (
                              <span className="rounded-md bg-gold-50 px-2.5 py-1 font-body text-[11px] font-medium text-gold-700">
                                {course.studyMode}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
                            {course.isFree ? (
                              <span className="font-bold text-emerald-600">
                                Free
                              </span>
                            ) : (
                              <span className="font-body text-sm font-semibold text-navy-700">
                                {course.fees || 'View fees'}
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1 font-body text-sm font-bold text-navy-900 transition-colors group-hover/course:text-gold-600">
                              View course
                              <ArrowRight size={14} className="transition-transform group-hover/course:translate-x-1" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {courses.length > 6 && (
                    <div className="border-t border-navy-100 bg-cream/50 px-6 py-4 text-center">
                      <Link
                        to={`/labs?track=${track.id}`}
                        className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-navy-900 transition-colors hover:text-gold-600"
                      >
                        View all {courses.length} courses in this track
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
