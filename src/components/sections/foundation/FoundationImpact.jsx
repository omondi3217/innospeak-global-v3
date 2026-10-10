import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { FOUNDATION_STATS } from './foundationData.js';

function StatTile({ stat, index }) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor(stat.value * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, stat.value]);

  return (
    <motion.div
      ref={setRef}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-premium"
    >
      <div className="font-display text-4xl font-bold text-emerald-700">
        {count}
        <span className="text-gold-500">{stat.suffix}</span>
      </div>
      <div className="mt-2 font-body text-[11px] font-bold uppercase tracking-wider text-navy-700">
        {stat.label}
      </div>
      {stat.description && (
        <p className="mt-1 font-body text-xs text-navy-500">{stat.description}</p>
      )}
    </motion.div>
  );
}

export default function FoundationImpact() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Impact at a Glance"
          title="Real Support, Real Progress"
          subtitle="Live numbers from the Foundation. Every scholarship awarded, every learner enrolled, every community reached."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FOUNDATION_STATS.map((stat, i) => (
            <StatTile key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}