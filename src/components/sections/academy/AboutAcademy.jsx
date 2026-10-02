import { motion } from 'framer-motion';
import { Clock, BookOpenCheck, Award, Globe2 } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import {
  staggerContainer,
  fadeUpItem,
  inViewOnce,
} from '../../../lib/motion/presets';

/**
 * AboutAcademy — introduces the Academy using the verified live Home
 * pattern (not the orphaned sections/home tree): ui/SectionHeading for
 * the header, and the solid "premium card" language from
 * home/EcosystemCard.jsx + home/WhyChooseCard.jsx for the feature grid
 * (bg-white border-navy-100 shadow-premium, navy-900/gold-400 icon
 * badge inverting to gold-gradient on hover). Glassmorphism is
 * intentionally not used here — on the live site it's reserved for
 * floating pills/badges over dark or image backgrounds, not for
 * content cards on a light section.
 */

const FEATURES = [
  {
    icon: Clock,
    title: 'Flexible Learning',
    description:
      'Study online, on campus or through hybrid programmes designed to fit around your lifestyle and career ambitions.',
  },
  {
    icon: BookOpenCheck,
    title: 'Industry Relevant Curriculum',
    description:
      'Practical learning pathways aligned with international standards and real-world employer expectations.',
  },
  {
    icon: Award,
    title: 'Professional Certification',
    description:
      'Earn recognised qualifications and certifications that strengthen your academic and professional profile.',
  },
  {
    icon: Globe2,
    title: 'Global Career Preparation',
    description:
      'Develop future-ready skills, confidence and international exposure for opportunities across the world.',
  },
];

const container = staggerContainer(0.1, 0.15);

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.article
      variants={fadeUpItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="
        group flex h-full flex-col rounded-2xl border border-navy-100
        bg-white p-7 shadow-premium transition-shadow duration-300
        hover:shadow-premium-lg
      "
    >
      <div
        className="
          flex h-14 w-14 items-center justify-center rounded-2xl
          bg-navy-900 text-gold-400 transition-colors duration-300
          group-hover:bg-gold-gradient group-hover:text-navy-900
        "
      >
        <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
      </div>

      <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
        {title}
      </h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">
        {description}
      </p>
    </motion.article>
  );
}

export default function AboutAcademy() {
  return (
    <section aria-label="About the Academy" className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="About The Academy"
          title="Flexible Learning for Every Ambition"
          subtitle="InnoSpeak Global Academy empowers students, professionals, graduates and lifelong learners through flexible, internationally relevant education that builds confidence, practical expertise and global career readiness."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}