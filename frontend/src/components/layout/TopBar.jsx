import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut, Menu, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NOTIFICATIONS = [
  { id: 1, text: 'You hit your water goal today! 💧', time: '2m ago', read: false },
  { id: 2, text: 'New AI Coach suggestion available', time: '1h ago', read: false },
  { id: 3, text: 'Weekly progress report is ready', time: '3h ago', read: true },
  { id: 4, text: 'Workout reminder: Leg Day 🏋️', time: 'Yesterday', read: true },
];

/**
 * Returns the appropriate greeting based on the current hour.
 * @returns {'Good morning' | 'Good afternoon' | 'Good evening'}
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Formats today's date as a long human-readable string.
 * @returns {string}
 */
function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * @param {{ onMenuClick: () => void, userName?: string }} props
 */
export default function TopBar({ onMenuClick, userName = 'Alex' }) {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const notifRef = useRef(null);
  const avatarRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayName = user?.name || userName;
  const displayEmail = user?.email || 'alex@fitbuddy.ai';

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-64 z-20 flex items-center justify-between px-5 py-3.5 border-b"
      style={{ backgroundColor: '#111111', borderColor: '#1a1a1a' }}
    >
      {/* Left: Hamburger (mobile) + Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-white font-semibold text-base leading-tight">
            {getGreeting()},{' '}
            <span style={{ color: '#39ff14' }}>{userName}!</span> 👋
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
            {getTodayLabel()}
          </p>
        </div>
      </div>

      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-2">

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setAvatarOpen(false); }}
            className="relative rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-black"
                style={{ backgroundColor: '#39ff14' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border overflow-hidden"
              style={{ backgroundColor: '#111111', borderColor: '#1a1a1a' }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: '#1a1a1a' }}
              >
                <p className="text-white font-semibold text-sm">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs transition-colors"
                    style={{ color: '#39ff14' }}
                  >
                    <Check size={12} />
                    Mark all read
                  </button>
                )}
              </div>

              <ul className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: '#1a1a1a' }}>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span
                      className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full"
                      style={{ backgroundColor: n.read ? 'transparent' : '#39ff14' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${n.read ? 'text-gray-400' : 'text-white'}`}>
                        {n.text}
                      </p>
                      <p className="text-xs mt-0.5 text-gray-600">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="px-4 py-2 border-t text-center"
                style={{ borderColor: '#1a1a1a' }}
              >
                <button className="text-xs transition-colors hover:text-white" style={{ color: '#39ff14' }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ backgroundColor: '#1a1a1a' }} />

        {/* User Avatar + Dropdown */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => { setAvatarOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
            aria-label="User menu"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0"
              style={{ backgroundColor: '#39ff14' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-sm font-medium leading-tight">{userName}</p>
              <p className="text-gray-500 text-xs leading-tight">Premium</p>
            </div>
            <ChevronDown
              size={14}
              className="hidden sm:block text-gray-500 transition-transform duration-200"
              style={{ transform: avatarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {/* Avatar dropdown */}
          {avatarOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border overflow-hidden"
              style={{ backgroundColor: '#111111', borderColor: '#1a1a1a' }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: '#1a1a1a' }}>
                <p className="text-white text-sm font-medium">{displayName}</p>
                <p className="text-gray-500 text-xs mt-0.5">{displayEmail}</p>
              </div>

              <ul className="py-1">
                {[
                  { label: 'Profile & Settings', icon: User, path: '/profile' },
                ].map(({ label, icon: Icon, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Icon size={15} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t py-1" style={{ borderColor: '#1a1a1a' }}>
                <button
                  onClick={() => { setAvatarOpen(false); logout(); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
