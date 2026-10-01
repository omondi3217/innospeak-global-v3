import { motion } from 'framer-motion';
import { GraduationCap, FlaskConical, School, Check, BookOpen, Cpu } from 'lucide-react';
import { SelectField } from '../../ui';
import StepCard from '../StepCard';
import {
  COURSES,
  PATHWAYS,
  TRACKS,
  INTAKES,
  STUDY_MODES,
} from '../../../lib/data/programmeData';
import { GRADE_BUNDLES } from '../../../lib/data/gradeBundles';

// The two real divisions. CBE is a section INSIDE Academy, not a separate one.
const DIVISIONS = [
  {
    id: 'academy',
    label: 'InnoSpeak Global Academy',
    icon: GraduationCap,
    tagline: 'Structured Learning & Certification',
    description:
      'Academic, professional and structured learning. Regular courses plus the CBE Academy for Grades 3–12.',
    accent: 'from-gold-500/15 to-gold-400/5',
    border: 'border-gold-500/40',
    iconBg: 'bg-gold-gradient',
  },
  {
    id: 'labs',
    label: 'InnoSpeak Global Labs',
    icon: FlaskConical,
    tagline: 'Practical Innovation & Engineering',
    description:
      'Practical learning. Engineering, technology, innovation, projects and hands-on development.',
    accent: 'from-navy-500/15 to-navy-400/5',
    border: 'border-navy-400/40',
    iconBg: 'bg-navy-700',
  },
];

// CBE pathway id — used to hide it from the regular pathway dropdown
// so it doesn't compete with the CBE section below.
const CBE_PATHWAY_ID = 'kenya-curriculum-tvet';

