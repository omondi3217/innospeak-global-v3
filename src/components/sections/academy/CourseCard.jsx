import { Link } from 'react-router-dom';
import {
  Heart,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Globe,
  GraduationCap,
  Laptop,
  Palette,
  Briefcase,
  Rocket,
  Compass,
  HeartPulse,
  Sparkles,
  Code,
  ShieldCheck,
  Cloud,
  Brain,
  Cog,
  Film,
} from 'lucide-react';
import { getPathwayById } from '../../../lib/data/programmeData';

/**
 * CourseCard — InnoSpeak standard course card (minimal).
 * Navy icon square (top-left), gold serif code (top-right),
 * Playfair title, duration + level pills, "View Course" footer.
 * No description, no price.
 */

// Pathway → icon mapping (Academy + Labs)
const PATHWAY_ICON = {
  // Academy
  'english-communication': MessageSquare,
  'world-languages': Globe,
  'international-qualifications': GraduationCap,
  'kenya-curriculum-tvet': BookOpen,
  'digital-skills-productivity': Laptop,
  'creative-design-media': Palette,
  'business-entrepreneurship': Briefcase,
  'freelancing-remote-work': Rocket,
  'career-global': Compass,
  'education-teaching-training': GraduationCap,
  'health-hospitality-community': HeartPulse,
  'personal-life-skills': Sparkles,
  // Labs
  'software-engineering': Code,
  'data-analytics': Brain,
  'ai-intelligent-systems': Brain,
  'cloud-infrastructure': Cloud,
  cybersecurity: ShieldCheck,
  'engineering-smart-systems': Cog,
  'creative-technology': Film,
};

export default function CourseCard({
  course,
  isFavourite,
  onToggleFavourite,
  index = 0,
}) {
  const courseCode = course.code || 'COURSE';
  const courseName = course.name || course.title || 'Untitled course';
  const pathway = getPathwayById(course.pathwayId);
  const detailsTo = `/courses/${encodeURIComponent(courseCode)}`;
  const isFree = course.isFree === true;
  const Icon = PATHWAY_ICON[course.pathwayId] || BookOpen;

  return (
    <Link
      to={detailsTo}
      className="group relative flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-premium-lg sm:p-7"
    >
      {/* ── Top row: icon + code + favourite ────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400 shadow-md">
          <Icon size={22} strokeWidth={1.8} />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold tracking-wide text-gold-600">
            {courseCode}
          </span>
          {onToggleFavourite && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavourite(courseCode);
              }}
              aria-label={
                isFavourite
                  ? `Remove ${courseCode} from favourites`
                  : `Add ${courseCode} to favourites`
              }
              aria-pressed={isFavourite}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy-300 transition-colors hover:bg-gold-500/10 hover:text-gold-600"
            >
              <Heart
                size={16}
                className={isFavourite ? 'fill-gold-500 text-gold-500' : ''}
              />
            </button>
          )}
        </div>
      </div>

      {/* ── Title ───────────────────────────────────────── */}
      <h3 className="mt-5 font-display text-lg font-bold leading-snug text-navy-900 transition-colors duration-200 group-hover:text-gold-700">
        {courseName}
      </h3>

      {/* ── Pathway label ───────────────────────────────── */}
      {pathway && (
        <p className="mt-1 font-body text-xs font-medium text-navy-500">
          {pathway.title}
        </p>
      )}

      {/* ── Pills: duration + level + free ──────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {course.duration && (
          <span className="rounded-full bg-cream px-3 py-1 font-body text-xs font-medium text-navy-700 ring-1 ring-navy-100">
            {course.duration}
          </span>
        )}
        {course.level && (
          <span className="rounded-full bg-gold-500/10 px-3 py-1 font-body text-xs font-semibold text-gold-700 ring-1 ring-gold-500/20">
            {course.level}
          </span>
        )}
        {isFree && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-emerald-700">
            Free
          </span>
        )}
      </div>

      {/* ── Footer: view course ─────────────────────────── */}
      <div className="mt-auto flex items-center justify-end pt-6">
        <span className="inline-flex items-center gap-1 font-body text-sm font-bold text-navy-900 transition-all duration-300 group-hover:gap-2 group-hover:text-gold-700">
          View Course
          <ArrowRight size={15} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}