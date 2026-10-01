import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Users, TrendingUp } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const PILLARS = [
  {
    icon: Lightbulb,
    title: 'From Idea to Prototype',
    description: 'Turn concepts into working prototypes through structured build cycles, mentor feedback and peer collaboration.',
  },
  {
    icon: Rocket,
    title: 'Startup Incubation',
    description: 'Develop viable ventures with guidance on product, market fit, technical architecture and go-to-market strategy.',
  },
  {
    icon: Users,
    title: 'Team-Based Builds',
    description: 'Work in cross-functional teams that mirror real engineering organisations — designers, developers, analysts and product thinkers.',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Innovation',
    description: 'Build projects designed to scale — from local community solutions to globally deployable products and services.',
  },
];

const container = staggerContainer(0.1, 0.1);

export default function EntrepreneurshipInnovation() {
  return (
    <section aria-label="Entrepreneurship and innovation" className="bg-navy-900 py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Entrepreneurship & Innovation"
          title="Build Something Real"
          subtitle="Labs is where ideas become products. Whether you are launching a startup or building a portfolio, the innovation framework supports your journey from concept to showcase."
          light
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUpItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-navy-900 shadow-md">
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-white/70">{description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm"
        >
          <p className="mx-auto max-w-2xl font-display text-lg font-medium italic text-white/80">
            Project showcases and build galleries will appear here as learner teams
            complete their innovation cycles.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
