import { LayoutDashboard, Video } from 'lucide-react';

export const teachNav = [
  { key: 'dashboard', label: 'My Courses', path: '/teach', icon: LayoutDashboard, end: true, group: 'Teaching' },
  { key: 'sessions', label: 'Live Sessions', path: '/teach/sessions', icon: Video, group: 'Teaching' },
];

export const teachCourseTabs = [
  { key: 'builder', label: 'Builder' },
  { key: 'students', label: 'Students' },
  { key: 'grading', label: 'Grading' },
  { key: 'settings', label: 'Settings' },
];
