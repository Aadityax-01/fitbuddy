import { useState, useMemo } from 'react';
import {
  Droplets, Plus, Trash2, Target, TrendingUp, Flame,
  RefreshCw, Award, Info,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

/* ─── Demo weekly data ──────────────────────────────────────────────────── */
const WEEKLY_BASE = [
  { day: 'Mon', ml: 2600 },
  { day: 'Tue', ml: 1900 },
  { day: 'Wed', ml: 2800 },
  { day: 'Thu', ml: 2500 },
  { day: 'Fri', ml: 3100 },
  { day: 'Sat', ml: 2200 },
  { day: 'Sun', ml: 0 },   // today — live
];

/* ─── Quick-add presets ─────────────────────────────────────────────────── */
const PRESETS = [
  { label: 'Sip',       ml: 150,  icon: '💧' },
  { label: 'Cup',       ml: 250,  icon: '☕' },
  { label: 'Large Cup', ml: 350,  icon: '🥤' },
  { label: 'Bottle',    ml: 500,  icon: '🍶' },
];

/* ─── Tips ──────────────────────────────────────────────────────────────── */
const TIPS = [
  { title: 'Start your day right', body: 'Drink 500ml of water immediately after waking up to kickstart your metabolism.' },
  { title: 'Before every meal',    body: 'A glass of water 30 min before meals aids digestion and reduces overeating.' },
  { title: 'Workout hydration',    body: 'Drink 250ml before, during, and after exercise to replace sweat losses.' },
  { title: 'Golden hour',          body: 'Reduce intake 1-2 hours before bed to avoid disrupting sleep.' },
];

/* ─── Utility ───────────────────────────────────────────────────────────── */
const uid = () => `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

const fmt = (d) =>
  d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const mlToDisplay = (ml) => (ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`);

