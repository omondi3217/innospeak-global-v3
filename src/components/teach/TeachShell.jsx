import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Menu, X, PenSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teachNav } from './teachNav';
import NotificationBell from '../lms/NotificationBell.jsx';

function initials(name) {
  if (!name) return 'I';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'I';
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

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-6">
      {groupNav(teachNav).map((group) => (
        <div key={group.name}>
          <p className="px-3 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-navy-100/40">{group.name}</p>
          <div className="mt-2 flex flex-col gap-1">
            {group.items.map(({ key, label, path, icon: Icon, end }) => (
              <NavLink
                key={key}
                to={path}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 font-body text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'border-gold-400 bg-white/10 text-white'
                      : 'border-transparent text-navy-100/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={17} className="shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/teach" className="flex items-center gap-2.5 px-5 py-6">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500 text-navy-900 shadow-premium">
        <PenSquare size={18} strokeWidth={2.5} />
      </span>
      <span>
        <span className="block font-body text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">InnoSpeak</span>
        <span className="block font-display text-base font-bold leading-tight text-white">Instructor Studio</span>
      </span>
    </Link>
  );
}

function UserCard({ name, onSignOut }) {
  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 font-body text-sm font-bold text-gold-300">
          {initials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-body text-sm font-semibold text-white">{name}</p>
          <p className="truncate font-body text-xs text-navy-100/50">Instructor</p>
        </div>
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

export default function TeachShell() {
  const { profile, user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Instructor';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FA]">
      <aside className="hidden w-72 shrink-0 flex-col bg-navy-950 lg:flex">
        <Brand />
        <NavItems />
        <UserCard name={displayName} onSignOut={signOut} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex w-72 max-w-[80%] flex-col bg-navy-950 shadow-premium-lg">
            <div className="flex items-center justify-between pr-4">
              <Brand />
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <NavItems onNavigate={() => setMobileOpen(false)} />
            <UserCard name={displayName} onSignOut={signOut} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-navy-100 bg-white px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-navy-700 hover:bg-navy-50 lg:hidden">
              <Menu size={20} />
            </button>
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-wider text-gold-600">Instructor</p>
              <p className="font-display text-base font-bold text-navy-900 sm:text-lg">{displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
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
