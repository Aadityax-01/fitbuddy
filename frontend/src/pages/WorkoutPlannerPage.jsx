import React, { useState } from 'react';
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Circle,
  RotateCcw,
  Clock,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
  Zap,
  Info,
  Timer,
  Heart,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { workoutApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function WorkoutPlannerPage() {
  const { user } = useAuth();
  const profile = user?.profile || {};

  // Form selections
  const [level, setLevel] = useState('Beginner');
  const [type, setType] = useState('Home');
  const [duration, setDuration] = useState(30);
  const [goal, setGoal] = useState('Muscle Building');
  const [equipment, setEquipment] = useState(['Dumbbells', 'Bodyweight']);
  const [targetMuscles, setTargetMuscles] = useState(['Full Body']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState(null);

  // Active workout state
  const [completedExercises, setCompletedExercises] = useState({});

  // Active generated workout routine
  const [workoutPlan, setWorkoutPlan] = useState({
    title: 'Functional Full-Body Ignite',
    duration: 30,
    level: 'Beginner',
    type: 'Home',
    caloriesBurn: 240,
    warmup: [
      { name: 'Jumping Jacks', duration: '2 min', instruction: 'Rhythmic aerobic jump spreading legs and arms together.' },
      { name: 'Dynamic Arm & Shoulder Circles', duration: '1.5 min', instruction: 'Gradual small to large circles forward and backward.' },
      { name: 'Bodyweight Hip Hinges & Cat-Cow', duration: '1.5 min', instruction: 'Mobilize lumbar spine, hamstrings, and pelvic tilt.' },
    ],
    exercises: [
      {
        id: 'ex1',
        name: 'Dumbbell Goblet Squats',
        target: 'Quadriceps, Glutes, Core',
        sets: 3,
        reps: '12-15 reps',
        rest: '60s',
        instructions: 'Hold dumbbell vertically against chest with both hands. Push hips back, knees tracking toes, descend until thighs are parallel with floor, then drive through heels.',
        tips: 'Keep chest proud and avoid rounding the lower back.',
      },
      {
        id: 'ex2',
        name: 'Push-Ups (or Incline Push-Ups)',
        target: 'Pectorals, Anterior Deltoids, Triceps',
        sets: 3,
        reps: '10-12 reps',
        rest: '60s',
        instructions: 'Hands slightly wider than shoulders, body forming a straight plank. Lower chest to 1 inch above ground, elbow flared at 45 degrees, press back forcefully.',
        tips: 'Brace abs tight; do not let hips sag.',
      },
      {
        id: 'ex3',
        name: 'Dumbbell Bent-Over Rows',
        target: 'Latissimus Dorsi, Rhomboids, Biceps',
        sets: 3,
        reps: '12 reps',
        rest: '60s',
        instructions: 'Hinge forward at hips at a 45-degree angle with flat spine. Pull dumbbells up towards hips, squeezing shoulder blades together at top contraction.',
        tips: 'Lead with elbows, pause 1 second at top.',
      },
      {
        id: 'ex4',
        name: 'Dumbbell Romanian Deadlift (RDL)',
        target: 'Hamstrings, Gluteus Maximus, Lower Back',
        sets: 3,
        reps: '12 reps',
        rest: '60s',
        instructions: 'Hold weights in front of thighs. Soft knee bend, push hips far back towards wall behind you while sliding dumbbells down shins. Squeeze glutes to stand.',
        tips: 'Movement comes from hip hinge, not spinal flexion.',
      },
      {
        id: 'ex5',
        name: 'Forearm Plank with Knee Taps',
        target: 'Rectus Abdominis, Transverse Abdominis',
        sets: 3,
        reps: '45 seconds',
        rest: '45s',
        instructions: 'Standard forearm plank, alternately lightly tap one knee to floor then return without swaying hips.',
        tips: 'Breathe steadily throughout the hold.',
      },
    ],
    cooldown: [
      { name: 'Extended Child’s Pose', duration: '1.5 min', instruction: 'Sit back onto heels, reach arms far forward, breathe deep belly breaths.' },
      { name: 'Standing Quad & Hamstring Stretch', duration: '2 min', instruction: 'Hold ankle for quad stretch, extend leg for hamstring stretch.' },
      { name: 'Doorframe Chest Stretch', duration: '1.5 min', instruction: 'Elbow on doorframe at 90 degrees, step forward gently opening pec.' },
    ],
  });

  const toggleEquipment = (item) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleTargetMuscle = (item) => {
    setTargetMuscles((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleComplete = (id) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await workoutApi.generatePlan({
        level: level.toLowerCase(),
        type: type.toLowerCase(),
        duration_mins: duration,
        goal,
        equipment,
        target_muscles: targetMuscles,
      });

      if (response && response.exercises) {
        setWorkoutPlan(response);
      }
    } catch (e) {
      console.warn('Using client generated routine fallback');
    } finally {
      setIsGenerating(false);
      setCompletedExercises({});
    }
  };

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const totalExercises = workoutPlan.exercises.length;
  const progressPercent = Math.round((completedCount / totalExercises) * 100);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#111111] via-[#141414] to-[#111111] p-6 rounded-2xl border border-[#1a1a1a] shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-[#39ff14] bg-[#39ff1415] px-2.5 py-0.5 rounded-full border border-[#39ff1430] flex items-center gap-1">
              <Sparkles size={12} /> AI Workout Architect
            </span>
            <span className="text-xs text-[#9ca3af]">Science-backed hypertrophy & fat loss</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Personalized <span className="text-[#39ff14]">Workout Generator</span>
          </h1>
          <p className="text-sm text-[#9ca3af] mt-1">
            Dynamic, equipment-tailored routines generated with optimal rest periods, rep ranges, and form cues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? <RotateCcw size={16} className="animate-spin" /> : <Zap size={16} />}
            {isGenerating ? 'Architecting Routine...' : 'Regenerate Routine'}
          </Button>
        </div>
      </div>

      {/* ── Main Layout: Controls on Left, Routine on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders size={18} className="text-[#39ff14]" />
              Workout Preferences
            </h3>
            <span className="text-xs text-[#9ca3af]">Custom Fit</span>
          </div>

          {/* Fitness Level */}
          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    level === lvl
                      ? 'bg-[#39ff14] text-black border-[#39ff14]'
                      : 'bg-[#161616] text-[#9ca3af] border-[#222222] hover:border-[#333]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Location / Environment */}
          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Workout Setting
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Home', 'Gym', 'Outdoor'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    type === t
                      ? 'bg-[#39ff14] text-black border-[#39ff14]'
                      : 'bg-[#161616] text-[#9ca3af] border-[#222222] hover:border-[#333]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                Session Duration
              </label>
              <span className="text-xs font-bold text-[#39ff14]">{duration} Minutes</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    duration === mins
                      ? 'bg-[#39ff1420] text-[#39ff14] border-[#39ff14]'
                      : 'bg-[#161616] text-[#9ca3af] border-[#222222] hover:border-[#333]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Primary Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-[#161616] border border-[#222222] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#39ff14]"
            >
              <option value="Fat Loss & Tone">Fat Loss & Conditioning</option>
              <option value="Muscle Building">Hypertrophy (Muscle Building)</option>
              <option value="Strength Power">Raw Strength & Power</option>
              <option value="Endurance Stamina">Endurance & Stamina</option>
              <option value="Mobility Flexibility">Mobility & Longevity</option>
            </select>
          </div>

          {/* Equipment Available */}
          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Equipment On Hand
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Bodyweight',
                'Dumbbells',
                'Resistance Bands',
                'Barbell',
                'Kettlebell',
                'Pull-Up Bar',
              ].map((item) => {
                const active = equipment.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleEquipment(item)}
                    className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                      active
                        ? 'bg-[#39ff1415] text-[#39ff14] border-[#39ff1450]'
                        : 'bg-[#161616] text-[#9ca3af] border-[#222222] hover:border-[#333]'
                    }`}
                  >
                    {active ? '✓ ' : '+ '} {item}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4"
          >
            Apply & Generate Plan
          </Button>
        </div>

        {/* Generated Workout Routine (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Workout Overview Header Card */}
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="success">{workoutPlan.level}</Badge>
                  <Badge variant="default">{workoutPlan.type}</Badge>
                  <span className="text-xs text-[#9ca3af] flex items-center gap-1">
                    <Clock size={12} className="text-[#39ff14]" /> {workoutPlan.duration} mins
                  </span>
                  <span className="text-xs text-[#9ca3af] flex items-center gap-1">
                    <Flame size={12} className="text-orange-500" /> ~{workoutPlan.caloriesBurn} kcal
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">{workoutPlan.title}</h2>
              </div>

              {/* Progress counter */}
              <div className="bg-[#161616] border border-[#222222] px-4 py-3 rounded-xl flex items-center gap-4">
                <div>
                  <p className="text-[11px] text-[#9ca3af] uppercase font-bold">Progress</p>
                  <p className="text-lg font-black text-white">
                    {completedCount} <span className="text-xs text-[#9ca3af]">/ {totalExercises} Done</span>
                  </p>
                </div>
                <div className="w-12 h-12 relative flex items-center justify-center">
                  <span className="text-xs font-bold text-[#39ff14]">{progressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full mt-5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#39ff14] to-[#22c55e] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* ── Section 1: Warm-up ── */}
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Heart size={16} className="text-rose-500" />
              1. Dynamic Warm-Up (5 Mins)
            </h3>
            <p className="text-xs text-[#9ca3af] mb-4">
              Prime your nervous system, lubricate joint capsules, and elevate core body temperature.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {workoutPlan.warmup.map((w, idx) => (
                <div key={idx} className="p-3.5 bg-[#141414] border border-[#1f1f1f] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{w.name}</span>
                    <span className="text-[11px] text-[#39ff14] font-semibold">{w.duration}</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] line-clamp-2">{w.instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 2: Main Working Sets ── */}
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Dumbbell size={16} className="text-[#39ff14]" />
                2. Working Compound & Isolation Exercises
              </h3>
              <span className="text-xs text-[#9ca3af]">Click checkmark when completed</span>
            </div>

            <div className="space-y-3">
              {workoutPlan.exercises.map((ex, index) => {
                const isDone = completedExercises[ex.id];
                const isExpanded = expandedExercise === ex.id;

                return (
                  <div
                    key={ex.id}
                    className={`border rounded-xl transition-all ${
                      isDone
                        ? 'bg-[#122012] border-[#39ff1450]'
                        : 'bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleComplete(ex.id)}
                          className="shrink-0 transition-transform active:scale-90"
                        >
                          {isDone ? (
                            <CheckCircle2 size={24} className="text-[#39ff14]" />
                          ) : (
                            <Circle size={24} className="text-[#6b7280] hover:text-[#9ca3af]" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[#9ca3af]">#{index + 1}</span>
                            <h4 className={`text-sm md:text-base font-bold ${isDone ? 'line-through text-[#9ca3af]' : 'text-white'}`}>
                              {ex.name}
                            </h4>
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#1f1f1f] text-[#39ff14]">
                              {ex.target}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-[#9ca3af] mt-1">
                            <span>
                              Sets: <strong className="text-white">{ex.sets}</strong>
                            </span>
                            <span>
                              Reps: <strong className="text-white">{ex.reps}</strong>
                            </span>
                            <span className="flex items-center gap-1 text-[#38bdf8]">
                              <Timer size={12} /> Rest: {ex.rest}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedExercise(isExpanded ? null : ex.id)}
                        className="p-1.5 rounded-lg bg-[#1f1f1f] text-[#9ca3af] hover:text-white"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {/* Expandable Form & Coaching Cues */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#1f1f1f] text-xs text-[#9ca3af] space-y-2 bg-[#0e0e0e] rounded-b-xl">
                        <div>
                          <strong className="text-white block mb-0.5 font-semibold">How to perform:</strong>
                          <p className="leading-relaxed">{ex.instructions}</p>
                        </div>
                        {ex.tips && (
                          <div className="p-2.5 rounded-lg bg-[#39ff1410] border border-[#39ff1430] text-[#86efac] flex items-start gap-2">
                            <Info size={14} className="shrink-0 mt-0.5 text-[#39ff14]" />
                            <span>
                              <strong>Coach's Pro Tip:</strong> {ex.tips}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Section 3: Cool-down ── */}
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Award size={16} className="text-[#38bdf8]" />
              3. Cool-Down & Parasympathetic Reset (5 Mins)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {workoutPlan.cooldown.map((c, idx) => (
                <div key={idx} className="p-3.5 bg-[#141414] border border-[#1f1f1f] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{c.name}</span>
                    <span className="text-[11px] text-[#38bdf8] font-semibold">{c.duration}</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af]">{c.instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
