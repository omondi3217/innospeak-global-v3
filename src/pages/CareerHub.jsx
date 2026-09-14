import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  Search,
  Clock3,
  FolderKanban,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import SectionCard from '../components/portal/SectionCard.jsx';
import StatCard from '../components/portal/StatCard.jsx';
import StatusBadge from '../components/portal/StatusBadge.jsx';
import { LoadingState, ErrorState, EmptyState } from '../components/portal/PortalStates.jsx';
import { listCareerOpportunities } from '../lib/supabase/platform.js';

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'internship', label: 'Internships' },
  { value: 'job', label: 'Jobs' },
  { value: 'scholarship', label: 'Scholarships' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'project', label: 'Projects' },
];

const TOOLKIT_LINKS = [
  {
    to: '/learn/portfolio',
    icon: FolderKanban,
    title: 'Build Your Portfolio',
    description: 'Turn completed courses and practical work into evidence employers can see.',
  },
  {
    to: '/learn/mentorship',
    icon: Users,
    title: 'Request Mentorship',
    description: 'Get guidance on interviews, career direction and professional growth.',
  },
  {
    to: '/learn/goals',
    icon: Target,
    title: 'Set Learning Goals',
    description: 'Turn your career ambitions into clear, trackable milestones.',
  },
];

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

function ClosingBadge({ closingDate }) {
  const days = daysUntil(closingDate);
  if (days === null) return null;
  if (days < 0) return <StatusBadge status="closed" />;
  if (days <= 7) return <span className="rounded-full bg-rose-50 px-2.5 py-1 font-body text-xs font-semibold text-rose-700">Closes in {days} day{days === 1 ? '' : 's'}</span>;
  return <span className="rounded-full bg-navy-50 px-2.5 py-1 font-body text-xs font-semibold text-navy-500">Closes {new Date(closingDate).toLocaleDateString()}</span>;
}

export default function CareerHub() {
  const [state, setState] = useState({ loading: true, error: null, opportunities: [] });
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  useEffect(() => {
    listCareerOpportunities()
      .then((opportunities) => setState({ loading: false, error: null, opportunities }))
      .catch((err) => setState({ loading: false, error: err.message || 'Could not load opportunities.', opportunities: [] }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.opportunities.filter((o) => {
      if (typeFilter !== 'all' && o.opportunity_type !== typeFilter) return false;
      if (remoteOnly && !o.remote) return false;
      if (!q) return true;
      const haystack = `${o.title} ${o.organisation} ${o.description} ${(o.skills || []).join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [state.opportunities, query, typeFilter, remoteOnly]);

  const closingSoonCount = state.opportunities.filter((o) => {
    const d = daysUntil(o.closing_date);
    return d !== null && d >= 0 && d <= 7;
  }).length;

  const needsSignIn = state.error && /sign in/i.test(state.error);

  return (
    <>
      <Seo title="Career Hub" description="Jobs, internships, scholarships and career tools for InnoSpeak Global learners." path="/career-hub" />

      <section className="bg-navy-gradient text-white">
        <div className="container-premium py-16 sm:py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-300">Career Development</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">Career Hub</h1>
          <p className="mt-4 max-w-2xl font-body text-base leading-7 text-white/70">
            Turn learning into opportunity — real internships, jobs, scholarships and projects, plus the tools to
            prepare a standout application.
          </p>

          <div className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
            <Search size={18} className="ml-2 shrink-0 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search opportunities by title, organisation or skill…"
              className="w-full bg-transparent px-2 py-2 font-body text-sm text-white outline-none placeholder:text-white/45"
            />
          </div>
        </div>
      </section>

      <section className="container-premium py-12 sm:py-16">
        {!state.loading && !state.error && (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={BriefcaseBusiness} label="Open Opportunities" value={state.opportunities.length} />
            <StatCard icon={Clock3} label="Closing This Week" value={closingSoonCount} />
            <StatCard icon={MapPin} label="Remote-Friendly" value={state.opportunities.filter((o) => o.remote).length} />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={`shrink-0 rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors ${
                typeFilter === opt.value ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 font-body text-sm text-navy-600">
            <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
            Remote only
          </label>
        </div>

        <div className="mt-8">
          {state.loading && <LoadingState />}

          {!state.loading && needsSignIn && (
            <EmptyState
              icon={BriefcaseBusiness}
              title="Sign in to view opportunities"
              message="Career opportunities are available to logged-in students."
              action={
                <Link to="/login" className="btn-gold inline-flex items-center gap-2">
                  Log In <ArrowRight size={15} />
                </Link>
              }
            />
          )}

          {!state.loading && state.error && !needsSignIn && <ErrorState message={state.error} />}

          {!state.loading && !state.error && filtered.length === 0 && (
            <EmptyState
              icon={BriefcaseBusiness}
              title={state.opportunities.length === 0 ? 'Opportunities are being curated' : 'No matches'}
              message={
                state.opportunities.length === 0
                  ? 'Published opportunities will appear here as the career team adds them.'
                  : 'Try a different search term or filter.'
              }
            />
          )}

          {!state.loading && !state.error && filtered.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {filtered.map((o) => (
                <SectionCard key={o.id}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gold-500/10 px-3 py-1 font-body text-xs font-bold capitalize text-gold-700">
                      {o.opportunity_type}
                    </span>
                    <ClosingBadge closingDate={o.closing_date} />
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold text-navy-900">{o.title}</h2>
                  <p className="mt-1 font-body text-sm font-semibold text-navy-600">{o.organisation}</p>
                  {o.location && (
                    <p className="mt-3 flex items-center gap-1 font-body text-xs text-navy-500">
                      <MapPin size={13} /> {o.location}
                      {o.remote ? ' · Remote' : ''}
                    </p>
                  )}
                  {o.description && <p className="mt-3 font-body text-sm leading-6 text-navy-500">{o.description}</p>}
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
              ))}
            </div>
          )}
        </div>

        {/* Career Toolkit */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-navy-900">Your Career Toolkit</h2>
          <p className="mt-2 font-body text-sm text-navy-500">Everything you need to turn learning into a career, in one place.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {TOOLKIT_LINKS.map(({ to, icon: Icon, title, description }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-2xl border border-navy-100 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 ring-1 ring-gold-500/20">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-navy-900">{title}</h3>
                <p className="mt-2 font-body text-sm leading-6 text-navy-500">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-bold text-gold-700 group-hover:text-gold-800">
                  Get started <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
