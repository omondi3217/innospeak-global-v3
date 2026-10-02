import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  ArrowRight,
  GraduationCap,
  Award,
  Rocket,
  BookOpen,
  FileText,
  Building2,
  TrendingUp,
} from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import SectionCard from '../components/portal/SectionCard.jsx';
import { staggerContainer, fadeUpItem, inViewOnce } from '../lib/motion/presets';
import { listCareerOpportunities } from '../lib/supabase/platform.js';

const container = staggerContainer(0.1, 0.1);

const DEVELOPMENT_AREAS = [
  {
    icon: TrendingUp,
    title: 'Career Development',
    description: 'Structured guidance to help you identify, pursue and achieve your professional goals — from first role to leadership.',
  },
  {
    icon: BookOpen,
    title: 'Skills & Professional Growth',
    description: 'Build the technical, communication and leadership skills that employers and clients actually value.',
  },
  {
    icon: Rocket,
    title: 'Projects & Experience',
    description: 'Labs projects, portfolio builds and practical challenges that turn learning into demonstrable evidence.',
  },
  {
    icon: Award,
    title: 'Certificates & Achievements',
    description: 'Earn recognised credentials that validate your skills and signal your readiness to employers and partners.',
  },
];

const EMPLOYER_BENEFITS = [
  {
    icon: GraduationCap,
    title: 'Skilled Talent Pipeline',
    description: 'Connect with learners who have completed structured training and practical projects across Academy and Labs.',
  },
  {
    icon: FileText,
    title: 'Verified Credentials',
    description: 'Access certificate verification to confirm candidate qualifications and skill levels before hiring.',
  },
  {
    icon: Building2,
    title: 'Partnership Opportunities',
    description: 'Collaborate on curriculum, sponsor Labs challenges, or host internships that build your talent pipeline.',
  },
];

export default function CareerHub() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listCareerOpportunities()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <Seo
        title="Career Hub — Turn Learning Into Opportunity"
        description="Career development, skills, opportunities and resources for InnoSpeak Global learners."
        path="/career-hub"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />
        <div className="container-premium relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="eyebrow">Career Development</span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
              Turn Learning Into
              <span className="block text-gradient-gold">Opportunity</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-navy-200 md:text-lg">
              Career development, skills, practical experience, certificates and resources —
              everything you need to move from learning to earning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Career Development Areas */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Career Development"
            title="Four areas of focused growth"
            subtitle="Everything you need to move from learning to earning — structured guidance, practical skills, real projects and recognised credentials."
          />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {DEVELOPMENT_AREAS.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUpItem}
              whileHover={{ y: -4 }}
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

      {/* Opportunities */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-premium">
          <div className="mb-10">
            <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-700">
              Opportunities
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 md:text-4xl">
              Jobs, Internships & Scholarships
            </h2>
            <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-navy-500">
              Published opportunities from the InnoSpeak Global career team and partner organisations.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-navy-50 p-4 font-body text-sm text-navy-700">{error}</div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {data.length ? (
              data.map((o) => (
                <SectionCard key={o.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gold-500/10 px-3 py-1 font-body text-xs font-bold capitalize text-gold-700">
                      {o.opportunity_type}
                    </span>
                    <BriefcaseBusiness size={19} className="text-navy-400" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-navy-900">{o.title}</h3>
                  <p className="mt-1 font-body text-sm font-semibold text-navy-600">{o.organisation}</p>
                  {o.location && (
                    <p className="mt-3 font-body text-xs text-navy-500">
                      <MapPin className="mr-1 inline" size={13} />
                      {o.location}
                      {o.remote ? ' · Remote' : ''}
                    </p>
                  )}
                  <p className="mt-3 font-body text-sm leading-relaxed text-navy-500">{o.description}</p>
                  {o.skills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {o.skills.map((s) => (
                        <span key={s} className="rounded-full bg-navy-50 px-2 py-1 font-body text-[11px] font-semibold text-navy-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {o.application_url && (
                    <a
                      href={o.application_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gold mt-5 inline-flex items-center gap-2 text-sm"
                    >
                      Apply <ExternalLink size={14} />
                    </a>
                  )}
                </SectionCard>
              ))
            ) : (
              <SectionCard title="Opportunities are being curated" className="md:col-span-2">
                <p className="font-body text-sm text-navy-500">
                  Published opportunities will appear here as the career team adds them.
                  In the meantime, explore the Academy and Labs to build the skills that
                  make you stand out.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/academy" className="btn-outline inline-flex items-center gap-2 text-sm">
                    Explore Academy <ArrowRight size={14} />
                  </Link>
                  <Link to="/labs" className="btn-outline inline-flex items-center gap-2 text-sm">
                    Explore Labs <ArrowRight size={14} />
                  </Link>
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="container-premium py-20 sm:py-24">
        <div className="mb-10">
          <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-700">
            Resources
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 md:text-4xl">
            Tools for Your Career Journey
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/learn/certificates"
            className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-premium"
          >
            <Award size={24} className="text-gold-600" />
            <h3 className="mt-4 font-display text-lg font-bold text-navy-900">My Certificates</h3>
            <p className="mt-2 font-body text-sm text-navy-500">
              View and verify your earned credentials.
            </p>
            <span className="mt-3 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-800 group-hover:text-gold-700">
              View certificates <ArrowRight size={15} />
            </span>
          </Link>

          <Link
            to="/learn/portfolio"
            className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-premium"
          >
            <Rocket size={24} className="text-gold-600" />
            <h3 className="mt-4 font-display text-lg font-bold text-navy-900">Portfolio</h3>
            <p className="mt-2 font-body text-sm text-navy-500">
              Showcase your projects and practical builds.
            </p>
            <span className="mt-3 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-800 group-hover:text-gold-700">
              View portfolio <ArrowRight size={15} />
            </span>
          </Link>

          <Link
            to="/programs"
            className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-premium"
          >
            <BookOpen size={24} className="text-gold-600" />
            <h3 className="mt-4 font-display text-lg font-bold text-navy-900">Browse Programs</h3>
            <p className="mt-2 font-body text-sm text-navy-500">
              Find your next course or learning pathway.
            </p>
            <span className="mt-3 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-800 group-hover:text-gold-700">
              Explore programs <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      {/* For Employers */}
      <section className="bg-navy-900 py-20 sm:py-24">
        <div className="container-premium">
          <div className="mb-10 text-center">
            <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-300">
              For Employers & Organizations
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
              Partner With InnoSpeak Global
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-sm leading-relaxed text-navy-200">
              Connect with skilled, certified learners who have practical project experience
              across communication, technology and innovation.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
            className="grid gap-6 sm:grid-cols-3"
          >
            {EMPLOYER_BENEFITS.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeUpItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-navy-900 shadow-md">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-white/70">{description}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 text-center">
            <Link to="/contact" className="btn-gold inline-flex items-center gap-2">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
