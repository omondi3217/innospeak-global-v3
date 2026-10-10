import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Heart } from 'lucide-react';
import SectionHeading from '../../ui/SectionHeading.jsx';
import { FOUNDATION_INITIATIVES } from './foundationData.js';

/**
 * FoundationInitiatives — live funded projects with progress tracking.
 * Each initiative belongs to one of the four Foundation programs.
 * Sponsors can fund an initiative; learners/projects can apply for support.
 */
export default function FoundationInitiatives() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Active Initiatives"
          title="Funded Programs, Live Right Now"
          subtitle="Each initiative belongs to one Foundation program. Every contribution goes directly to learner support, digital access or community project funding."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-7">
          {FOUNDATION_INITIATIVES.map((initiative, i) => {
            const progress =
              initiative.goal > 0
                ? Math.min((initiative.raised / initiative.goal) * 100, 100)
                : 0;

            return (
              <motion.article
                key={initiative.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-premium-lg"
              >
                {/* Progress bar at top */}
                <div className="relative h-2 bg-emerald-100">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex flex-1 flex-col p-7">
                  {/* Category + status */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {initiative.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-gold-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                      {initiative.status === 'recruiting'
                        ? 'Recruiting'
                        : initiative.status === 'funded'
                          ? 'Fully Funded'
                          : 'Active'}
                    </span>
                  </div>

                  {/* Title + description */}
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
                    {initiative.title}
                  </h3>
                  <p className="mt-2 flex-1 font-body text-sm leading-6 text-navy-600">
                    {initiative.description}
                  </p>

                  {/* Progress numbers */}
                  <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-body text-[10px] font-bold uppercase tracking-wider text-navy-500">
                          Raised
                        </p>
                        <p className="mt-0.5 font-display text-lg font-bold text-emerald-700">
                          {initiative.currency === 'USD' ? '$' : ''}
                          {initiative.raised.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-body text-[10px] font-bold uppercase tracking-wider text-navy-500">
                          Goal
                        </p>
                        <p className="mt-0.5 font-display text-lg font-bold text-navy-900">
                          {initiative.currency === 'USD' ? '$' : ''}
                          {initiative.goal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between font-body text-xs">
                      <span className="font-semibold text-emerald-700">
                        {progress.toFixed(0)}% funded
                      </span>
                      <span className="text-navy-500">
                        {Math.max(initiative.goal - initiative.raised, 0).toLocaleString()}{' '}
                        {initiative.currency} to go
                      </span>
                    </div>
                  </div>

                  {/* Beneficiaries + target */}
                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-navy-100 pt-5">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-emerald-600" />
                      <div>
                        <div className="font-body text-sm font-bold text-navy-900">
                          {initiative.beneficiaries}
                        </div>
                        <div className="font-body text-[10px] uppercase tracking-wider text-navy-500">
                          Beneficiaries
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-emerald-600" />
                      <div>
                        <div className="font-body text-sm font-bold text-navy-900">
                          {initiative.category}
                        </div>
                        <div className="font-body text-[10px] uppercase tracking-wider text-navy-500">
                          Foundation Program
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Link
                      to={`/contact?interest=foundation-donate-${initiative.id}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 py-2.5 font-body text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
                    >
                      <Heart size={14} />
                      Support This
                    </Link>
                    <Link
                      to="/apply?division=foundation"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-2.5 font-body text-sm font-bold text-navy-900 transition-colors hover:border-emerald-400 hover:text-emerald-700"
                    >
                      Apply for Support
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Closing note */}
        <p className="mx-auto mt-10 max-w-2xl text-center font-body text-xs leading-6 text-navy-500">
          Foundation staff assess every application and allocate funding to the learners and
          projects where it will have the greatest impact.
        </p>
      </div>
    </section>
  );
}