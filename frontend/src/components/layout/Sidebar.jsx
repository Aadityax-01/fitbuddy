import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Utensils,
  Dumbbell,
  TrendingUp,
  LogOut,
  X,
  ChevronRight,
  Moon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Home',         icon: LayoutDashboard, path: '/dashboard' },
  { label: 'AI Coach',     icon: Bot,             path: '/chatbot', badge: 'Live' },
  { label: 'Diet Planner', icon: Utensils,        path: '/diet-planner' },
  { label: 'Workout',      icon: Dumbbell,        path: '/workout-planner' },
  { label: 'Progress',     icon: TrendingUp,      path: '/progress' },
];

/**
 * FitBuddy AI Redesigned Left Sidebar
 * Simplified navigation with Home, AI Coach, Diet Planner, Workout, Progress.
 * Dark Mode and Guest controls at bottom.
 */
export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, logout, isGuest } = useAuth();
  const [hoveredPath, setHoveredPath] = useState(null);

  useEffect(() => {
    onClose?.();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col justify-between',
          'border-r border-[#1e293b] transition-transform duration-300 ease-in-out',
          'bg-[#030712] text-white',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* ── Top Section: Logo + Navigation ── */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header / Brand Logo */}
          <div className="flex items-center justify-between px-5 h-[68px] border-b border-[#1e293b]">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 bg-gradient-to-br from-[#06b6d4]/20 to-[#3b82f6]/20 border border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <span className="text-[#06b6d4] text-lg font-black leading-none">⚡</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-base tracking-tight leading-none">
                  FitBuddy <span className="text-[#06b6d4]">AI</span>
                </span>
                <span className="text-[10px] text-[#C4C4C4] font-medium tracking-wider uppercase mt-1">
                  AI Fitness Companion
                </span>
              </div>
            </Link>

            {/* Close button (mobile only) */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Simplified Navigation items: Home, AI Coach, Diet Planner, Workout, Progress */}
          <nav className="px-3 py-5 space-y-1.5 flex-1">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">
              Navigation
            </div>
            {NAV_ITEMS.map(({ label, icon: Icon, path, badge }) => {
              const active = isActive(path);
              const hovered = hoveredPath === path;

              return (
                <Link
                  key={path}
                  to={path}
                  onMouseEnter={() => setHoveredPath(path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-gradient-to-r from-[#06b6d4]/20 to-[#3b82f6]/10 text-white border border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : hovered
                      ? 'bg-[#0b1329] text-white border border-[#1e293b]'
                      : 'text-[#C4C4C4] border border-transparent hover:text-white'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    size={18}
                    className={`flex-shrink-0 transition-colors ${
                      active ? 'text-[#06b6d4]' : hovered ? 'text-[#22d3ee]' : 'text-[#94a3b8]'
                    }`}
                  />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#06b6d4]/20 text-[#22d3ee] border border-[#06b6d4]/30">
                      {badge}
                    </span>
                  )}
                  {active && (
                    <ChevronRight size={14} className="text-[#06b6d4]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Bottom Section: Dark Mode & Guest / Account Controls ── */}
        <div className="p-3 border-t border-[#1e293b] space-y-3 bg-[#030712]">
          {/* Dark Mode Indicator Card */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0b1329] border border-[#1e293b]">
            <div className="flex items-center gap-2.5">
              <Moon size={16} className="text-[#06b6d4]" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white leading-tight">Dark Mode</p>
                <p className="text-[10px] text-[#C4C4C4]">Pure Black #000</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"></span>
          </div>

          {/* Guest / Account Status Control */}
          <div className="p-3 rounded-xl bg-[#0b1329] border border-[#1e293b]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></span>
                <span className="text-xs font-bold text-white">
                  {isGuest || !user?.email ? 'Guest Mode' : user.name || 'Athlete'}
                </span>
              </div>
              <span className="text-[10px] text-[#22d3ee] font-semibold bg-[#06b6d4]/10 px-2 py-0.5 rounded border border-[#06b6d4]/20">
                Full Access
              </span>
            </div>

            {(!user || isGuest || !user?.email) ? (
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <Link
                  to="/signup"
                  className="flex-1 py-1.5 text-center font-bold rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="flex-1 py-1.5 text-center font-bold rounded-lg border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-colors"
                >
                  Login
                </Link>
              </div>
            ) : (
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 w-full py-1.5 rounded-lg text-xs font-semibold text-[#C4C4C4] hover:text-white hover:bg-[#1e293b] transition-all"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}