import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Academy from './pages/Academy.jsx';
import Programs from './pages/Programs.jsx';
import ProgramDetails from './pages/ProgramDetails.jsx';
import CourseCatalog from './pages/CourseCatalog.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Foundation from './pages/Foundation.jsx';
import Labs from './pages/Labs.jsx';
import Founder from './pages/Founder.jsx';
import Impact from './pages/Impact.jsx';
import Contact from './pages/Contact.jsx';
import Apply from './pages/Apply.jsx';
import Research from './pages/Research.jsx';
import Tutor from './pages/Tutor.jsx';
import News from './pages/News.jsx';
import Events from './pages/Events.jsx';
import Community from './pages/Community.jsx';
import Partnerships from './pages/Partnerships.jsx';
import Careers from './pages/Careers.jsx';
import FAQ from './pages/FAQ.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import StudentDashboard from './pages/portal/StudentDashboard.jsx';
import PortalShell from './components/portal/PortalShell.jsx';
import Profile from './pages/portal/Profile.jsx';
import Registration from './pages/portal/Registration.jsx';
import Records from './pages/portal/Records.jsx';
import Finance from './pages/portal/Finance.jsx';
import Timetable from './pages/portal/Timetable.jsx';
import Attendance from './pages/portal/Attendance.jsx';
import Exams from './pages/portal/Exams.jsx';
import Documents from './pages/portal/Documents.jsx';
import Communication from './pages/portal/Communication.jsx';
import Requests from './pages/portal/Requests.jsx';
import Support from './pages/portal/Support.jsx';
import Graduation from './pages/portal/Graduation.jsx';
import ChangePassword from './pages/portal/ChangePassword.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import AdminShell from './components/admin/AdminShell.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminStudents from './pages/admin/Students.jsx';
import AdminStudentDetail from './pages/admin/StudentDetail.jsx';
import AdminApplications from './pages/admin/Applications.jsx';
import AdminContactMessages from './pages/admin/ContactMessages.jsx';
import AdminPrograms from './pages/admin/Programs.jsx';
import AdminSemesters from './pages/admin/Semesters.jsx';
import AdminUnits from './pages/admin/Units.jsx';
import AdminTimetableExams from './pages/admin/TimetableExams.jsx';
import AdminFeeStructures from './pages/admin/FeeStructures.jsx';
import AdminRequests from './pages/admin/Requests.jsx';
import AdminSupport from './pages/admin/Support.jsx';
import AdminGraduation from './pages/admin/Graduation.jsx';
import AdminAnnouncements from './pages/admin/Announcements.jsx';
import AdminLmsOverview from './pages/admin/LmsOverview.jsx';
import AdminCohorts from './pages/admin/Cohorts.jsx';
import AdminCareerOpportunities from './pages/admin/CareerOpportunities.jsx';
import InstructorRoute from './components/auth/InstructorRoute.jsx';
import TeachShell from './components/teach/TeachShell.jsx';
import TeachDashboard from './pages/teach/TeachDashboard.jsx';
import CourseBuilder from './pages/teach/CourseBuilder.jsx';
import QuizEditor from './pages/teach/QuizEditor.jsx';
import Submissions from './pages/teach/Submissions.jsx';
import SessionsManager from './pages/teach/SessionsManager.jsx';
import Gradebook from './pages/teach/Gradebook.jsx';
import LearnShell from './components/learn/LearnShell.jsx';
import LearnDashboard from './pages/learn/LearnDashboard.jsx';
import MyCourses from './pages/learn/MyCourses.jsx';
import Catalog from './pages/learn/Catalog.jsx';
import Sessions from './pages/learn/Sessions.jsx';
import Calendar from './pages/learn/Calendar.jsx';
import Portfolio from './pages/learn/Portfolio.jsx';
import Goals from './pages/learn/Goals.jsx';
import Projects from './pages/learn/Projects.jsx';
import Mentorship from './pages/learn/Mentorship.jsx';
import Certificates from './pages/learn/Certificates.jsx';
import CertificateVerify from './pages/learn/CertificateVerify.jsx';
import CareerHub from './pages/CareerHub.jsx';
import CourseView from './pages/learn/CourseView.jsx';
import LessonView from './pages/learn/LessonView.jsx';
import AssignmentView from './pages/learn/AssignmentView.jsx';
import QuizAttempt from './pages/learn/QuizAttempt.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:slug" element={<ProgramDetails />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:courseCode" element={<CourseDetails />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/research" element={<Research />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/community" element={<Community />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/career-hub" element={<CareerHub />} />
          <Route path="/verify-certificate" element={<CertificateVerify />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Student portal (requires login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/portal" element={<PortalShell />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="registration" element={<Registration />} />
              <Route path="records" element={<Records />} />
              <Route path="finance" element={<Finance />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="exams" element={<Exams />} />
              <Route path="documents" element={<Documents />} />
              <Route path="communication" element={<Communication />} />
              <Route path="requests" element={<Requests />} />
              <Route path="support" element={<Support />} />
              <Route path="graduation" element={<Graduation />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>

          {/* Admin panel (requires admin role) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminShell />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="students/:id" element={<AdminStudentDetail />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="messages" element={<AdminContactMessages />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="semesters" element={<AdminSemesters />} />
              <Route path="units" element={<AdminUnits />} />
              <Route path="timetable-exams" element={<AdminTimetableExams />} />
              <Route path="fees" element={<AdminFeeStructures />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="graduation" element={<AdminGraduation />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="cohorts" element={<AdminCohorts />} />
              <Route path="career-opportunities" element={<AdminCareerOpportunities />} />
              <Route path="lms" element={<AdminLmsOverview />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* LMS — student learning (any authenticated user). Own full-screen
            app shell, deliberately NOT nested under AppLayout — no public
            navbar/footer here. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/learn" element={<LearnShell />}>
            <Route index element={<LearnDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="goals" element={<Goals />} />
            <Route path="projects" element={<Projects />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="courses/:courseId" element={<CourseView />} />
            <Route path="lessons/:lessonId" element={<LessonView />} />
            <Route path="assignments/:assignmentId" element={<AssignmentView />} />
            <Route path="quizzes/:quizId" element={<QuizAttempt />} />
          </Route>
        </Route>

        {/* LMS — instructor teaching tools (instructor / lms_admin / admin).
            Same standalone treatment as /learn. */}
        <Route element={<InstructorRoute />}>
          <Route path="/teach" element={<TeachShell />}>
            <Route index element={<TeachDashboard />} />
            <Route path="courses/:courseId" element={<CourseBuilder />} />
            <Route path="courses/:courseId/submissions" element={<Submissions />} />
            <Route path="courses/:courseId/gradebook" element={<Gradebook />} />
            <Route path="sessions" element={<SessionsManager />} />
            <Route path="quizzes/:quizId" element={<QuizEditor />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>

  );
}