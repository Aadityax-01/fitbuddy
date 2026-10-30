import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Droplets,
  Dumbbell,
  Scale,
  TrendingUp,
  Utensils,
  Plus,
  Bot,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Sparkles,
  Award,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  formatCalories,
} from '../utils/calculations';

export default function DashboardPage() {
  const { user } = useAuth();
  const profile = user?.profile || {};

  // Metrics
  const calorieTarget = profile.dailyCalorieGoal || 2100;
  const [consumedCalories, setConsumedCalories] = useState(1450);
  const [waterIntake, setWaterIntake] = useState(1750);
  const waterTarget = profile.dailyWaterGoal || 2500;
  const currentWeight = profile.weight || 72.5;
  const height = profile.height || 172;

  const bmiData = calculateBMI(currentWeight, height) || {
    value: 24.5,
    category: 'Normal Weight',
    color: '#39ff14',
  };

  const macros = calculateMacros(calorieTarget, profile.goal || 'maintain');
  const consumedMacros = {
    protein: 88,
    carbs: 165,
    fats: 42,
  };

  // Workout state
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'Warm-up Jumping Jacks & Arm Circles', duration: '5 min', completed: true },
    { id: 2, name: 'Push-ups (3 sets × 12 reps)', duration: '8 min', completed: true },
    { id: 3, name: 'Bodyweight Squats (3 sets × 15 reps)', duration: '10 min', completed: false },
    { id: 4, name: 'Plank Hold (3 sets × 45 sec)', duration: '5 min', completed: false },
  ]);

  const toggleWorkout = (id) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
  };

  const completedWorkoutsCount = workouts.filter((w) => w.completed).length;

  // Weekly calorie chart data
  const weeklyData = [
    { day: 'Mon', calories: 1950, target: calorieTarget },
    { day: 'Tue', calories: 2100, target: calorieTarget },
    { day: 'Wed', calories: 1820, target: calorieTarget },
    { day: 'Thu', calories: 2250, target: calorieTarget },
    { day: 'Fri', calories: 1450, target: calorieTarget },
    { day: 'Sat', calories: 0, target: calorieTarget },
    { day: 'Sun', calories: 0, target: calorieTarget },
  ];

  // Macros Pie Data
  const macroChartData = [
    { name: 'Protein', value: consumedMacros.protein * 4, color: '#39ff14' },
    { name: 'Carbs', value: consumedMacros.carbs * 4, color: '#38bdf8' },
    { name: 'Fats', value: consumedMacros.fats * 9, color: '#f59e0b' },
  ];

  const handleQuickAddWater = (amount) => {
    setWaterIntake((prev) => Math.min(waterTarget + 1000, prev + amount));
  };

  const greeting = getGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'Athlete';

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
            {greeting}, <span className="text-[#39ff14]">{userName}</span> 👋
          </h1>
          <p className="text-sm text-[#9ca3af] mt-1">
            You're at <strong className="text-white">{Math.round((consumedCalories / calorieTarget) * 100)}%</strong> of your daily nutrition target. Keep up the momentum!
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
              Log Meal
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Top Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#39ff14]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider">Calories Remaining</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {Math.max(0, calorieTarget - consumedCalories)}
                <span className="text-xs font-normal text-[#9ca3af] ml-1">kcal</span>
              </h3>
              <p className="text-xs text-[#9ca3af] mt-1">
                Consumed: <strong className="text-white">{consumedCalories}</strong> / {calorieTarget}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#39ff1415] border border-[#39ff1430] flex items-center justify-center text-[#39ff14]">
              <Flame size={20} />
            </div>
          </div>
          <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#39ff14] to-[#22c55e] h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (consumedCalories / calorieTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Protein Target */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#38bdf8]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider">Protein Progress</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {consumedMacros.protein}
                <span className="text-xs font-normal text-[#9ca3af] ml-1">/ {macros.protein}g</span>
              </h3>
              <p className="text-xs text-[#9ca3af] mt-1">
                Goal: <strong className="text-white">{Math.round((consumedMacros.protein / macros.protein) * 100)}%</strong> achieved
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#38bdf815] border border-[#38bdf830] flex items-center justify-center text-[#38bdf8]">
              <Zap size={20} />
            </div>
          </div>
          <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#38bdf8] h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (consumedMacros.protein / macros.protein) * 100)}%` }}
            />
          </div>
        </div>

        {/* Water Intake Card */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#06b6d4]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider">Hydration</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {(waterIntake / 1000).toFixed(2)}
                <span className="text-xs font-normal text-[#9ca3af] ml-1">/ {(waterTarget / 1000).toFixed(1)}L</span>
              </h3>
              <p className="text-xs text-[#9ca3af] mt-1">
                <strong className="text-white">{Math.round((waterIntake / waterTarget) * 100)}%</strong> of daily goal
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#06b6d415] border border-[#06b6d430] flex items-center justify-center text-[#06b6d4]">
              <Droplets size={20} />
            </div>
          </div>
          <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#06b6d4] h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (waterIntake / waterTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* BMI & Weight Card */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#2a2a2a] transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#a855f7]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider">BMI & Body</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-black text-white">{bmiData.value}</h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${bmiData.color}20`,
                    color: bmiData.color,
                    border: `1px solid ${bmiData.color}40`,
                  }}
                >
                  {bmiData.category}
                </span>
              </div>
              <p className="text-xs text-[#9ca3af] mt-1">
                Current weight: <strong className="text-white">{currentWeight} kg</strong>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#a855f715] border border-[#a855f730] flex items-center justify-center text-[#a855f7]">
              <Scale size={20} />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-[#9ca3af] mt-4 pt-2 border-t border-[#1a1a1a]">
            <span>Height: {height} cm</span>
            <Link to="/bmi-calculator" className="text-[#39ff14] hover:underline flex items-center gap-0.5">
              Calculator <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Charts & Insights Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Calorie Intake Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-[#39ff14]" />
                Weekly Calorie Performance
              </h2>
              <p className="text-xs text-[#9ca3af]">Track your daily caloric intake against your calculated target</p>
            </div>
            <Badge variant="success">Daily Target: {calorieTarget} kcal</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} domain={[0, 2600]} />
                <Tooltip
                  cursor={{ fill: '#1a1a1a' }}
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#2a2a2a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="calories" fill="#39ff14" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 mt-2 border-t border-[#1a1a1a] text-center">
            <div>
              <p className="text-xs text-[#9ca3af]">Weekly Avg</p>
              <p className="text-base font-bold text-white mt-0.5">1,914 kcal</p>
            </div>
            <div>
              <p className="text-xs text-[#9ca3af]">Highest Day</p>
              <p className="text-base font-bold text-[#39ff14] mt-0.5">Thu (2,250)</p>
            </div>
            <div>
              <p className="text-xs text-[#9ca3af]">Deficit Maintained</p>
              <p className="text-base font-bold text-white mt-0.5">-340 kcal/day</p>
            </div>
          </div>
        </div>

        {/* Macros Breakdown Chart (1 Col) */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Utensils size={18} className="text-[#39ff14]" />
                Today's Macros
              </h2>
              <span className="text-xs text-[#9ca3af]">1,450 kcal</span>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroChartData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      borderColor: '#2a2a2a',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-white">69%</span>
                <p className="text-[10px] text-[#9ca3af] uppercase">Of Target</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#9ca3af]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#39ff14]" /> Protein
                </span>
                <span className="font-semibold text-white">
                  {consumedMacros.protein}g / {macros.protein}g ({Math.round((consumedMacros.protein / macros.protein) * 100)}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#9ca3af]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" /> Carbohydrates
                </span>
                <span className="font-semibold text-white">
                  {consumedMacros.carbs}g / {macros.carbs}g ({Math.round((consumedMacros.carbs / macros.carbs) * 100)}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#9ca3af]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Healthy Fats
                </span>
                <span className="font-semibold text-white">
                  {consumedMacros.fats}g / {macros.fats}g ({Math.round((consumedMacros.fats / macros.fats) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <Link to="/diet-planner" className="mt-4">
            <Button variant="outline" size="sm" fullWidth className="text-xs">
              View Detailed Diet Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Today's Workout & Quick Water Logging ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Progress Routine (2 Cols) */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Dumbbell size={18} className="text-[#39ff14]" />
                Today's Workout Routine
              </h2>
              <p className="text-xs text-[#9ca3af]">
                {completedWorkoutsCount} of {workouts.length} exercises completed
              </p>
            </div>
            <Link to="/workout-planner">
              <Button variant="ghost" size="sm" className="text-xs text-[#39ff14]">
                Workout Generator <ChevronRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="space-y-2.5">
            {workouts.map((w) => (
              <div
                key={w.id}
                onClick={() => toggleWorkout(w.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  w.completed
                    ? 'bg-[#152515] border-[#39ff1440] text-[#86efac]'
                    : 'bg-[#141414] border-[#1f1f1f] text-white hover:border-[#2a2a2a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {w.completed ? (
                    <CheckCircle2 size={20} className="text-[#39ff14]" />
                  ) : (
                    <Circle size={20} className="text-[#6b7280]" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${w.completed ? 'line-through text-[#9ca3af]' : 'text-white'}`}>
                      {w.name}
                    </p>
                    <p className="text-xs text-[#9ca3af]">{w.duration}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    w.completed ? 'bg-[#39ff1420] text-[#39ff14]' : 'bg-[#1a1a1a] text-[#9ca3af]'
                  }`}
                >
                  {w.completed ? 'Done' : 'Tap to complete'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-[#39ff1410] to-transparent border border-[#39ff1420] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award size={24} className="text-[#39ff14]" />
              <div>
                <p className="text-sm font-bold text-white">Daily Workout Streak: 5 Days!</p>
                <p className="text-xs text-[#9ca3af]">Complete today's session to keep the badge.</p>
              </div>
            </div>
            <Link to="/workout-planner">
              <Button variant="primary" size="sm">
                Full Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Water Tracker & Hydration (1 Col) */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Droplets size={18} className="text-[#06b6d4]" />
                Quick Hydration
              </h2>
              <span className="text-xs text-[#06b6d4] font-semibold">{waterIntake} ml</span>
            </div>

            <div className="flex items-center justify-center my-4">
              <ProgressRing
                percentage={Math.round((waterIntake / waterTarget) * 100)}
                size={130}
                strokeWidth={10}
                color="#06b6d4"
                label="Daily Goal"
                value={`${(waterIntake / 1000).toFixed(1)}L`}
              />
            </div>

            <p className="text-xs text-center text-[#9ca3af] mb-4">
              {waterIntake >= waterTarget
                ? '🎉 Amazing! You hit your hydration goal today!'
                : `${Math.max(0, waterTarget - waterIntake)} ml remaining to reach your target.`}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickAddWater(250)}
                className="py-2.5 px-3 bg-[#161616] hover:bg-[#202020] border border-[#222222] rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus size={14} className="text-[#06b6d4]" /> +250 ml (Glass)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddWater(500)}
                className="py-2.5 px-3 bg-[#161616] hover:bg-[#202020] border border-[#222222] rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus size={14} className="text-[#06b6d4]" /> +500 ml (Bottle)
              </button>
            </div>
          </div>

          <Link to="/water-tracker" className="mt-4">
            <Button variant="outline" size="sm" fullWidth className="text-xs">
              Open Water Tracker
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Today's Meal Plan Preview ── */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Utensils size={18} className="text-[#39ff14]" />
              Today's Recommended Indian Meal Plan
            </h2>
            <p className="text-xs text-[#9ca3af]">Tailored by FitBuddy AI based on your calories & macros</p>
          </div>
          <Link to="/diet-planner">
            <Button variant="ghost" size="sm" className="text-xs text-[#39ff14]">
              Regenerate / Customize <ChevronRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Breakfast */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#39ff14] uppercase">Breakfast (8:30 AM)</span>
              <span className="text-xs text-[#9ca3af]">~480 kcal</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Oats with Milk & Boiled Eggs</h4>
            <p className="text-xs text-[#9ca3af] mt-1">1 bowl rolled oats (150g) + 2 eggs + 1 banana</p>
            <div className="mt-3 pt-2 border-t border-[#1f1f1f] flex justify-between text-[11px] text-[#9ca3af]">
              <span>P: 22g</span>
              <span>C: 55g</span>
              <span>F: 12g</span>
            </div>
          </div>

          {/* Lunch */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#39ff14] uppercase">Lunch (1:00 PM)</span>
              <span className="text-xs text-[#9ca3af]">~640 kcal</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Roti, Dal Tadka & Paneer Sabzi</h4>
            <p className="text-xs text-[#9ca3af] mt-1">2 multigrain rotis + 1 katori dal + 100g paneer + curd</p>
            <div className="mt-3 pt-2 border-t border-[#1f1f1f] flex justify-between text-[11px] text-[#9ca3af]">
              <span>P: 32g</span>
              <span>C: 62g</span>
              <span>F: 22g</span>
            </div>
          </div>

          {/* Evening Snack */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#39ff14] uppercase">Evening Snack (4:30 PM)</span>
              <span className="text-xs text-[#9ca3af]">~230 kcal</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Roasted Chana & Green Tea</h4>
            <p className="text-xs text-[#9ca3af] mt-1">40g roasted chana + 10 almonds + 1 cup green tea</p>
            <div className="mt-3 pt-2 border-t border-[#1f1f1f] flex justify-between text-[11px] text-[#9ca3af]">
              <span>P: 9g</span>
              <span>C: 22g</span>
              <span>F: 11g</span>
            </div>
          </div>

          {/* Dinner */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#39ff14] uppercase">Dinner (8:00 PM)</span>
              <span className="text-xs text-[#9ca3af]">~550 kcal</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Grilled Chicken / Tofu & Rice</h4>
            <p className="text-xs text-[#9ca3af] mt-1">150g grilled protein + 1 cup brown rice + cucumber salad</p>
            <div className="mt-3 pt-2 border-t border-[#1f1f1f] flex justify-between text-[11px] text-[#9ca3af]">
              <span>P: 35g</span>
              <span>C: 45g</span>
              <span>F: 10g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
