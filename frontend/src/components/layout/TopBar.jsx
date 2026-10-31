import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, LogOut, Menu, Check, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NOTIFICATIONS = [
  { id: 1, text: 'You hit your water goal today! 💧', time: '2m ago', read: false },
  { id: 2, text: 'New AI Coach recommendation available', time: '1h ago', read: false },
  { id: 3, text: 'Weekly progress report is ready', time: '3h ago', read: true },
];

export default function TopBar({ onMenuClick }) {
  const { user, logout, isGuest } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const notifRef = useRef(null);
  const avatarRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayName = user?.name || (isGuest ? 'Guest Athlete' : 'Athlete');
  const userInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchSubmit(e) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (q.includes('diet') || q.includes('meal') || q.includes('food') || q.includes('calorie')) {
        navigate('/diet-planner');
      } else if (q.includes('workout') || q.includes('exercise') || q.includes('gym')) {
        navigate('/workout-planner');
      } else {
        navigate('/chatbot');
      }
    }
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-[68px] flex items-center justify-between px-4 sm:px-6 md:px-8 border-b border-[#1e293b] bg-[#000000]/95 backdrop-blur-md">
      {/* ── Left Side: Hamburger (mobile) + Wide Search Field ── */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-[#1e293b] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Wide Search Field */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#06b6d4] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search exercises, Indian meals, nutrients, calories..."
            className="w-full bg-[#0b1329] border border-[#1e293b] focus:border-[#06b6d4] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-[#C4C4C4] outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Right Side: Notifications & Profile Controls ── */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications Control */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setAvatarOpen(false); }}
            className="relative p-2.5 rounded-xl text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/50 transition-all"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl p-4 bg-[#0b1329] border border-[#1e293b] shadow-[0_0_25px_rgba(0,0,0,0.8)] z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b] mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-[#06b6d4] hover:underline font-semibold">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#030712] border border-[#1e293b] text-xs">
                    <p className="text-white font-medium">{n.text}</p>
                    <span className="text-[10px] text-[#C4C4C4] mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Control */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => { setAvatarOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/50 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#2563eb] text-white font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              {userInitial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{displayName}</p>
              <p className="text-[10px] text-[#06b6d4] font-medium leading-none mt-0.5">
                {isGuest ? 'Guest Access' : 'Pro Member'}
              </p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {avatarOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl p-2 bg-[#0b1329] border border-[#1e293b] shadow-[0_0_25px_rgba(0,0,0,0.8)] z-50 animate-fade-in text-xs">
              <div className="px-3 py-2 border-b border-[#1e293b] mb-1">
                <p className="font-bold text-white">{displayName}</p>
                <p className="text-[10px] text-[#C4C4C4] truncate">{user?.email || 'Guest Session'}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setAvatarOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#C4C4C4] hover:text-white hover:bg-[#1e293b]"
              >
                <User size={14} /> Profile Settings
              </Link>
              <button
                onClick={() => { setAvatarOpen(false); logout(); }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[#C4C4C4] hover:text-white hover:bg-[#1e293b]"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}