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
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [hoveredPath, setHoveredPath] = useState(null);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose?.();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col',
          'border-r transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{
          backgroundColor: '#111111',
          borderColor: '#1a1a1a',
        }}
      >
        {/* Header / Logo */}
        <div
          className="flex items-center justify-between px-5 h-[65px] border-b"
          style={{ borderColor: '#1a1a1a' }}
        >
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            {/* Inline SVG lightning bolt mark */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105"
              style={{
                backgroundColor: 'rgba(57, 255, 20, 0.12)',
                border: '1px solid rgba(57, 255, 20, 0.3)',
              }}
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
                  fill="#39ff14"
                  stroke="#39ff14"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-base tracking-tight leading-none">
                FitBuddy <span style={{ color: '#39ff14' }}>AI</span>
              </span>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase mt-0.5">
                Fitness & Nutrition
              </span>
            </div>
          </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
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
                    ? '#39ff14'
                    : hovered
                    ? 'rgba(57, 255, 20, 0.08)'
                    : 'transparent',
                  color: active ? '#0a0a0a' : hovered ? '#ffffff' : '#9ca3af',
                  boxShadow: active ? '0 0 15px rgba(57, 255, 20, 0.4)' : 'none',
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  size={18}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: active ? '#0a0a0a' : hovered ? '#39ff14' : '#9ca3af' }}
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight size={14} style={{ color: '#0a0a0a' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t" style={{ borderColor: '#1a1a1a' }} />

        {/* Logout */}
        <div className="p-3">
          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
            onClick={logout}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>

        {/* Version badge */}
        <div className="px-5 py-3">
          <p className="text-xs text-gray-600">v1.0.0 · FitBuddy AI</p>
        </div>
      </aside>
    </>
  );
}
