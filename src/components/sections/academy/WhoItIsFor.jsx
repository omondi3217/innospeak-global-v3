import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Globe2, Rocket } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../../../lib/motion/presets';

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: 'Students & Graduates',
    description: 'Build the communication, digital and professional skills that complement your academic qualifications.',
  },
  {
    icon: Briefcase,
    title: 'Working Professionals',
    description: 'Upskill, reskill and earn credentials that accelerate your career progression and earning potential.',
  },
  {
    icon: Globe2,
    title: 'Global Learners',
    description: 'Access internationally relevant education from anywhere with flexible online, physical and hybrid study modes.',
  },
  {
    icon: Rocket,
    title: 'Entrepreneurs & Freelancers',
    description: 'Develop the practical communication, digital and business skills needed to launch and grow your venture.',
  },
];

const container = staggerContainer(0.1, 0.1);

export default function WhoItIsFor() {
  return (
    <section aria-label="Who the Academy is for" className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Who It Is For"
          title="Built for Every Ambition"
          subtitle="Whether you are starting out, levelling up, or pivoting entirely, the Academy meets you where you are and takes you where you want to go."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {AUDIENCES.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUpItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-shadow duration-300 hover:shadow-premium-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-gradient group-hover:text-navy-900">
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
