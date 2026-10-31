import React, { useState } from 'react';
import {
  TrendingUp,
  Scale,
  Calendar,
  Flame,
  Award,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { calculateBMI } from '../utils/calculations';

export default function ProgressPage() {
  const { user, updateProfile } = useAuth();
  const profile = user?.profile || {};

  const [timeRange, setTimeRange] = useState('30d');
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  // Weight history records
  const [weightRecords, setWeightRecords] = useState([
    { date: 'Oct 01', weight: 75.2 },
    { date: 'Oct 05', weight: 74.8 },
    { date: 'Oct 10', weight: 74.3 },
    { date: 'Oct 15', weight: 73.9 },
    { date: 'Oct 20', weight: 73.4 },
    { date: 'Oct 25', weight: 72.8 },
    { date: 'Oct 30', weight: profile.weight || 72.5 },
  ]);

  // Weekly calorie adherence data
  const calorieTrend = [
    { day: 'Week 1', consumed: 2150, target: 2100 },
    { day: 'Week 2', consumed: 2080, target: 2100 },
    { day: 'Week 3', consumed: 1980, target: 2100 },
    { day: 'Week 4', consumed: 1940, target: 2100 },
  ];

  // Workout completion data
  const workoutConsistency = [
    { week: 'W1', completed: 4, goal: 5 },
    { week: 'W2', completed: 5, goal: 5 },
    { week: 'W3', completed: 5, goal: 5 },
    { week: 'W4', completed: 6, goal: 5 },
  ];

  const currentWeight = weightRecords[weightRecords.length - 1].weight;
  const initialWeight = weightRecords[0].weight;
  const weightDiff = (currentWeight - initialWeight).toFixed(1);
  const bmiInfo = calculateBMI(currentWeight, profile.height || 172) || { value: 24.5, category: 'Normal' };

  const handleLogWeight = (e) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (!val || val < 30 || val > 300) return;

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setWeightRecords((prev) => [...prev, { date: todayStr, weight: val }]);
    updateProfile({ weight: val });
    setNewWeight('');
    setIsWeightModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in bg-[#000000]">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#171717] p-6 rounded-2xl border border-[#404040]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-white bg-[#262626] px-2.5 py-0.5 rounded-full border border-[#404040] flex items-center gap-1">
              <Sparkles size={12} /> Analytics & Milestones
            </span>
            <span className="text-xs text-[#A3A3A3]">Continuous Performance Tracking</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Fitness <span className="text-white">Progress Report</span>
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Analyze weight evolution, caloric adherence, and workout frequency trends over time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setIsWeightModalOpen(true)}
            className="gap-2"
          >
            <Plus size={16} /> Log Current Weight
          </Button>
        </div>
      </div>

      {/* ── Key Metrics Summary Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Weight Change */}
        <div className="bg-[#171717] border border-[#404040] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Total Progress</span>
            <span className="w-8 h-8 rounded-lg bg-[#262626] border border-[#404040] text-white flex items-center justify-center">
              <Scale size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-black text-white">{weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg</h3>
            <span className="text-xs font-semibold text-white flex items-center">
              <ArrowDownRight size={14} /> Fat Loss Phase
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-1">Starting: {initialWeight} kg → Current: {currentWeight} kg</p>
        </div>

        {/* BMI Status */}
        <div className="bg-[#171717] border border-[#404040] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Current BMI</span>
            <span className="w-8 h-8 rounded-lg bg-[#262626] border border-[#404040] text-white flex items-center justify-center">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-black text-white">{bmiInfo.value}</h3>
            <Badge variant="default">{bmiInfo.category}</Badge>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-1">Healthy metric range for your height</p>
        </div>

        {/* Workout Adherence */}
        <div className="bg-[#171717] border border-[#404040] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Workout Adherence</span>
            <span className="w-8 h-8 rounded-lg bg-[#262626] border border-[#404040] text-white flex items-center justify-center">
              <Award size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-black text-white">92%</h3>
            <span className="text-xs font-semibold text-white">+4% vs last month</span>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-1">20 of 22 planned sessions logged</p>
        </div>

        {/* Caloric Deficit Consistency */}
        <div className="bg-[#171717] border border-[#404040] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Active Streak</span>
            <span className="w-8 h-8 rounded-lg bg-[#262626] border border-[#404040] text-white flex items-center justify-center">
              <Flame size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-black text-white">18 Days</h3>
            <span className="text-xs text-white font-semibold">Personal Best!</span>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-1">Daily logging & macro discipline</p>
        </div>
      </div>

      {/* ── Main Weight Chart ── */}
      <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale size={18} className="text-white" />
              Body Weight Trendline (kg)
            </h2>
            <p className="text-xs text-[#A3A3A3]">Consistent downward trend indicating steady fat reduction</p>
          </div>

          <div className="flex items-center gap-1 bg-[#262626] border border-[#404040] p-1 rounded-xl">
            {['7d', '30d', '90d', 'All'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === r ? 'bg-white text-black' : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightRecords} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#404040" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" stroke="#A3A3A3" fontSize={12} tickLine={false} />
              <YAxis stroke="#A3A3A3" fontSize={12} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  borderColor: '#404040',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#weightGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Sub Charts: Weekly Calories & Weekly Workouts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caloric Intake Consistency */}
        <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Flame size={18} className="text-white" />
            Monthly Calorie Trajectory (Avg Daily kcal)
          </h2>
          <p className="text-xs text-[#A3A3A3] mb-4">Target: {profile.dailyCalorieGoal || 2100} kcal/day</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#404040" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#A3A3A3" fontSize={12} tickLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={12} tickLine={false} domain={[1600, 2400]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#404040',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                  }}
                />
                <Bar dataKey="consumed" fill="#A3A3A3" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workout Volume Consistency */}
        <div className="bg-[#171717] border border-[#404040] rounded-2xl p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Award size={18} className="text-white" />
            Workout Frequency (Sessions per Week)
          </h2>
          <p className="text-xs text-[#A3A3A3] mb-4">Target: 5 sessions/week</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutConsistency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#404040" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" stroke="#A3A3A3" fontSize={12} tickLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={12} tickLine={false} domain={[0, 7]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#404040',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                  }}
                />
                <Bar dataKey="completed" fill="#FFFFFF" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Log Weight Modal ── */}
      <Modal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        title="Log New Body Weight"
      >
        <form onSubmit={handleLogWeight} className="space-y-4">
          <p className="text-xs text-[#A3A3A3]">
            Weigh yourself first thing in the morning after using the restroom for maximum accuracy.
          </p>
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            placeholder="e.g. 72.3"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsWeightModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Record Weight
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}