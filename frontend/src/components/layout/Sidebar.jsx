import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  Utensils,
  Dumbbell,
  Apple,
  Droplets,
  Bot,
  TrendingUp,
  User,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard' },
  { label: 'BMI Calculator',icon: Calculator,       path: '/bmi-calculator' },
  { label: 'Diet Planner',  icon: Utensils,         path: '/diet-planner' },
  { label: 'Workout Plan',  icon: Dumbbell,         path: '/workout-planner' },
  { label: 'Food Tracker',  icon: Apple,            path: '/food-tracker' },
  { label: 'Water Tracker', icon: Droplets,         path: '/water-tracker' },
  { label: 'AI Coach',      icon: Bot,              path: '/chatbot' },
  { label: 'Progress',      icon: TrendingUp,       path: '/progress' },
  { label: 'Profile',       icon: User,             path: '/profile' },
];

/**
 * Strict monochrome Sidebar component for FitBuddy AI.
 */
export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();
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
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col',
          'border-r border-[#404040] transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{
          backgroundColor: '#171717',
        }}
      >
        {/* Header / Logo */}
        <div
          className="flex items-center justify-between px-5 h-[65px] border-b border-[#404040]"
        >
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105 bg-[#262626] border border-[#404040]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  fill="#FFFFFF"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-base tracking-tight leading-none">
                FitBuddy <span className="text-white">AI</span>
              </span>
              <span className="text-[10px] text-[#A3A3A3] font-semibold tracking-wider uppercase mt-0.5">
                Fitness & Nutrition
              </span>
            </div>
          </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
            const active = isActive(path);
            const hovered = hoveredPath === path;

            return (
              <Link
                key={path}
                to={path}
                onMouseEnter={() => setHoveredPath(path)}
                onMouseLeave={() => setHoveredPath(null)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group"
                style={{
                  backgroundColor: active
                    ? '#FFFFFF'
                    : hovered
                    ? '#262626'
                    : 'transparent',
                  color: active ? '#000000' : hovered ? '#FFFFFF' : '#A3A3A3',
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  size={18}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: active ? '#000000' : hovered ? '#FFFFFF' : '#A3A3A3' }}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight size={14} style={{ color: '#000000' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-[#404040]" />

        {/* Logout */}
        <div className="p-3">
          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-all duration-150"
            onClick={logout}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>

        {/* Version badge */}
        <div className="px-5 py-3">
          <p className="text-xs text-[#737373]">v1.0.0 · FitBuddy AI</p>
        </div>
      </aside>
    </>
  );
}
