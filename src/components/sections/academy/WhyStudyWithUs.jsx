import { motion } from 'framer-motion';
import {
  UserCheck,
  Clock,
  FolderCheck,
  LifeBuoy,
  Globe2,
  Wallet,
} from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

/**
 * WhyStudyWithUs — six premium feature cards.
 *
 * Same premium-card recipe as AboutAcademy/Certification, plus the
 * (font-display text-navy-100). The cards previously had no motion
 * wrapper, so the imported stagger animation never actually ran on
 * them — wired that up here with fadeUpItem, same as every other
 * Academy section.
 */

const REASONS = [
  {
    icon: UserCheck,
    title: 'Experienced Trainers',
    description: 'Learn from experienced educators, practitioners and industry leaders.',
  },
  {
    icon: Clock,
    title: 'Flexible Learning',
    description: 'Online, physical and hybrid modes that fit your schedule and goals.',
  },
  {
    icon: FolderCheck,
    title: 'Practical Projects',
    description: 'Apply your learning through hands-on, real-world projects and tasks.',
  },
  {
    icon: LifeBuoy,
    title: 'Career Support',
    description: 'Mentorship, guidance and opportunities that extend beyond the classroom.',
  },
  {
    icon: Globe2,
    title: 'International Standards',
    description: 'Curricula benchmarked to international standards of excellence.',
  },
  {
    icon: Wallet,
    title: 'Affordable Fees',
    description: 'Premium education at accessible fees, with flexible payment options.',
  },
];

const container = staggerContainer(0.1, 0.1);

function ReasonCard({ icon: Icon, title, description, index }) {
  return (
    <motion.article
      variants={fadeUpItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full overflow-hidden rounded-2xl border border-navy-100 bg-white p-7 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
        <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
      </div>

      <h3 className="relative mt-5 font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="relative mt-3 font-body text-sm leading-relaxed text-navy-600">{description}</p>

      {/* Decorative number */}
      <span
        className="pointer-events-none absolute right-6 top-6 font-display text-5xl font-bold text-navy-100"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.article>
  );
}

export default function WhyStudyWithUs() {
  return (
    <section aria-label="Why study with us" className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Why Study With Us"
          title="An Academy Built Around Your Growth"
          subtitle="We combine expert instruction, flexible learning and genuine career support to give you an education that truly moves you forward."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {REASONS.map((reason, i) => (
            <ReasonCard key={reason.title} index={i} {...reason} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}