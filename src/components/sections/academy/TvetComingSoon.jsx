import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, BookOpen, ArrowRight, Hammer, Wrench, GraduationCap, FileCheck } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { TVET_LEVELS } from '../../../lib/data/gradeBundles.js';

/**
 * TvetComingSoon — 4 elegantly-presented "coming soon" cards for the
 * Artisan, Craft, Diploma and Higher Diploma TVET levels.
 *
 * Reads from TVET_LEVELS in gradeBundles.js so the display is always
 * in sync with the underlying data.
 */

const ICON_MAP = {
  ART: Hammer,
  CRF: Wrench,
  DIP: GraduationCap,
  HDP: FileCheck,
};

const COLOR_MAP = {
  ART: {
    surface: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-500',
    accent: 'text-amber-700',
  },
  CRF: {
    surface: 'bg-sky-50',
    border: 'border-sky-200',
    iconBg: 'bg-sky-500',
    accent: 'text-sky-700',
  },
  DIP: {
    surface: 'bg-violet-50',
    border: 'border-violet-200',
    iconBg: 'bg-violet-500',
    accent: 'text-violet-700',
  },
  HDP: {
    surface: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-500',
    accent: 'text-emerald-700',
  },
};

export default function TvetComingSoon() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Launching Soon"
          title={
            <>
              TVET Pathways
              <span className="block text-gradient-gold">Artisan · Craft · Diploma · Higher Diploma</span>
            </>
          }
          subtitle="Structured technical and vocational pathways aligned with KNEC and CBET frameworks. Coming to InnoSpeak Academy in the next curriculum release."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TVET_LEVELS.map((level, i) => {
            const Icon = ICON_MAP[level.code] || Award;
            const colors = COLOR_MAP[level.code] || COLOR_MAP.DIP;

            return (
              <motion.div
                key={level.code}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 ${colors.border} ${colors.surface} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg`}
              >
                {/* Coming Soon badge */}
                <span className="absolute right-4 top-4 rounded-full bg-navy-900 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  Coming Soon
                </span>

                {/* Icon */}
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.iconBg} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                {/* Title + code */}
                <h3 className="font-display text-xl font-bold text-navy-900">
                  {level.title}
                </h3>
                <p className={`mt-1 font-mono text-xs font-semibold tracking-wide ${colors.accent}`}>
                  TVET · {level.code}
                </p>

                {/* Description */}
                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-navy-600">
                  {level.description}
                </p>

                {/* Meta */}
                <dl className="mt-5 space-y-2.5 border-t border-navy-100 pt-4">
                  <div className="flex items-center gap-2 font-body text-xs text-navy-600">
                    <Award size={13} className="flex-shrink-0 text-navy-400" />
                    <dt className="sr-only">Entry requirement</dt>
                    <dd>
                      <span className="font-semibold text-navy-900">Entry:</span>{' '}
                      {level.entryRequirement}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2 font-body text-xs text-navy-600">
                    <BookOpen size={13} className="flex-shrink-0 text-navy-400" />
                    <dt className="sr-only">Modules</dt>
                    <dd>
                      <span className="font-semibold text-navy-900">Modules:</span>{' '}
                      {level.modules}
                    </dd>
                  </div>
                </dl>

                {/* CTA */}
                <Link
                  to="/contact?interest=tvet"
                  className="mt-5 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-800 transition-colors hover:text-gold-700"
                >
                  Notify me when live
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center font-body text-xs text-navy-500">
          TVET levels launch with our next curriculum release. Registered learners are notified first.
        </p>
      </div>
    </section>
  );
}