/* ─── Custom tooltip ────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, goal }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const pct  = Math.round((val / goal) * 100);
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: '#171717', border: '1px solid #404040' }}>
      <p className="text-[#A3A3A3] mb-1">{label}</p>
      <p className="font-bold text-white">{mlToDisplay(val)}</p>
      <p className="text-xs text-[#737373]">{pct}% of goal</p>
    </div>
  );
}

/* ─── Wave fill component ───────────────────────────────────────────────── */
function WaveFill({ percentage }) {
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const fillHeight = clamped; // percentage

  return (
    <div
      className="relative w-48 h-48 rounded-full overflow-hidden mx-auto"
      style={{ background: '#000000', border: '3px solid #404040' }}
    >
      {/* Fill */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-700"
        style={{
          height: `${fillHeight}%`,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 100%)',
        }}
      >
        {/* Wave SVG */}
        <svg
          viewBox="0 0 300 20"
          preserveAspectRatio="none"
          className="absolute -top-5 left-0 right-0 w-full"
          style={{ height: 20 }}
        >
          <path
            d="M0,10 C50,0 100,20 150,10 C200,0 250,20 300,10 L300,20 L0,20 Z"
            fill="rgba(255, 255, 255, 0.4)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="-300 0"
              to="0 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0,12 C60,2 120,22 180,12 C240,2 270,18 300,12 L300,20 L0,20 Z"
            fill="rgba(255, 255, 255, 0.2)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-300 0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <Droplets size={28} className="text-white mb-1" />
        <span className="text-3xl font-black text-white">{Math.round(clamped)}%</span>
        <span className="text-xs text-[#A3A3A3]">of daily goal</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WaterTrackerPage
   ═══════════════════════════════════════════════════════════════════════════ */
export default function WaterTrackerPage() {
  const [goal, setGoal]           = useState(2500);
  const [editGoal, setEditGoal]   = useState(false);
  const [goalInput, setGoalInput] = useState('2500');
  const [logs, setLogs]           = useState([
    { id: 'w1', ml: 500, time: new Date(Date.now() - 3_600_000 * 3) },
    { id: 'w2', ml: 350, time: new Date(Date.now() - 3_600_000 * 2) },
    { id: 'w3', ml: 250, time: new Date(Date.now() - 3_600_000)     },
  ]);
  const [customMl, setCustomMl]   = useState('');
  const [streak]                  = useState(5);

  const totalMl   = useMemo(() => logs.reduce((s, e) => s + e.ml, 0), [logs]);
  const pct       = Math.min((totalMl / goal) * 100, 100);
  const remaining = Math.max(goal - totalMl, 0);
  const goalMet   = totalMl >= goal;

  const weeklyData = useMemo(() => {
    return WEEKLY_BASE.map((d, i) =>
      i === 6 ? { ...d, ml: totalMl } : d
    );
  }, [totalMl]);

  const addWater = (ml) => {
    if (!ml || ml <= 0) return;
    setLogs((prev) => [{ id: uid(), ml, time: new Date() }, ...prev]);
  };

  const removeLog = (id) => setLogs((prev) => prev.filter((l) => l.id !== id));

  const resetToday = () => setLogs([]);

  const saveGoal = () => {
    const v = parseInt(goalInput, 10);
    if (v >= 500 && v <= 10000) setGoal(v);
    setEditGoal(false);
  };

  const addCustom = () => {
    const v = parseInt(customMl, 10);
    if (v > 0) { addWater(v); setCustomMl(''); }
  };

  return (
    <div className="min-h-screen p-6 bg-[#000000] text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Droplets size={26} className="text-white" />
            Water Tracker
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">Stay hydrated — track every drop</p>
        </div>
        {/* Streak badge */}
        <div className="flex items-center gap-2 rounded-xl px-4 py-2 bg-[#171717] border border-[#404040]">
          <Award size={18} className="text-white" />
          <div>
            <p className="text-xs text-[#A3A3A3]">Streak</p>
            <p className="font-bold text-sm text-white">{streak} days 🔥</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: visual + quick add ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Main card */}
          <div className="rounded-2xl p-6 bg-[#171717] border border-[#404040]">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Wave visual */}
              <div className="flex flex-col items-center gap-4">
                <WaveFill percentage={pct} />
                <div className="text-center">
                  <p className="text-3xl font-black text-white">
                    {mlToDisplay(totalMl)}
                  </p>
                  <p className="text-sm text-[#A3A3A3]">
                    {goalMet
                      ? 'Daily goal reached!'
                      : `${mlToDisplay(remaining)} remaining`}
                  </p>
                </div>
              </div>

              {/* Goal + quick add */}
              <div className="flex-1 space-y-5 w-full">
                {/* Goal setting */}
                <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-[#262626] border border-[#404040]">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-white" />
                    <div>
                      <p className="text-xs text-[#A3A3A3]">Daily Goal</p>
                      {editGoal ? (
                        <input
                          type="number"
                          value={goalInput}
                          onChange={(e) => setGoalInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
                          className="w-24 bg-transparent outline-none text-sm font-bold text-white border-b border-white"
                          autoFocus
                        />
                      ) : (
                        <p className="text-sm font-bold text-white">{mlToDisplay(goal)}</p>
                      )}
                    </div>
                  </div>
                  {editGoal ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveGoal}
                        className="text-xs font-bold px-3 py-1 rounded-lg bg-white text-black hover:bg-[#E5E5E5] transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditGoal(false)}
                        className="text-xs font-bold px-3 py-1 rounded-lg text-[#A3A3A3] hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditGoal(true); setGoalInput(String(goal)); }}
                      className="text-xs text-[#A3A3A3] hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* Quick-add buttons */}
                <div>
                  <p className="text-xs text-[#A3A3A3] mb-2">Quick Add</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map(({ label, ml, icon }) => (
                      <button
                        key={ml}
                        onClick={() => addWater(ml)}
                        className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all bg-[#262626] border border-[#404040] hover:bg-[#333333] active:scale-[0.97]"
                      >
                        <span className="text-base">{icon}</span>
                        <div className="text-left">
                          <p className="text-xs text-[#A3A3A3]">{label}</p>
                          <p className="text-white font-bold">+{ml}ml</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom amount */}
                <div>
                  <p className="text-xs text-[#A3A3A3] mb-2">Custom Amount</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={customMl}
                      onChange={(e) => setCustomMl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                      placeholder="Enter ml..."
                      className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none placeholder-[#737373] text-white bg-[#262626] border border-[#404040] focus:border-white"
                    />
                    <button
                      onClick={addCustom}
                      className="px-4 py-2.5 rounded-xl font-bold text-sm transition-all bg-white text-black hover:bg-[#E5E5E5]"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={resetToday}
                  className="flex items-center gap-2 text-sm text-[#A3A3A3] hover:text-white transition-colors"
                >
                  <RefreshCw size={14} /> Reset today's log
                </button>
              </div>
            </div>
          </div>

          {/* Weekly chart */}
          <div className="rounded-2xl p-6 bg-[#171717] border border-[#404040]">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} className="text-white" />
              <h2 className="font-semibold text-base text-white">Last 7 Days</h2>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="day" stroke="#A3A3A3" tick={{ fill: '#A3A3A3', fontSize: 12 }} />
                <YAxis stroke="#A3A3A3" tick={{ fill: '#A3A3A3', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}L`} />
                <Tooltip content={<CustomTooltip goal={goal} />} />
                <Bar dataKey="ml" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.ml >= goal ? '#FFFFFF' : i === 6 ? '#D4D4D4' : '#262626'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Right: logs + tips ── */}
        <div className="space-y-5">
          {/* Today's logs */}
          <div className="rounded-2xl overflow-hidden bg-[#171717] border border-[#404040]">
            <div className="px-5 py-4 border-b border-[#404040]">
              <h2 className="font-semibold text-sm text-white">Today's Log</h2>
              <p className="text-xs text-[#A3A3A3] mt-0.5">{logs.length} entries</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#737373]">No water logged yet</div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between px-5 py-3 border-b border-[#404040] hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#262626] border border-[#404040]">
                        <Droplets size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{log.ml}ml</p>
                        <p className="text-xs text-[#A3A3A3]">{fmt(log.time)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeLog(log.id)}
                      className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-white transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl p-5 bg-[#171717] border border-[#404040]">
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-white" />
              <h2 className="font-semibold text-sm text-white">Hydration Tips</h2>
            </div>
            <div className="space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="rounded-xl p-3 bg-[#262626] border border-[#404040]">
                  <p className="text-xs font-semibold mb-1 text-white">💧 {tip.title}</p>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Logged Today',  val: mlToDisplay(totalMl),   Icon: Droplets },
              { label: 'Remaining',     val: mlToDisplay(remaining), Icon: Target   },
            ].map(({ label, val, Icon }) => (
              <div key={label} className="rounded-2xl p-4 bg-[#171717] border border-[#404040]">
                <Icon size={18} className="text-white mb-2" />
                <p className="text-lg font-black text-white">{val}</p>
                <p className="text-xs text-[#A3A3A3] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}