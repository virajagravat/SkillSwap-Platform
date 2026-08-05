import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Zap,
  Inbox,
  Calendar,
  Star,
  User,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/skills', label: 'Browse Skills', icon: Search },
  { path: '/matches', label: 'Smart Matches', icon: Zap, badge: 'AI' },
  { path: '/requests', label: 'Swap Requests', icon: Inbox },
  { path: '/sessions', label: 'Sessions', icon: Calendar },
  { path: '/reviews', label: 'Reviews', icon: Star },
  { path: '/profile', label: 'My Profile', icon: User },
];

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop Drawer */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-surface-dark border-r border-slate-200/80 dark:border-surface-border-dark flex flex-col justify-between transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-terracotta-500 text-white flex items-center justify-center font-serif font-bold text-lg">
                S
              </div>
              <span className="font-serif font-extrabold text-lg text-slate-900 dark:text-slate-100">
                SkillSwap
              </span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3">
              Navigation
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group',
                      isActive
                        ? 'bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-md bg-terracotta-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Widget */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-terracotta-500/10 to-amber-500/10 border border-terracotta-500/20 text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-terracotta-500 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">
              Skill Barter
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Exchange knowledge 1-on-1 with peer developers.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
