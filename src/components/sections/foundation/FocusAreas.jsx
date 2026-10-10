import { motion } from 'framer-motion';
import { Award, Sparkles, Heart, Laptop, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { FOCUS_AREAS } from './foundationData.js';

const ICONS = { award: Award, sparkles: Sparkles, heart: Heart, laptop: Laptop };

export default function FocusAreas() {
  return (
    <section id="foundation-programs" className="bg-cream py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Our Programs"
          title="Four Ways We Open Doors"
          subtitle="Each Foundation program targets a different barrier — education access, digital inequality, girls in STEM, and community-led impact."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-7">
          {FOCUS_AREAS.map((area, i) => {
            const Icon = ICONS[area.icon] || Award;
            return (
              <motion.article
                key={area.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                className="group flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-7 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-premium-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Program {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Name + short */}
                <h3 className="mt-5 font-display text-xl font-bold text-navy-900">
                  {area.name}
                </h3>
                <p className="mt-1 font-body text-sm font-semibold text-emerald-700">
                  {area.short}
                </p>

                {/* Description */}
                <p className="mt-3 font-body text-sm leading-6 text-navy-600">
                  {area.description}
                </p>

                {/* What the program supports */}
                <div className="mt-5 border-t border-navy-100 pt-5">
                  <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-wider text-navy-400">
                    What this program supports
                  </p>
                  <ul className="space-y-2">
                    {area.supports.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body text-sm leading-5 text-navy-700">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
                  {area.canApply && (
                    <Link
                      to={area.applyTo}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 py-2.5 font-body text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
                    >
                      Apply for Support
                      <ArrowRight size={14} />
                    </Link>
                  )}
                  <Link
                    to={area.applyTo?.replace('/apply', '/contact').replace('?division=foundation', '?interest=foundation') || '/contact'}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-2.5 font-body text-sm font-bold text-navy-900 transition-colors hover:border-emerald-400 hover:text-emerald-700"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-10 text-center font-body text-xs text-navy-500">
          Additional Foundation programs will be added over time. Each program has its own eligibility and application.
        </p>
      </div>
    </section>
  );
}