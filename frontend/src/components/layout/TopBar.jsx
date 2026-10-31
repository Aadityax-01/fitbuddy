import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, User, LogOut, Menu, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NOTIFICATIONS = [
  { id: 1, text: 'You hit your water goal today! 💧', time: '2m ago', read: false },
  { id: 2, text: 'New AI Coach suggestion available', time: '1h ago', read: false },
  { id: 3, text: 'Weekly progress report is ready', time: '3h ago', read: true },
  { id: 4, text: 'Workout reminder: Leg Day 🏋️', time: 'Yesterday', read: true },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const notifRef = useRef(null);
  const avatarRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const firstNameOnly = displayName.split(' ')[0];

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
      className="fixed top-0 right-0 left-0 lg:left-64 z-20 flex items-center justify-between px-5 py-3.5 border-b border-[#404040] bg-[#171717]"
    >
      {/* Left: Hamburger (mobile) + Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-white font-black text-base leading-tight">
            {getGreeting()},{' '}
            <span>{firstNameOnly}!</span> 💪
          </p>
          <p className="text-xs mt-0.5 text-[#A3A3A3]">
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
            className="relative rounded-lg p-2 text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center text-black bg-white"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border border-[#404040] bg-[#171717] overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-[#404040]"
              >
                <p className="text-white font-bold text-sm">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-white hover:underline transition-colors"
                  >
                    <Check size={12} />
                    Mark all read
                  </button>
                )}
              </div>

              <ul className="max-h-72 overflow-y-auto divide-y divide-[#404040]">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[#262626] transition-colors cursor-pointer"
                  >
                    <span
                      className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full"
                      style={{ backgroundColor: n.read ? 'transparent' : '#FFFFFF' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${n.read ? 'text-[#A3A3A3]' : 'text-white'}`}>
                        {n.text}
                      </p>
                      <p className="text-xs mt-0.5 text-[#737373]">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="px-4 py-2 border-t border-[#404040] text-center"
              >
                <button className="text-xs text-white hover:underline transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1 bg-[#404040]" />

        {/* User Avatar + Dropdown */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => { setAvatarOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[#262626] transition-colors"
            aria-label="User menu"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-black flex-shrink-0 bg-white"
            >
              {firstNameOnly.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-sm font-semibold leading-tight">{firstNameOnly}</p>
              <p className="text-[#A3A3A3] text-xs leading-tight">Member</p>
            </div>
            <ChevronDown
              size={14}
              className="hidden sm:block text-[#A3A3A3] transition-transform duration-200"
              style={{ transform: avatarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {avatarOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl border border-[#404040] bg-[#171717] overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[#404040]">
                <p className="text-white text-sm font-bold">{displayName}</p>
                {displayEmail && <p className="text-[#A3A3A3] text-xs mt-0.5 truncate">{displayEmail}</p>}
              </div>

              <ul className="py-1">
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors"
                  >
                    <User size={15} />
                    Profile &amp; Settings
                  </Link>
                </li>
              </ul>

              <div className="border-t border-[#404040] py-1">
                <button
                  onClick={() => { setAvatarOpen(false); logout(); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white hover:bg-[#262626] transition-colors font-medium"
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
