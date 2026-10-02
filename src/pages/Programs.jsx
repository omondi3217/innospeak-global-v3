import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Search,
  GraduationCap,
  FlaskConical,
  HeartHandshake,
  BookOpen,
} from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../lib/motion/presets';
import { COURSES, getCoursesByPathway } from '../lib/data/programmeData.js';
import { PATHWAYS, TRACKS } from '../lib/data/registry.js';

const PILLARS = [
  {
    id: 'academy',
    title: 'InnoSpeak Global Academy',
    tagline: 'Structured Learning & Certification',
    description:
      'Structured learning, professional development, digital skills, communication, technical education and certification.',
    icon: GraduationCap,
    to: '/academy',
    cta: 'Explore Academy',
    accent: 'from-gold-500/10 to-gold-400/5',
    border: 'border-gold-500/30',
    iconBg: 'bg-gold-gradient',
  },
  {
    id: 'labs',
    title: 'InnoSpeak Global Labs',
    tagline: 'Practical Innovation & Engineering',
    description:
      'Practical engineering, technology, innovation, projects, entrepreneurship and hands-on development.',
    icon: FlaskConical,
    to: '/labs',
    cta: 'Explore Labs',
    accent: 'from-navy-500/10 to-navy-400/5',
    border: 'border-navy-400/30',
    iconBg: 'bg-navy-800',
  },
  {
    id: 'foundation',
    title: 'InnoSpeak Global Foundation',
    tagline: 'Scholarships & Educational Support',
    description:
      'Scholarships, educational support, opportunity access and community impact.',
    icon: HeartHandshake,
    to: '/foundation',
    cta: 'Explore Foundation',
    accent: 'from-gold-500/10 to-gold-400/5',
    border: 'border-gold-500/30',
    iconBg: 'bg-gold-gradient',
  },
];

const DIVISION_FILTERS = [
  { id: 'all', label: 'All Programs' },
  { id: 'academy', label: 'Academy' },
  { id: 'labs', label: 'Labs' },
];