export default function Step1Programme({ data, errors, update }) {
  const isAcademy = data.division === 'academy';
  const isLabs = data.division === 'labs';

  // Regular pathways only (CBE handled separately below).
  const regularPathways = isAcademy
    ? PATHWAYS.filter((p) => p.id !== CBE_PATHWAY_ID)
    : [];

  const labsTracks = isLabs ? TRACKS : [];

  // Courses inside the currently selected pathway or track.
  const availableCourses = data.pathway
    ? COURSES.filter((c) => c.pathwayId === data.pathway)
    : [];

  const availableGrades = GRADE_BUNDLES;

  // Which Academy sub-route is the applicant on?
  // 'regular' | 'cbe' | null — inferred from what they've selected.
  const academyRoute = isAcademy
    ? data.grade
      ? 'cbe'
      : data.courseCode
        ? 'regular'
        : null
    : null;

  function handleDivisionChange(divisionId) {
    update({
      division: divisionId,
      pathway: '',
      programme: '',
      courseCode: '',
      grade: '',
      duration: '',
      studyMode: '',
      fees: '',
    });
  }

  function handlePathwayChange(e) {
    update({
      pathway: e.target.value,
      programme: '',
      courseCode: '',
      grade: '',
      duration: '',
      studyMode: '',
      fees: '',
    });
  }

  function handleCourseChange(e) {
    const code = e.target.value;
    const course = COURSES.find((c) => c.code === code);
    if (!course) return;
    update({
      programme: course.name,
      courseCode: course.code,
      pathway: course.pathwayId,
      grade: '',
      duration: course.duration,
      studyMode: course.studyMode,
      fees: course.isFree
        ? 'Free'
        : course.fees || `KES ${(course.feesUSD || 0) * 130}`,
    });
  }

  function handleGradeChange(e) {
    const code = e.target.value;
    const grade = GRADE_BUNDLES.find((g) => g.code === code);
    if (!grade) return;
    update({
      grade: grade.code,
      programme: grade.title,
      courseCode: grade.code,
      pathway: CBE_PATHWAY_ID,
      duration: grade.duration,
      studyMode: 'Hybrid',
      fees: `$${grade.feesUSD}`,
    });
  }

  return (
    <StepCard
      stepNum={1}
      title="Choose Your Pathway"
      description="Select your InnoSpeak Global division, then pick your route. Academy applicants choose between a regular program or the CBE Academy (Grades 3–12). Labs applicants pick a track."
    >
      {/* Pre-filled banner */}
      {data.courseCode && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/5 px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">
            Pre-selected
          </span>
          <span className="font-mono text-sm font-bold text-navy-900">{data.courseCode}</span>
          <span className="text-sm text-navy-600">— {data.programme}</span>
        </div>
      )}

      {/* ── Division cards ─────────────────────────────── */}
      <div>
        <p className="mb-4 font-body text-sm font-bold tracking-wide text-navy-900">
          Which division are you applying to?
          <span className="ml-1 text-gold-600">*</span>
        </p>
        {errors.division && (
          <p className="mb-3 font-body text-xs font-semibold text-red-500">{errors.division}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {DIVISIONS.map((div) => {
            const selected = data.division === div.id;
            const Icon = div.icon;
            return (
              <button
                key={div.id}
                type="button"
                onClick={() => handleDivisionChange(div.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                  selected
                    ? `${div.border} bg-gradient-to-br ${div.accent} shadow-lg`
                    : 'border-navy-100 bg-white hover:border-gold-300 hover:shadow-md'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-navy-900"
                  >
                    <Check size={16} strokeWidth={3} />
                  </motion.div>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${div.iconBg} text-white shadow-md`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-900">{div.label}</h3>
                    <p className="mt-0.5 font-body text-xs font-semibold uppercase tracking-wider text-gold-700">
                      {div.tagline}
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">
                      {div.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Academy: two sections ─────────────────────── */}
      {isAcademy && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="mt-6 h-px bg-gradient-to-r from-gold-300/60 via-navy-100 to-transparent" />

          <div className="space-y-6 pt-6">
            <p className="font-body text-sm text-navy-600">
              Academy has two routes. Pick whichever matches you — you can only
              enroll in one at a time.
            </p>

            {/* ═══ SECTION A — Regular Programs & Courses ═══ */}
            <section
              className={`rounded-2xl border-2 p-5 transition-all duration-300 ${
                academyRoute === 'cbe'
                  ? 'border-navy-100 bg-navy-50/40 opacity-60'
                  : academyRoute === 'regular'
                    ? 'border-gold-400/60 bg-white shadow-premium'
                    : 'border-navy-100 bg-white'
              }`}
            >
              <header className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-navy-900">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-navy-900">
                    Programs & Courses
                  </h3>
                  <p className="mt-0.5 font-body text-xs text-navy-600">
                    For adult learners, professionals and anyone not in Grade 3–12.
                  </p>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <SelectField
                  label="Pathway"
                  name="pathway"
                  value={academyRoute === 'cbe' ? '' : data.pathway}
                  onChange={handlePathwayChange}
                  error={academyRoute === 'regular' ? errors.pathway : ''}
                  placeholder="Select a pathway..."
                  options={regularPathways.map((p) => ({
                    value: p.id,
                    label: p.title,
                  }))}
                  className="sm:col-span-2"
                  disabled={academyRoute === 'cbe'}
                />

                <SelectField
                  label="Course"
                  name="programme"
                  value={academyRoute === 'cbe' ? '' : data.courseCode}
                  onChange={handleCourseChange}
                  error={academyRoute === 'regular' ? errors.programme : ''}
                  placeholder={
                    data.pathway && academyRoute !== 'cbe'
                      ? 'Select a course...'
                      : 'Select a pathway first'
                  }
                  options={availableCourses.map((c) => ({
                    value: c.code,
                    label: c.isFree
                      ? `${c.code} — ${c.name} (Free)`
                      : `${c.code} — ${c.name}`,
                  }))}
                  className="sm:col-span-2"
                  disabled={academyRoute === 'cbe' || !data.pathway}
                />
              </div>
            </section>

            {/* ═══ SECTION B — CBE Academy ═══ */}
            <section
              className={`rounded-2xl border-2 p-5 transition-all duration-300 ${
                academyRoute === 'regular'
                  ? 'border-navy-100 bg-navy-50/40 opacity-60'
                  : academyRoute === 'cbe'
                    ? 'border-emerald-400/60 bg-white shadow-premium'
                    : 'border-navy-100 bg-white'
              }`}
            >
              <header className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                  <School size={20} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-navy-900">
                    CBE Academy — Grades 3 to 12
                  </h3>
                  <p className="mt-0.5 font-body text-xs text-navy-600">
                    Kenya Competency Based Curriculum. One payment covers every subject for the selected grade.
                  </p>
                </div>
              </header>

              <SelectField
                label="Grade"
                name="grade"
                value={academyRoute === 'regular' ? '' : data.grade}
                onChange={handleGradeChange}
                error={academyRoute === 'cbe' ? errors.grade || errors.programme : ''}
                placeholder="Select a grade (Grade 3 – Grade 12)..."
                options={availableGrades.map((g) => ({
                  value: g.code,
                  label: `${g.title} — ${g.subjects.length} subjects — $${g.feesUSD}`,
                }))}
                disabled={academyRoute === 'regular'}
              />

              {academyRoute === 'cbe' && data.grade && (
                <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-body text-xs leading-relaxed text-emerald-800">
                  <strong>Grade enrollment:</strong> instructors load lesson
                  content into the LMS after you submit your application.
                </p>
              )}
            </section>

            {/* Intake + Study Mode (shared by both Academy sections) */}
            {academyRoute && (
              <div className="grid grid-cols-1 gap-5 rounded-2xl border border-navy-100 bg-white p-5 sm:grid-cols-2">
                <SelectField
                  label="Intake"
                  name="intake"
                  value={data.intake}
                  onChange={(e) => update({ intake: e.target.value })}
                  error={errors.intake}
                  required
                  placeholder="Select intake..."
                  options={INTAKES}
                />

                <SelectField
                  label="Study Mode"
                  name="studyMode"
                  value={data.studyMode}
                  onChange={(e) => update({ studyMode: e.target.value })}
                  error={errors.studyMode}
                  required
                  placeholder="Select study mode..."
                  options={STUDY_MODES}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Labs: track → course ──────────────────────── */}
      {isLabs && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="mt-6 h-px bg-gradient-to-r from-gold-300/60 via-navy-100 to-transparent" />

          <div className="space-y-5 pt-6">
            <p className="flex items-center gap-2 font-body text-sm font-bold tracking-wide text-navy-900">
              <Cpu size={16} className="text-gold-600" />
              Choose your Labs track
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectField
                label="Track"
                name="pathway"
                value={data.pathway}
                onChange={handlePathwayChange}
                error={errors.pathway}
                required
                placeholder="Select a track..."
                options={labsTracks.map((t) => ({
                  value: t.id,
                  label: t.title,
                }))}
                className="sm:col-span-2"
              />

              <SelectField
                label="Course"
                name="programme"
                value={data.courseCode}
                onChange={handleCourseChange}
                error={errors.programme}
                required
                placeholder={data.pathway ? 'Select a course...' : 'Select a track first'}
                options={availableCourses.map((c) => ({
                  value: c.code,
                  label: `${c.code} — ${c.name}`,
                }))}
                className="sm:col-span-2"
              />

              <SelectField
                label="Intake"
                name="intake"
                value={data.intake}
                onChange={(e) => update({ intake: e.target.value })}
                error={errors.intake}
                required
                placeholder="Select intake..."
                options={INTAKES}
              />

              <SelectField
                label="Study Mode"
                name="studyMode"
                value={data.studyMode}
                onChange={(e) => update({ studyMode: e.target.value })}
                error={errors.studyMode}
                required
                placeholder="Select study mode..."
                options={STUDY_MODES}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Auto-filled summary (all divisions) ───────── */}
      {(data.duration || data.fees) && (
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-cream px-5 py-4 sm:grid-cols-3">
          {data.duration && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-navy-600">
                Duration
              </p>
              <p className="mt-1 text-sm font-bold text-navy-900">{data.duration}</p>
            </div>
          )}
          {data.fees && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-navy-600">
                Fees
              </p>
              <p className="mt-1 text-sm font-bold text-navy-900">{data.fees}</p>
            </div>
          )}
          {data.courseCode && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-navy-600">
                {data.grade ? 'Grade' : 'Course Code'}
              </p>
              <p className="mt-1 text-sm font-bold text-navy-900">{data.courseCode}</p>
            </div>
          )}
        </div>
      )}
    </StepCard>
  );
}