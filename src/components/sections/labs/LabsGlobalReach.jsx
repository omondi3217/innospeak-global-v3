import { motion } from 'framer-motion';
import { Globe2, Users, BookOpen, Smile } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';
import { IMPACT_STATS } from '../../home/impactData';

// These four are the ones genuinely relevant to "global reach" out of the
// full IMPACT_STATS set — reused as-is from the real, already-published
// site-wide stats (no fabricated numbers for Labs specifically).
const REACH_ICON_MAP = {
  countries: Globe2,
  trainers: Users,
  programmes: BookOpen,
  satisfaction: Smile,
};

const container = staggerContainer(0.1, 0.1);

export default function LabsGlobalReach() {
  const reachStats = IMPACT_STATS.filter((s) => REACH_ICON_MAP[s.id]);

  return (
    <section className="relative overflow-hidden bg-navy-gradient py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <div className="container-premium relative">
        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={inViewOnce}>
          <motion.div variants={fadeUpItem} className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-wider text-gold-400">
              Global Reach
            </span>
          </motion.div>
          <SectionHeading
            title="Builders Learning From Everywhere"
            subtitle="Labs learners join a network that already spans multiple countries — building real, portfolio-ready projects alongside peers worldwide."
            light
            className="mt-3"
          />

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {reachStats.map((stat) => {
              const Icon = REACH_ICON_MAP[stat.id] || Globe2;
              return (
                <motion.div
                  key={stat.id}
                  variants={fadeUpItem}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-display text-3xl font-bold text-white">
                    {stat.value}
                    <span className="text-gold-400">{stat.suffix}</span>
                  </p>
                  <p className="mt-1 font-body text-xs font-semibold uppercase tracking-wider text-navy-200">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
