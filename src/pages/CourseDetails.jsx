import { useParams, Navigate } from 'react-router-dom';
import useDocumentTitle from '../lib/hooks/useDocumentTitle';
import { buildCourseData } from '../lib/data/courseDetails';
import CourseHero from '../components/sections/course/CourseHero';
import EnrollButton from '../components/portal/EnrollButton';
import CourseOverview from '../components/sections/course/CourseOverview';
import KeyInfoCards from '../components/sections/course/KeyInfoCards';
import LearningOutcomes from '../components/sections/course/LearningOutcomes';
import CourseModules from '../components/sections/course/CourseModules';
import EntryRequirements from '../components/sections/course/EntryRequirements';
import Assessment from '../components/sections/course/Assessment';
import Certification from '../components/sections/course/Certification';
import CareerOpportunities from '../components/sections/course/CareerOpportunities';
import RelatedCourses from '../components/sections/course/RelatedCourses';
import CourseFAQ from '../components/sections/course/CourseFAQ';
import StudentReviews from '../components/sections/course/StudentReviews';
import FinalCTA from '../components/sections/course/FinalCTA';

/**
 * CourseDetails — reusable course details template page.
 *
 * Loads course data from the course data object (structured for future
 * Firestore migration). Renders all sections in order with alternating
 * backgrounds. If the course code is not found, redirects to the
 * Academy page.
 */
export default function CourseDetails() {
  const { courseCode } = useParams();
  const course = buildCourseData(courseCode?.toUpperCase());

  useDocumentTitle(
    course ? `${course.name} (${course.code}) — InnoSpeak Global Academy` : 'Course Not Found — InnoSpeak Global'
  );

  if (!course) return <Navigate to="/academy" replace />;

  return (
    <>
      <CourseHero course={course} />

      {/* Enrollment / checkout entry point. Free courses enroll directly;
          paid courses open the M-PESA / PayPal CheckoutModal. */}
      <section className="bg-cream px-5 pt-10 sm:px-8">
        <EnrollButton course={course} />
      </section>

      <CourseOverview course={course} />
      <KeyInfoCards course={course} />
      <LearningOutcomes course={course} />
      <CourseModules course={course} />
      <EntryRequirements course={course} />
      <Assessment course={course} />
      <Certification course={course} />
      <CareerOpportunities course={course} />
      <RelatedCourses course={course} />
      <CourseFAQ course={course} />
      <StudentReviews course={course} />
      <FinalCTA course={course} />
    </>
  );
}
