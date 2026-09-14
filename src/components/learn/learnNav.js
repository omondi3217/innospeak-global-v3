import { LayoutDashboard, BookOpen, ClipboardList, PenSquare, Award, CalendarDays, Compass, BriefcaseBusiness, Target, FolderKanban, UserRound } from 'lucide-react';

export const learnNav = [
  { key: 'dashboard', label: 'Dashboard', path: '/learn', icon: LayoutDashboard, end: true, group: 'Student Portal' },
  { key: 'courses', label: 'My Courses', path: '/learn/courses', icon: BookOpen, group: 'Student Portal' },
  { key: 'catalog', label: 'Browse Courses', path: '/learn/catalog', icon: Compass, group: 'Student Portal' },
  { key: 'assessments', label: 'Live Sessions', path: '/learn/sessions', icon: ClipboardList, group: 'Student Portal' },
  { key: 'certificates', label: 'Certificates', path: '/learn/certificates', icon: Award, group: 'Student Portal' },
  { key: 'calendar', label: 'Calendar', path: '/learn/calendar', icon: CalendarDays, group: 'Student Portal' },
  { key: 'portfolio', label: 'Portfolio', path: '/learn/portfolio', icon: BriefcaseBusiness, group: 'Career' },
  { key: 'goals', label: 'Learning Goals', path: '/learn/goals', icon: Target, group: 'Career' },
  { key: 'projects', label: 'Projects & Labs', path: '/learn/projects', icon: FolderKanban, group: 'Career' },
  { key: 'mentorship', label: 'Mentorship', path: '/learn/mentorship', icon: UserRound, group: 'Career' },
];
