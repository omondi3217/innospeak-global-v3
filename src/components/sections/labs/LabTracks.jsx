import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Code, Cloud, ShieldCheck, ChartBar as BarChart3, Cog, Sparkles, ChevronDown, CircleCheck as CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import {
  staggerContainer,
  fadeUpItem,
  inViewOnce,
  easeOutExpo,
} from '../../../lib/motion/presets';
import { LAB_SCHOOLS } from '../../../lib/data/labsData';

const ICON_MAP = {
  Brain: Brain,
  Code: Code,
  Cloud: Cloud,
  ShieldCheck: ShieldCheck,
  BarChart3: BarChart3,
  Cog: Cog,
  Sparkles: Sparkles,
};

const container = staggerContainer(0.1, 0.1);

function SchoolCard({ school, isOpen, onToggle }) {
  const Icon = ICON_MAP[school.icon] || Brain;

  return (
    <motion.div variants={fadeUpItem} className="h-full">
      <div
        className={`overflow-hidden rounded-2xl border bg-white shadow-premium transition-all duration-300 ${
          isOpen
            ? 'border-gold-300/60 shadow-premium-lg'
            : 'border-navy-100 hover:border-gold-300/60 hover:shadow-premium-lg'
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`school-detail-${school.id}`}
          className="flex w-full items-start gap-4 p-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${
              isOpen ? 'bg-gold-gradient text-navy-900' : 'bg-navy-900 text-gold-400'
            }`}
          >
            <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-navy-900">{school.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">{school.description}</p>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-900"
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`school-detail-${school.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className="overflow-hidden"
            >
              <div className="border-t border-navy-100 px-7 pb-7 pt-6">
                <p className="mb-3 font-body text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Tracks
                </p>
                <ul className="space-y-2">
                  {school.tracks.map((track, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 font-body text-sm leading-relaxed text-navy-700"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-gold-600"
                        aria-hidden="true"
                      />
                      {track}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 mb-2 font-body text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {school.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-navy-50 px-3 py-1 font-mono text-xs font-medium text-navy-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LabTracks() {
  const [openId, setOpenId] = useState('ai-intelligent-systems');

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-premium">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          <SectionHeading
            eyebrow="Pathways"
            title="Seven Innovation Pathways"
            subtitle="Each pathway focuses on a different domain — pick the one that matches what you want to build."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {LAB_SCHOOLS.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                isOpen={openId === school.id}
                onToggle={() => setOpenId(openId === school.id ? null : school.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
