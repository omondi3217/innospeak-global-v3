import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import { COURSES, PATHWAYS } from '../lib/data/programmeData.js';
import { CATALOG_STATUS, getCourseGovernance } from '../lib/data/catalogPolicy.js';

const levels = ['All levels', 'Beginner', 'Intermediate', 'Advanced'];
const modes = ['All modes', 'Online', 'Hybrid', 'Physical / Hybrid', 'Physical'];

export default function CourseCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [pathway, setPathway] = useState(() => searchParams.get('pathway') || 'all');
  const [level, setLevel] = useState('All levels');
  const [mode, setMode] = useState('All modes');

  // Keep pathway state in sync with the URL — handles the case where the
  // user navigates from /courses (no filter) to /courses?pathway=X via an
  // in-app link, without remounting this component.
  useEffect(() => {
    setPathway(searchParams.get('pathway') || 'all');
  }, [searchParams]);

  // Push the user's selection back into the URL so the filter is
  // shareable, bookmarkable, and works with the back button.
  const handlePathwayChange = (value) => {
    setPathway(value);
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete('pathway');
    else next.set('pathway', value);
    setSearchParams(next, { replace: true });
  };

  const handleClearFilters = () => {
    setQuery('');
    setLevel('All levels');
    setMode('All modes');
    handlePathwayChange('all');
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COURSES.filter((course) => {
      const governance = getCourseGovernance(course);
      if (governance.status !== CATALOG_STATUS.ACTIVE) return false;
      if (pathway !== 'all' && course.pathwayId !== pathway) return false;
      if (level !== 'All levels' && course.level !== level) return false;
      if (mode !== 'All modes' && course.studyMode !== mode) return false;
      if (!q) return true;
      return `${course.code} ${course.name} ${course.shortDescription} ${course.category}`.toLowerCase().includes(q);
    });
  }, [query, pathway, level, mode]);

  return (
    <>
      <Seo title="Courses | InnoSpeak Global" description="Explore current InnoSpeak Global courses and choose a learning path." path="/courses" />
      <section className="bg-navy-gradient text-white">
        <div className="container-premium py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-300">Course catalogue</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Learn a skill. Build proof. Move forward.</h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/70">Explore currently offered courses across communication, technology, engineering, business, education and professional development.</p>
          </div>
          <div className="mt-8 flex max-w-3xl items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
            <Search size={19} className="ml-2 text-white/60" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent px-2 py-2 font-body text-sm text-white outline-none placeholder:text-white/45" placeholder="Search by course, code or skill…" aria-label="Search courses" />
          </div>
        </div>
      </section>

      <section className="container-premium py-12 sm:py-16">
        <div className="grid gap-4 rounded-3xl border border-navy-100 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
          <div className="flex items-center gap-2 font-body text-sm font-semibold text-navy-700"><SlidersHorizontal size={16} className="text-gold-600" /> Filters</div>
          <select value={pathway} onChange={(e) => handlePathwayChange(e.target.value)} className="rounded-xl border border-navy-100 px-3 py-2.5 font-body text-sm text-navy-700" aria-label="Filter by learning area">
            <option value="all">All learning areas</option>
            {PATHWAYS.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-xl border border-navy-100 px-3 py-2.5 font-body text-sm text-navy-700" aria-label="Filter by level">
            {levels.map((v) => <option key={v}>{v}</option>)}
          </select>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="rounded-xl border border-navy-100 px-3 py-2.5 font-body text-sm text-navy-700" aria-label="Filter by study mode">
            {modes.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div><p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Current catalogue</p><h2 className="mt-1 font-display text-2xl font-bold text-navy-900">{visible.length} courses available</h2></div>
          <Link to="/apply" className="hidden items-center gap-2 font-body text-sm font-bold text-gold-700 sm:inline-flex">Need help choosing? Apply <ArrowRight size={15} /></Link>
        </div>

        {visible.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-navy-200 bg-navy-50 p-12 text-center"><Sparkles className="mx-auto text-gold-600" /><h3 className="mt-4 font-display text-xl font-bold text-navy-900">No courses match those filters</h3><button onClick={handleClearFilters} className="btn-outline mt-5 text-sm">Clear filters</button></div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((course) => (
              <article key={course.code} className="group flex flex-col rounded-3xl border border-navy-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
                <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-gold-500/10 px-3 py-1 font-body text-[11px] font-bold text-gold-700">{course.level}</span><span className="font-mono text-[11px] font-semibold text-navy-400">{course.code}</span></div>
                <h3 className="mt-5 font-display text-xl font-bold text-navy-900">{course.name}</h3>
                <p className="mt-3 flex-1 font-body text-sm leading-6 text-navy-500">{course.shortDescription}</p>
                <div className="mt-5 grid grid-cols-2 gap-2 font-body text-xs text-navy-500"><span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{course.duration}</span><span className="inline-flex items-center gap-1.5"><BookOpen size={13} />{course.studyMode}</span></div>
                <div className="mt-5 flex items-center gap-2 border-t border-navy-100 pt-5 text-xs font-semibold text-emerald-700"><CheckCircle2 size={14} /> Currently offered</div>
                <Link to={`/courses/${course.code}`} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-3 font-body text-sm font-bold text-white transition hover:bg-navy-800">View course <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}