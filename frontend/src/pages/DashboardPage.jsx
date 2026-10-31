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

  const calorieTarget = profile.dailyCalorieGoal || 2000;
  const waterTarget = profile.dailyWaterGoal || 2500;
  const currentWeight = profile.weight || null;
  const height = profile.height || null;

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
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in bg-[#000000] text-white">

      {/* ── Top Header & Greeting ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#171717] p-6 rounded-2xl border border-[#404040]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-white bg-[#262626] px-2.5 py-0.5 rounded-full border border-[#404040]">
              Ready to crush your goals
            </span>
            <span className="text-xs text-[#A3A3A3]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {greeting}, <span>{userName}</span> 💪
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            {consumedCalories > 0
              ? <>You're at <strong className="text-white">{Math.round((consumedCalories / calorieTarget) * 100)}%</strong> of your daily nutrition target.</>
              : "Start logging your meals and workouts to track your progress!"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/chatbot">
            <Button variant="outline" size="sm" className="gap-2">
              <Bot size={16} className="text-white" />
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
        <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#262626] border border-[#404040] flex items-center justify-center flex-shrink-0">
            <Target size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold">Complete Your Fitness Profile</h3>
            <p className="text-sm text-[#A3A3A3] mt-1">
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
          unit="kcal"
          icon={Flame}
          iconColor="#FFFFFF"
        />
        <StatCard
          title="Water Intake"
          value={waterIntake === 0 ? '—' : waterIntake}
          unit="ml"
          icon={Droplets}
          iconColor="#FFFFFF"
        />
        <StatCard
          title="BMI"
          value={bmiData ? bmiData.value : '—'}
          unit={bmiData ? bmiData.category : 'Set height & weight'}
          icon={Scale}
          iconColor="#FFFFFF"
        />
        <StatCard
          title="Workouts Done"
          value={completedWorkoutsCount === 0 ? '—' : completedWorkoutsCount}
          unit="sessions"
          icon={Dumbbell}
          iconColor="#FFFFFF"
        />
      </div>

      {/* ── Calorie & Water Progress ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calorie Ring */}
        <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame size={16} className="text-white" /> Daily Calories
              </h2>
              <p className="text-xs text-[#A3A3A3]">Consumed vs Target</p>
            </div>
            <Link to="/food-tracker">
              <Button variant="ghost" size="sm" className="text-xs text-white">
                Log Food <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6">
            <ProgressRing
              percentage={Math.min(100, Math.round((consumedCalories / calorieTarget) * 100))}
              size={110}
              strokeWidth={10}
              color="#FFFFFF"
              trackColor="#262626"
            />
            <div className="space-y-2">
              <div>
                <p className="text-2xl font-black text-white">{consumedCalories}</p>
                <p className="text-xs text-[#A3A3A3]">of {calorieTarget} kcal consumed</p>
              </div>
              <div className="text-xs text-[#A3A3A3]">
                Remaining: <span className="text-white font-bold">{Math.max(0, calorieTarget - consumedCalories)} kcal</span>
              </div>
              {macros && (
                <div className="text-xs text-[#A3A3A3] space-y-0.5">
                  <p>Protein target: <span className="text-white font-medium">{macros.protein}g</span></p>
                  <p>Carbs target: <span className="text-white font-medium">{macros.carbs}g</span></p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Water Tracker */}
        <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Droplets size={16} className="text-white" /> Hydration
              </h2>
              <p className="text-xs text-[#A3A3A3]">{waterIntake} / {waterTarget} ml</p>
            </div>
            <Badge variant={waterIntake >= waterTarget ? 'success' : 'default'}>
              {waterIntake >= waterTarget ? 'Goal Met! 🎉' : `${Math.round((waterIntake / waterTarget) * 100)}%`}
            </Badge>
          </div>

          {/* Water level bar */}
          <div className="w-full bg-[#262626] rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500 bg-white"
              style={{
                width: `${Math.min(100, (waterIntake / waterTarget) * 100)}%`,
              }}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[150, 250, 350, 500].map((ml) => (
              <button
                key={ml}
                onClick={() => handleQuickAddWater(ml)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#262626] border border-[#404040] text-white hover:bg-[#333333] transition-all"
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
      <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-white" /> Weekly Nutrition
            </h2>
            <p className="text-xs text-[#A3A3A3]">Calories consumed this week</p>
          </div>
          <Link to="/progress">
            <Button variant="ghost" size="sm" className="text-xs text-white">
              Full Progress <ChevronRight size={12} />
            </Button>
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData} barSize={20}>
            <XAxis dataKey="day" tick={{ fill: '#A3A3A3', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#A3A3A3', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#262626', border: '1px solid #404040', borderRadius: 8 }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="calories" fill="#FFFFFF" radius={[4, 4, 0, 0]} name="Calories" />
          </BarChart>
        </ResponsiveContainer>
        {weeklyData.every(d => d.calories === 0) && (
          <p className="text-center text-xs text-[#A3A3A3] mt-2">
            No data yet — log your meals in <Link to="/food-tracker" className="text-white underline">Food Tracker</Link> to see your weekly chart.
          </p>
        )}
      </div>

      {/* ── Today's Workout Plan ── */}
      <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell size={16} className="text-white" /> Today's Workout
            </h2>
            <p className="text-xs text-[#A3A3A3]">
              {workouts.length > 0
                ? `${completedWorkoutsCount} / ${workouts.length} exercises completed`
                : 'Generate a plan to get started'}
            </p>
          </div>
          <Link to="/workout-planner">
            <Button variant="ghost" size="sm" className="text-xs text-white">
              {workouts.length > 0 ? 'View Plan' : 'Generate Plan'} <ChevronRight size={12} />
            </Button>
          </Link>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-8 text-[#A3A3A3]">
            <Dumbbell size={32} className="mx-auto mb-3 opacity-40 text-white" />
            <p className="text-sm font-bold text-white mb-1">No workout plan yet</p>
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
                    ? 'bg-[#262626] border-[#404040] text-[#737373]'
                    : 'bg-[#171717] border-[#404040] text-white hover:border-white'
                }`}
              >
                {w.completed ? (
                  <CheckCircle2 size={18} className="text-white flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-[#A3A3A3] flex-shrink-0" />
                )}
                <span className={`flex-1 text-sm font-medium ${w.completed ? 'line-through text-[#737373]' : ''}`}>
                  {w.name}
                </span>
                <span className="text-xs text-[#A3A3A3]">{w.duration}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={16} className="text-white" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'AI Coach', icon: Bot, path: '/chatbot' },
            { label: 'Diet Plan', icon: Utensils, path: '/diet-planner' },
            { label: 'Workout', icon: Dumbbell, path: '/workout-planner' },
            { label: 'Log Food', icon: Plus, path: '/food-tracker' },
            { label: 'Water', icon: Droplets, path: '/water-tracker' },
            { label: 'Progress', icon: Activity, path: '/progress' },
          ].map(({ label, icon: Icon, path }) => (
            <Link key={path} to={path}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#262626] border border-[#404040] hover:border-white transition-all cursor-pointer group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#171717] border border-[#404040] group-hover:scale-105 transition-transform"
                >
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-[#A3A3A3] group-hover:text-white transition-colors text-center">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Today's Meal Plan Preview ── */}
      <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Utensils size={16} className="text-white" />
              Suggested Indian Meal Plan
            </h2>
            <p className="text-xs text-[#A3A3A3]">
              AI-suggested based on your {profile.dietType || 'dietary'} preference & {calorieTarget} kcal target
            </p>
          </div>
          <Link to="/diet-planner">
            <Button variant="ghost" size="sm" className="text-xs text-white">
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
            <div key={i} className="p-4 rounded-xl bg-[#262626] border border-[#404040] hover:border-white transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase">{meal.time}</span>
                <span className="text-xs text-[#A3A3A3]">{meal.kcal}</span>
              </div>
              <h4 className="text-sm font-semibold text-white">{meal.name}</h4>
              <p className="text-xs text-[#A3A3A3] mt-1">{meal.desc}</p>
              <div className="mt-3 pt-2 border-t border-[#404040] flex justify-between text-[11px] text-[#A3A3A3]">
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
