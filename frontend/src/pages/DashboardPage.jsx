import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Droplets,
  Dumbbell,
  Scale,
  Utensils,
  Plus,
  Bot,
  CheckCircle2,
  Circle,
  ChevronRight,
  Zap,
  Activity,
  Target,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import ProgressRing from '../components/ui/ProgressRing';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  calculateBMI,
  calculateMacros,
  getGreeting,
} from '../utils/calculations';

export default function DashboardPage() {
  const { user } = useAuth();
  const profile = user?.profile || {};

  // Use real user data — no hardcoded fallbacks for consumed values
  const calorieTarget = profile.dailyCalorieGoal || 2000;
  const waterTarget = profile.dailyWaterGoal || 2500;
  const currentWeight = profile.weight || null;
  const height = profile.height || null;

  // Track session-level quick entries (reset on page reload — real tracking uses FoodTracker/WaterTracker pages)
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [workouts, setWorkouts] = useState([]);

  const bmiData = (currentWeight && height) ? calculateBMI(currentWeight, height) : null;
  const macros = calculateMacros(calorieTarget, profile.goal || 'maintain');

  const toggleWorkout = (id) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
  };

  const completedWorkoutsCount = workouts.filter((w) => w.completed).length;

  // Weekly chart — all zeroes until real tracking data is available
  const weeklyData = [
    { day: 'Mon', calories: 0, target: calorieTarget },
    { day: 'Tue', calories: 0, target: calorieTarget },
    { day: 'Wed', calories: 0, target: calorieTarget },
    { day: 'Thu', calories: 0, target: calorieTarget },
    { day: 'Fri', calories: 0, target: calorieTarget },
    { day: 'Sat', calories: 0, target: calorieTarget },
    { day: 'Sun', calories: 0, target: calorieTarget },
  ];

  const handleQuickAddWater = (amount) => {
    setWaterIntake((prev) => Math.min(waterTarget + 1000, prev + amount));
  };

  const greeting = getGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'Athlete';
  const hasProfile = !!(currentWeight && height && profile.age);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* ── Top Header & Greeting ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#111111] via-[#141414] to-[#111111] p-6 rounded-2xl border border-[#1a1a1a] shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-[#39ff14] bg-[#39ff1415] px-2.5 py-0.5 rounded-full border border-[#39ff1430]">
              Ready to crush your goals
            </span>
            <span className="text-xs text-[#9ca3af]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, <span className="text-[#39ff14]">{userName}</span> 💪
          </h1>
          <p className="text-sm text-[#9ca3af] mt-1">
            {consumedCalories > 0
              ? <>You're at <strong className="text-white">{Math.round((consumedCalories / calorieTarget) * 100)}%</strong> of your daily nutrition target.</>
              : "Start logging your meals and workouts to track your progress!"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/chatbot">
            <Button variant="outline" size="sm" className="gap-2">
              <Bot size={16} className="text-[#39ff14]" />
              Ask AI Coach
            </Button>
          </Link>
          <Link to="/food-tracker">
            <Button variant="primary" size="sm" className="gap-2">
              <Plus size={16} />
              Log Food
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Setup Prompt for New Users ── */}
      {!hasProfile && (
        <div className="bg-[#111111] border border-[#39ff1440] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#39ff1415] flex items-center justify-center flex-shrink-0">
            <Target size={24} className="text-[#39ff14]" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold">Complete Your Fitness Profile</h3>
            <p className="text-sm text-[#9ca3af] mt-1">
              Add your height, weight, and goals to unlock personalized calorie targets, BMI, and AI recommendations.
            </p>
          </div>
          <Link to="/profile">
            <Button variant="primary" size="sm" className="flex-shrink-0">
              Set Up Profile <ChevronRight size={14} />
            </Button>
          </Link>
        </div>
      )}

      {/* ── Key Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Calories Today"
          value={consumedCalories === 0 ? '—' : consumedCalories}
          subtitle={`Target: ${calorieTarget} kcal`}
          icon={<Flame size={20} className="text-orange-400" />}
          color="#f97316"
        />
        <StatCard
          title="Water Intake"
          value={waterIntake === 0 ? '—' : `${waterIntake} ml`}
          subtitle={`Target: ${waterTarget} ml`}
          icon={<Droplets size={20} className="text-cyan-400" />}
          color="#06b6d4"
        />
        <StatCard
          title="BMI"
          value={bmiData ? bmiData.value : '—'}
          subtitle={bmiData ? bmiData.category : 'Set height & weight'}
          icon={<Scale size={20} className="text-[#39ff14]" />}
          color="#39ff14"
        />
        <StatCard
          title="Workouts Done"
          value={completedWorkoutsCount === 0 ? '—' : completedWorkoutsCount}
          subtitle="Today's sessions"
          icon={<Dumbbell size={20} className="text-purple-400" />}
          color="#a855f7"
        />
      </div>

      {/* ── Calorie & Water Progress ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calorie Ring */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame size={16} className="text-orange-400" /> Daily Calories
              </h2>
              <p className="text-xs text-[#9ca3af]">Consumed vs Target</p>
            </div>
            <Link to="/food-tracker">
              <Button variant="ghost" size="sm" className="text-xs text-[#39ff14]">
                Log Food <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6">
            <ProgressRing
              value={Math.min(100, Math.round((consumedCalories / calorieTarget) * 100))}
              size={110}
              strokeWidth={10}
              color="#39ff14"
            />
            <div className="space-y-2">
              <div>
                <p className="text-2xl font-black text-white">{consumedCalories}</p>
                <p className="text-xs text-[#9ca3af]">of {calorieTarget} kcal consumed</p>
              </div>
              <div className="text-xs text-[#9ca3af]">
                Remaining: <span className="text-white font-bold">{Math.max(0, calorieTarget - consumedCalories)} kcal</span>
              </div>
              {macros && (
                <div className="text-xs text-[#9ca3af] space-y-0.5">
                  <p>Protein target: <span className="text-white">{macros.protein}g</span></p>
                  <p>Carbs target: <span className="text-white">{macros.carbs}g</span></p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Water Tracker */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Droplets size={16} className="text-cyan-400" /> Hydration
              </h2>
              <p className="text-xs text-[#9ca3af]">{waterIntake} / {waterTarget} ml</p>
            </div>
            <Badge variant={waterIntake >= waterTarget ? 'success' : 'default'}>
              {waterIntake >= waterTarget ? 'Goal Met! 🎉' : `${Math.round((waterIntake / waterTarget) * 100)}%`}
            </Badge>
          </div>

          {/* Water level bar */}
          <div className="w-full bg-[#1a1a1a] rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (waterIntake / waterTarget) * 100)}%`,
                backgroundColor: '#06b6d4',
              }}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[150, 250, 350, 500].map((ml) => (
              <button
                key={ml}
                onClick={() => handleQuickAddWater(ml)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141414] border border-[#1f1f1f] text-[#06b6d4] hover:border-[#06b6d4]/40 hover:bg-[#06b6d415] transition-all"
              >
                +{ml} ml
              </button>
            ))}
          </div>

          <Link to="/water-tracker" className="mt-4 block">
            <Button variant="outline" size="sm" fullWidth className="text-xs mt-3">
              Open Water Tracker
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Weekly Calorie Chart ── */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-[#39ff14]" /> Weekly Nutrition
            </h2>
            <p className="text-xs text-[#9ca3af]">Calories consumed this week</p>
          </div>
          <Link to="/progress">
            <Button variant="ghost" size="sm" className="text-xs text-[#39ff14]">
              Full Progress <ChevronRight size={12} />
            </Button>
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData} barSize={20}>
            <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#141414', border: '1px solid #1f1f1f', borderRadius: 8 }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#39ff14' }}
            />
            <Bar dataKey="calories" fill="#39ff14" radius={[4, 4, 0, 0]} name="Calories" />
          </BarChart>
        </ResponsiveContainer>
        {weeklyData.every(d => d.calories === 0) && (
          <p className="text-center text-xs text-[#9ca3af] mt-2">
            No data yet — log your meals in <Link to="/food-tracker" className="text-[#39ff14] hover:underline">Food Tracker</Link> to see your weekly chart.
          </p>
        )}
      </div>

      {/* ── Today's Workout Plan ── */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell size={16} className="text-purple-400" /> Today's Workout
            </h2>
            <p className="text-xs text-[#9ca3af]">
              {workouts.length > 0
                ? `${completedWorkoutsCount} / ${workouts.length} exercises completed`
                : 'Generate a plan to get started'}
            </p>
          </div>
          <Link to="/workout-planner">
            <Button variant="ghost" size="sm" className="text-xs text-[#39ff14]">
              {workouts.length > 0 ? 'View Plan' : 'Generate Plan'} <ChevronRight size={12} />
            </Button>
          </Link>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-8 text-[#9ca3af]">
            <Dumbbell size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium text-white mb-1">No workout plan yet</p>
            <p className="text-xs mb-4">Let AI generate a personalized workout based on your goals.</p>
            <Link to="/workout-planner">
              <Button variant="primary" size="sm" className="gap-2">
                <Zap size={14} /> Generate AI Workout
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {workouts.map((w) => (
              <button
                key={w.id}
                onClick={() => toggleWorkout(w.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  w.completed
                    ? 'bg-[#39ff1408] border-[#39ff1430] text-[#9ca3af]'
                    : 'bg-[#141414] border-[#1f1f1f] text-white hover:border-[#2a2a2a]'
                }`}
              >
                {w.completed ? (
                  <CheckCircle2 size={18} className="text-[#39ff14] flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-[#9ca3af] flex-shrink-0" />
                )}
                <span className={`flex-1 text-sm font-medium ${w.completed ? 'line-through' : ''}`}>
                  {w.name}
                </span>
                <span className="text-xs text-[#9ca3af]">{w.duration}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={16} className="text-[#39ff14]" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'AI Coach', icon: Bot, path: '/chatbot', color: '#39ff14' },
            { label: 'Diet Plan', icon: Utensils, path: '/diet-planner', color: '#f97316' },
            { label: 'Workout', icon: Dumbbell, path: '/workout-planner', color: '#a855f7' },
            { label: 'Log Food', icon: Plus, path: '/food-tracker', color: '#38bdf8' },
            { label: 'Water', icon: Droplets, path: '/water-tracker', color: '#06b6d4' },
            { label: 'Progress', icon: Activity, path: '/progress', color: '#f59e0b' },
          ].map(({ label, icon: Icon, path, color }) => (
            <Link key={path} to={path}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] hover:border-[#2a2a2a] hover:bg-[#161616] transition-all cursor-pointer group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-xs font-semibold text-[#9ca3af] group-hover:text-white transition-colors text-center">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Today's Meal Plan Preview (Static suggestion based on dietary preference) ── */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Utensils size={16} className="text-[#39ff14]" />
              Suggested Indian Meal Plan
            </h2>
            <p className="text-xs text-[#9ca3af]">
              AI-suggested based on your {profile.dietType || 'dietary'} preference & {calorieTarget} kcal target
            </p>
          </div>
          <Link to="/diet-planner">
            <Button variant="ghost" size="sm" className="text-xs text-[#39ff14]">
              Customize <ChevronRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              time: 'Breakfast (8:30 AM)',
              kcal: '~480 kcal',
              name: profile.dietType === 'vegan' ? 'Poha with Peanuts & Banana' : 'Oats with Milk & Boiled Eggs',
              desc: profile.dietType === 'vegan' ? '1 plate thick poha + handful peanuts + 1 banana' : '1 bowl rolled oats + 2 eggs + 1 banana',
              p: profile.dietType === 'vegan' ? '12g' : '22g', c: '55g', f: '10g'
            },
            {
              time: 'Lunch (1:00 PM)',
              kcal: '~640 kcal',
              name: profile.dietType === 'vegetarian' || profile.dietType === 'vegan' ? 'Roti, Dal & Paneer / Tofu Sabzi' : 'Roti, Dal Tadka & Chicken Curry',
              desc: profile.dietType === 'vegetarian' || profile.dietType === 'vegan' ? '2 rotis + dal + paneer/tofu + curd' : '2 rotis + dal + 150g chicken curry',
              p: '32g', c: '60g', f: '18g'
            },
            {
              time: 'Evening Snack (4:30 PM)',
              kcal: '~230 kcal',
              name: 'Roasted Chana & Green Tea',
              desc: '40g roasted chana + 10 almonds + 1 cup green tea',
              p: '9g', c: '22g', f: '11g'
            },
            {
              time: 'Dinner (8:00 PM)',
              kcal: '~550 kcal',
              name: profile.dietType === 'vegetarian' || profile.dietType === 'vegan' ? 'Khichdi with Raita & Salad' : 'Grilled Chicken / Fish & Brown Rice',
              desc: profile.dietType === 'vegetarian' || profile.dietType === 'vegan' ? '1 bowl khichdi + raita + salad' : '150g grilled protein + 1 cup brown rice + salad',
              p: '35g', c: '45g', f: '10g'
            },
          ].map((meal, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#39ff14] uppercase">{meal.time}</span>
                <span className="text-xs text-[#9ca3af]">{meal.kcal}</span>
              </div>
              <h4 className="text-sm font-semibold text-white">{meal.name}</h4>
              <p className="text-xs text-[#9ca3af] mt-1">{meal.desc}</p>
              <div className="mt-3 pt-2 border-t border-[#1f1f1f] flex justify-between text-[11px] text-[#9ca3af]">
                <span>P: {meal.p}</span>
                <span>C: {meal.c}</span>
                <span>F: {meal.f}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
