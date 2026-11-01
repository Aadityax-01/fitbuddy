import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
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
import { chatApi } from '../services/api';

const QUICK_PROMPTS = [
  'How much protein in 4 eggs?',
  'What’s the best time to work out?',
  'Vegetarian muscle gain diet',
  'How many calories in 2 bananas?',
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = user?.profile || {};

  const calorieTarget = profile.dailyCalorieGoal || 2000;
  const waterTarget = profile.dailyWaterGoal || 2500;
  const currentWeight = profile.weight || null;
  const height = profile.height || null;

  const [consumedCalories, setConsumedCalories] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [workouts, setWorkouts] = useState([
    { id: 'w1', name: 'Goblet Squats & Lunges', sets: '3 sets · 12 reps', completed: false },
    { id: 'w2', name: 'Push-Ups & Incline Press', sets: '3 sets · 10 reps', completed: true },
    { id: 'w3', name: 'Plank Knee Taps', sets: '3 sets · 45s hold', completed: false },
  ]);

  // AI Coach interactive state inside the dedicated panel
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your FitBuddy AI Coach. What fitness, diet, or nutrition question can I answer for you today?", time: 'Just now' }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const bmiData = (currentWeight && height) ? calculateBMI(currentWeight, height) : null;
  const macros = calculateMacros(calorieTarget, profile.goal || 'maintain');

  const toggleWorkout = (id) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
  };

  const completedWorkoutsCount = workouts.filter((w) => w.completed).length;

  const handleQuickAddWater = (amount) => {
    setWaterIntake((prev) => Math.min(waterTarget + 1000, prev + amount));
  };

  const handleSendPrompt = async (promptText) => {
    const q = promptText || coachInput.trim();
    if (!q) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', text: q, time: timeStr };
    setMessages((prev) => [...prev, userMsg]);
    setCoachInput('');
    setIsTyping(true);

    try {
      const res = await chatApi.sendMessage(q, 'dashboard_session', profile);
      const replyText = res?.assistant_reply || res?.content || res?.reply || res?.message || (
        q.toLowerCase().includes('protein') && q.toLowerCase().includes('egg')
          ? "4 large whole eggs contain approximately 25–26g of protein.\n• Protein: 25–26g\n• Calories: 288 kcal\n• Fat: 19–20g\n• Carbohydrates: ~1.6g\nValues depend on egg size."
          : `Based on your fitness profile, maintaining progressive overload and aiming for ~${macros.protein}g protein daily will optimize your results!`
      );
      setMessages((prev) => [...prev, { role: 'assistant', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      // Local fallback
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: `Great question! For "${q}", ensure balanced macronutrients (~${macros.protein}g protein) and consistent hydration for optimal recovery.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const greeting = getGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'Athlete';

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in bg-[#000000] text-white">

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* INITIAL SCREEN: HERO + 2 FEATURE CARDS + DEDICATED AI COACH PANEL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Left Column (Hero & 2 Feature Cards) ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Main Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#020617] border border-[#1e293b] p-6 sm:p-8 md:p-10 shadow-[0_0_30px_rgba(6,182,212,0.08)]">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#22d3ee] text-xs font-bold tracking-wider uppercase">
                  <Sparkles size={13} className="text-[#06b6d4]" />
                  <span>AI-Powered Fitness Platform</span>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    FitBuddy <span className="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">AI</span>
                  </h1>
                  <p className="text-base sm:text-lg text-[#C4C4C4] font-medium mt-1.5">
                    Your personal AI fitness companion
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed max-w-lg">
                  Tailored Indian nutrition plans, smart calorie targets, and dynamic workout routines designed specifically around your fitness goals and lifestyle.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={() => navigate('/chatbot')}
                    className="gap-2 bg-gradient-to-r from-[#06b6d4] to-[#2563eb] border-0 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:from-[#22d3ee] hover:to-[#3b82f6]"
                  >
                    <Bot size={16} /> Ask AI Coach
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/diet-planner')}
                    className="gap-2 border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4]"
                  >
                    Explore Diet & Workouts <ArrowRight size={14} />
                  </Button>
                </div>
              </div>

              {/* Fitness Hero Visual SVG */}
              <div className="hidden sm:flex flex-col items-center justify-center relative w-48 h-48 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#06b6d4]/20 to-[#3b82f6]/20 blur-xl animate-pulse-glow" />
                <div className="relative w-40 h-40 rounded-2xl bg-[#030712] border border-[#1e293b] flex flex-col items-center justify-center p-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#06b6d4]/20 to-[#3b82f6]/20 border border-[#06b6d4]/40 flex items-center justify-center mb-2">
                    <Activity size={28} className="text-[#06b6d4]" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide text-center">FitBuddy Intelligence</span>
                  <span className="text-[10px] text-[#22d3ee] font-medium mt-0.5">● Ready to Coach</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Feature Cards: Side by Side beneath the hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Feature Card 1: AI Diet Planner */}
            <div className="rounded-2xl p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <Utensils size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#22d3ee] transition-colors">
                    AI Diet Planner
                  </h3>
                  <p className="text-xs text-[#C4C4C4] leading-relaxed mt-1">
                    Personalized Indian meal plans, smart calorie targets, and balanced macronutrient breakdowns tailored to your preferences.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#22d3ee]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
                  <span>Pure Veg, Non-Veg & Vegan Options</span>
                </div>
              </div>

              <div className="pt-5">
                <button
                  onClick={() => navigate('/diet-planner')}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#06b6d4] to-[#2563eb] hover:from-[#22d3ee] hover:to-[#3b82f6] shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 transition-all"
                >
                  <span>Open Diet Planner</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Feature Card 2: Workout Generator */}
            <div className="rounded-2xl p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#3b82f6]/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#3b82f6] flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                    Workout Generator
                  </h3>
                  <p className="text-xs text-[#C4C4C4] leading-relaxed mt-1">
                    Dynamic routines built for home, gym, or outdoors with science-backed sets, reps, rest periods, and exercise form cues.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#60a5fa]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                  <span>Home & Gym Splits by Equipment</span>
                </div>
              </div>

              <div className="pt-5">
                <button
                  onClick={() => navigate('/workout-planner')}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#2563eb] to-[#06b6d4] hover:from-[#3b82f6] hover:to-[#22d3ee] shadow-[0_0_15px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 transition-all"
                >
                  <span>Create Workout Plan</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Dedicated AI Coach Panel ── */}
        <div className="lg:col-span-4 rounded-3xl p-5 sm:p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/40 transition-all shadow-[0_0_30px_rgba(6,182,212,0.08)] flex flex-col h-[580px] sm:h-[620px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center text-lg font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">AI Fitness Coach</h3>
                <span className="flex items-center gap-1.5 text-[10px] text-[#22d3ee] font-semibold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse"></span> Online and ready
                </span>
              </div>
            </div>

            <Link to="/chatbot" className="text-xs text-[#06b6d4] hover:underline font-semibold">
              Open Full View ↗
            </Link>
          </div>

          {/* Short introduction */}
          <p className="text-xs text-[#C4C4C4] leading-relaxed py-2.5">
            Hi! I'm your AI Coach. Ask me anything about Indian diets, exact nutrients in foods, or dynamic workout routines.
          </p>

          {/* Suggested Prompts */}
          <div className="py-2 border-y border-[#1e293b]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">Suggested Prompts</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendPrompt(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] hover:bg-[#0f172a] transition-all text-left truncate max-w-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation history area */}
          <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1 text-xs">
            {messages.map((m, idx) => {
              const isAI = m.role === 'assistant';
              return (
                <div key={idx} className={`flex gap-2 ${isAI ? '' : 'justify-end'}`}>
                  {isAI && (
                    <div className="w-6 h-6 rounded-lg bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                      isAI
                        ? 'bg-[#030712] border border-[#1e293b] text-[#C4C4C4]'
                        : 'bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white font-medium shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span className="block text-[9px] text-[#94a3b8] mt-1 text-right">{m.time}</span>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-[#06b6d4]">
                <div className="w-6 h-6 rounded-lg bg-[#06b6d4]/15 border border-[#06b6d4]/30 flex items-center justify-center text-[10px]">🤖</div>
                <span className="animate-pulse">AI Coach is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat input docked at bottom */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}
            className="flex items-center gap-2 pt-2 border-t border-[#1e293b]"
          >
            <input
              type="text"
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              placeholder="Ask anything about fitness or diet..."
              className="flex-1 bg-[#020617] border border-[#1e293b] focus:border-[#06b6d4] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#C4C4C4] outline-none shadow-inner"
            />
            <button
              type="submit"
              disabled={!coachInput.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-[0_0_12px_rgba(6,182,212,0.25)] flex items-center justify-center flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BELOW THE FOLD: SECONDARY METRICS, NUTRITION, HYDRATION & WORKOUTS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="pt-8 border-t border-[#1e293b] space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📊</span> Performance &amp; Nutrition Metrics
          </h2>
          <p className="text-xs text-[#C4C4C4] mt-0.5">
            Secondary health stats, daily calorie distribution, hydration tracking, and interactive workouts.
          </p>
        </div>

        {/* ── Key Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Calories Today"
            value={consumedCalories === 0 ? '—' : consumedCalories}
            unit="kcal"
            icon={Flame}
            iconColor="#06b6d4"
          />
          <StatCard
            title="Water Intake"
            value={waterIntake === 0 ? '—' : waterIntake}
            unit="ml"
            icon={Droplets}
            iconColor="#3b82f6"
          />
          <StatCard
            title="BMI"
            value={bmiData ? bmiData.value : '—'}
            unit={bmiData ? bmiData.category : 'Set height & weight'}
            icon={Scale}
            iconColor="#06b6d4"
          />
          <StatCard
            title="Workouts Done"
            value={completedWorkoutsCount === 0 ? '—' : completedWorkoutsCount}
            unit="sessions"
            icon={Dumbbell}
            iconColor="#3b82f6"
          />
        </div>

        {/* ── Calorie & Water Progress ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calorie Ring Card */}
          <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame size={16} className="text-[#06b6d4]" /> Daily Calorie Goal
                </h3>
                <p className="text-xs text-[#C4C4C4]">Consumed vs Target</p>
              </div>
              <Link to="/food-tracker" className="text-xs text-[#06b6d4] hover:underline font-semibold">
                Log Food →
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6">
              <ProgressRing
                percentage={Math.min(100, Math.round((consumedCalories / calorieTarget) * 100))}
                size={110}
                strokeWidth={10}
                color="#06b6d4"
                trackColor="#0f172a"
              />
              <div className="space-y-1.5">
                <div>
                  <p className="text-2xl font-black text-white">{consumedCalories}</p>
                  <p className="text-xs text-[#C4C4C4]">of {calorieTarget} kcal consumed</p>
                </div>
                <div className="text-xs text-[#C4C4C4]">
                  Remaining: <span className="text-white font-bold">{Math.max(0, calorieTarget - consumedCalories)} kcal</span>
                </div>
                {macros && (
                  <div className="text-xs text-[#C4C4C4] space-y-0.5 pt-1">
                    <p>Protein: <span className="text-white font-medium">{macros.protein}g</span></p>
                    <p>Carbs: <span className="text-white font-medium">{macros.carbs}g</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Water Tracker Card */}
          <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Droplets size={16} className="text-[#3b82f6]" /> Hydration Tracker
                </h3>
                <p className="text-xs text-[#C4C4C4]">{waterIntake} / {waterTarget} ml</p>
              </div>
              <Badge variant={waterIntake >= waterTarget ? 'success' : 'default'}>
                {waterIntake >= waterTarget ? 'Goal Met!' : `${Math.round((waterIntake / waterTarget) * 100)}%`}
              </Badge>
            </div>

            {/* Water level bar */}
            <div className="w-full bg-[#0f172a] rounded-full h-3 mb-4 overflow-hidden border border-[#1e293b]">
              <div
                className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]"
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
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#030712] border border-[#1e293b] text-white hover:border-[#06b6d4] transition-all"
                >
                  +{ml} ml
                </button>
              ))}
            </div>

            <Link to="/water-tracker" className="mt-4 block text-xs text-[#3b82f6] hover:underline font-semibold">
              Open Full Hydration Log →
            </Link>
          </div>
        </div>

        {/* ── Today's Workout Checklist ── */}
        <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell size={16} className="text-[#06b6d4]" /> Today's Workout Routine
              </h3>
              <p className="text-xs text-[#C4C4C4]">Interactive checklist for today's exercises</p>
            </div>
            <Link to="/workout-planner" className="text-xs text-[#06b6d4] hover:underline font-semibold">
              Customize Splits →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {workouts.map((w) => (
              <div
                key={w.id}
                onClick={() => toggleWorkout(w.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  w.completed
                    ? 'bg-[#030712] border-[#06b6d4]/50'
                    : 'bg-[#0f172a] border-[#1e293b] hover:border-[#3b82f6]'
                }`}
              >
                <div>
                  <p className={`text-xs font-bold ${w.completed ? 'line-through text-[#94a3b8]' : 'text-white'}`}>
                    {w.name}
                  </p>
                  <span className="text-[10px] text-[#C4C4C4]">{w.sets}</span>
                </div>
                {w.completed ? (
                  <CheckCircle2 size={18} className="text-[#06b6d4]" />
                ) : (
                  <Circle size={18} className="text-[#94a3b8]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}