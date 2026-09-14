import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, GraduationCap, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { learnNav } from './learnNav';
import NotificationBell from '../lms/NotificationBell.jsx';

function initials(name) {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'S';
}

function groupNav(items) {
  const groups = [];
  for (const item of items) {
    let g = groups.find((x) => x.name === item.group);
    if (!g) {
      g = { name: item.group, items: [] };
      groups.push(g);
    }
    g.items.push(item);
  }
  return groups;
}

const PAGE_TITLES = {
  '/learn': 'Student Dashboard',
  '/learn/courses': 'My Courses',
  '/learn/catalog': 'Browse Courses',
  '/learn/sessions': 'Live Sessions',
  '/learn/certificates': 'Certificates',
  '/learn/calendar': 'Calendar',
  '/learn/portfolio': 'Portfolio',
  '/learn/goals': 'Learning Goals',
  '/learn/projects': 'Projects & Labs',
  '/learn/mentorship': 'Mentorship',
};

function NavItems({ collapsed, onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-5">
      {groupNav(learnNav).map((group) => (
        <div key={group.name}>
          {!collapsed && (
            <p className="px-3 font-body text-[10px] font-bold uppercase tracking-[0.18em] text-navy-100/35">{group.name}</p>
          )}
          <div className="mt-2 flex flex-col gap-1">
            {group.items.map(({ key, label, path, icon: Icon, end }) => (
              <NavLink
                key={key}
                to={path}
                end={end}
                onClick={onNavigate}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm font-semibold transition-colors duration-150 ${
                    isActive ? 'bg-gold-500 text-navy-950' : 'text-navy-100/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={17} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand({ collapsed }) {
  return (
    <Link to="/learn" className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-900">
        <GraduationCap size={18} strokeWidth={2.5} />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate font-display text-base font-bold leading-tight text-white">InnoSpeak</span>
          <span className="block truncate font-body text-[11px] font-semibold text-gold-300">Global Academy</span>
        </span>
      )}
    </Link>
  );
}

function UserCard({ name, studentNumber, onSignOut, collapsed }) {
  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 font-body text-sm font-bold text-gold-300">
          {initials(name)}
        </span>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate font-body text-sm font-semibold text-white">{name}</p>
            {studentNumber && <p className="truncate font-body text-xs text-navy-100/50">{studentNumber}</p>}
          </div>
        )}
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Log out"
          className="shrink-0 rounded-lg p-2 text-navy-100/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default function LearnShell() {
  const { profile, user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Student';
  const pageTitle = PAGE_TITLES[location.pathname] || 'Student Dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FA]">
      {/* Desktop sidebar */}
      <aside className={`hidden shrink-0 flex-col bg-navy-950 transition-all duration-200 lg:flex ${collapsed ? 'w-[76px]' : 'w-72'}`}>
        <Brand collapsed={collapsed} />
        <NavItems collapsed={collapsed} />
        <UserCard name={displayName} studentNumber={profile?.student_number} onSignOut={signOut} collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 border-t border-white/10 px-5 py-3 font-body text-xs font-semibold text-navy-100/60 hover:text-white"
        >
          {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          {!collapsed && 'Collapse'}
        </button>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div className="absolute inset-0 bg-navy-950/70" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex w-72 max-w-[80%] flex-col bg-navy-950 shadow-premium-lg">
            <div className="flex items-center justify-between">
              <Brand collapsed={false} />
              <button type="button" onClick={() => setMobileOpen(false)} className="mr-4 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <NavItems collapsed={false} onNavigate={() => setMobileOpen(false)} />
            <UserCard name={displayName} studentNumber={profile?.student_number} onSignOut={signOut} collapsed={false} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-navy-100 bg-white px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-navy-700 hover:bg-navy-50 lg:hidden">
              <Menu size={20} />
            </button>
            <p className="truncate font-body text-sm text-navy-400">
              InnoSpeak Academy <span className="mx-1.5 text-navy-200">›</span>
              <span className="font-semibold text-navy-900">{pageTitle}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <NotificationBell />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/15 font-body text-xs font-bold text-gold-700">
              {initials(displayName)}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