export default function Programs() {
  const [query, setQuery] = useState('');
  const [division, setDivision] = useState('all');

  // ── Build the 19 programs (12 Academy pathways + 7 Labs tracks) ──
  const programs = useMemo(() => {
    const academyPrograms = PATHWAYS.map((p) => {
      const courses = getCoursesByPathway(p.id);
      return {
        id: p.id,
        code: p.code,
        slug: p.slug,
        title: p.title,
        description: p.shortDescription,
        division: 'academy',
        courseCount: courses.length,
        levels: [...new Set(courses.map((c) => c.level).filter(Boolean))].slice(0, 3),
        studyModes: [...new Set(courses.map((c) => c.studyMode).filter(Boolean))].slice(0, 2),
      };
    });

    const labsPrograms = TRACKS.map((t) => {
      const courses = getCoursesByPathway(t.id);
      return {
        id: t.id,
        code: t.code,
        slug: t.slug,
        title: t.title,
        description: t.shortDescription,
        division: 'labs',
        courseCount: courses.length,
        levels: [...new Set(courses.map((c) => c.level).filter(Boolean))].slice(0, 3),
        studyModes: [...new Set(courses.map((c) => c.studyMode).filter(Boolean))].slice(0, 2),
      };
    });

    return [...academyPrograms, ...labsPrograms];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      if (division !== 'all' && p.division !== division) return false;
      if (q && !`${p.title} ${p.description} ${p.code}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [programs, division, query]);

  const academyCount = programs.filter((p) => p.division === 'academy').length;
  const labsCount = programs.filter((p) => p.division === 'labs').length;

  return (
    <>
      <Seo
        title="Programs — Learn. Build. Innovate."
        description="Explore the 19 programs within the InnoSpeak Global ecosystem — 12 Academy pathways and 7 Labs tracks."
        path="/programs"
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px',
            }}
          />
        </div>
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />

        <div className="container-premium relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="eyebrow">The InnoSpeak Global Ecosystem</span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.12] text-white md:text-5xl lg:text-6xl">
              Learn. Build. Innovate.
              <span className="block text-gradient-gold">Make an Impact.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-navy-200 md:text-lg">
              Explore the pathways within the InnoSpeak Global ecosystem —
              structured learning, practical innovation, and educational support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Three Pillars ────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-premium">
          <SectionHeading
            eyebrow="One Ecosystem. Three Pathways."
            title="Choose your path within InnoSpeak Global"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewOnce}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl border ${pillar.border} bg-gradient-to-br ${pillar.accent} p-8 transition-all duration-300 hover:shadow-premium-lg`}
                >
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${pillar.iconBg} text-navy-900 shadow-md`}>
                    <Icon size={28} strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 font-body text-xs font-semibold uppercase tracking-[0.22em] text-gold-700">
                    {pillar.tagline}
                  </p>
                  <p className="mt-4 font-body text-sm leading-relaxed text-navy-600">
                    {pillar.description}
                  </p>
                  <Link
                    to={pillar.to}
                    className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-900 transition-colors hover:text-gold-700"
                  >
                    {pillar.cta}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Program Discovery (the 19 programs) ─────────── */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-premium">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-700">
                Program Discovery
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 md:text-4xl">
                {programs.length} programs across 2 divisions
              </h2>
              <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-navy-500">
                {academyCount} Academy pathways · {labsCount} Labs tracks.
                Every program groups related courses into a clear learning route.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-white px-4 py-3 shadow-sm md:w-80">
              <Search size={18} className="shrink-0 text-navy-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programs..."
                className="w-full bg-transparent font-body text-sm text-navy-900 outline-none placeholder:text-navy-300"
              />
            </div>
          </div>

          {/* Division filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {DIVISION_FILTERS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDivision(d.id)}
                className={`rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors ${
                  division === d.id
                    ? 'bg-navy-900 text-white'
                    : 'bg-white text-navy-600 hover:bg-navy-50'
                }`}
              >
                {d.label}
              </button>
            ))}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="rounded-full px-4 py-2 font-body text-sm font-semibold text-navy-500 hover:bg-navy-50"
              >
                Clear search
              </button>
            )}
          </div>

          <p className="mb-6 font-body text-sm text-navy-500">
            Showing {filtered.length} {filtered.length === 1 ? 'program' : 'programs'}
          </p>

          {/* Program grid */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center">
              <p className="font-body text-sm text-navy-500">
                No programs match your search. Try a different term.
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer(0.06, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={inViewOnce}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((program) => (
                <motion.div key={program.id} variants={fadeUpItem}>
                <Link
                  to={`/programs/${program.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between border-b border-navy-50 px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wide ${
                        program.division === 'labs'
                          ? 'bg-navy-700 text-gold-300'
                          : 'bg-gold-500/10 text-gold-700'
                      }`}
                    >
                      {program.division === 'labs' ? 'Labs' : 'Academy'}
                    </span>
                    <span className="font-mono text-xs font-semibold text-navy-400">
                      {program.code}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-bold leading-snug text-navy-900 group-hover:text-gold-700">
                      {program.title}
                    </h3>
                    <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-navy-500 line-clamp-3">
                      {program.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {program.levels.map((lvl) => (
                        <span
                          key={lvl}
                          className="rounded-full bg-navy-50 px-2.5 py-1 font-body text-[11px] font-semibold text-navy-600"
                        >
                          {lvl}
                        </span>
                      ))}
                      {program.studyModes.map((mode) => (
                        <span
                          key={mode}
                          className="rounded-full bg-gold-500/10 px-2.5 py-1 font-body text-[11px] font-semibold text-gold-700"
                        >
                          {mode}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-navy-50 pt-4">
                      <span className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-navy-900">
                        <BookOpen size={15} className="text-gold-600" />
                        {program.courseCount} {program.courseCount === 1 ? 'course' : 'courses'}
                      </span>
                      <span className="inline-flex items-center gap-1 font-body text-sm font-semibold text-gold-700">
                        Explore
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-navy-900 py-20 sm:py-24">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Ready to start your journey?
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-navy-200">
              Apply to InnoSpeak Global Academy or Labs and take the first step
              toward your future.
            </p>
            <Link
              to="/apply"
              className="btn-gold mt-8 inline-flex items-center gap-2"
            >
              Apply Now
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}