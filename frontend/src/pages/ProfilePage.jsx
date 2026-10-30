import React, { useState } from 'react';
import {
  User,
  Activity,
  Target,
  Utensils,
  Dumbbell,
  Scale,
  Save,
  CheckCircle2,
  Shield,
  LogOut,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  getCalorieGoal,
  getWaterIntakeGoal,
} from '../utils/calculations';

export default function ProfilePage() {
  const { user, updateProfile, updateUser, logout } = useAuth();
  const profile = user?.profile || {};

  const [activeTab, setActiveTab] = useState('personal');
  const [isSaved, setIsSaved] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(profile.age || '');
  const [gender, setGender] = useState(profile.gender || 'male');
  const [height, setHeight] = useState(profile.height || '');
  const [weight, setWeight] = useState(profile.weight || '');
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel || 'moderate');
  const [goal, setGoal] = useState(profile.goal || 'maintain');
  const [dietType, setDietType] = useState(profile.dietType || 'non-vegetarian');
  const [equipment, setEquipment] = useState(profile.equipment || 'both');

  // Real-time calculations
  const bmi = calculateBMI(weight, height);
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calorieGoal = getCalorieGoal(tdee, goal);
  const waterGoal = getWaterIntakeGoal(weight);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ name, email });
    updateProfile({
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel,
      goal,
      dietType,
      equipment,
      dailyCalorieGoal: calorieGoal,
      dailyWaterGoal: waterGoal,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#111111] via-[#141414] to-[#111111] p-6 rounded-2xl border border-[#1a1a1a] shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#39ff14] to-[#22c55e] text-black font-black text-2xl flex items-center justify-center shadow-neon">
            {name ? name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white">{name}</h1>
            <p className="text-xs text-[#9ca3af]">{email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success">FitBuddy Member</Badge>
              <span className="text-xs text-[#9ca3af]">
                Goal: <strong className="text-white capitalize">{goal}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs text-rose-400 hover:text-rose-300 border-rose-500/30 gap-1.5"
          >
            <LogOut size={14} /> Log Out
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="text-xs gap-1.5"
          >
            {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {isSaved ? 'Preferences Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#1a1a1a] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'personal'
              ? 'bg-[#39ff14] text-black'
              : 'text-[#9ca3af] hover:text-white bg-[#141414]'
          }`}
        >
          Personal & Body Stats
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fitness')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'fitness'
              ? 'bg-[#39ff14] text-black'
              : 'text-[#9ca3af] hover:text-white bg-[#141414]'
          }`}
        >
          Fitness & Diet Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'metrics'
              ? 'bg-[#39ff14] text-black'
              : 'text-[#9ca3af] hover:text-white bg-[#141414]'
          }`}
        >
          Calculated Baselines
        </button>
      </div>

      {/* ── Tab 1: Personal & Body Stats ── */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['male', 'female', 'other'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2.5 text-xs font-bold capitalize rounded-xl border transition-all ${
                    gender === g
                      ? 'bg-[#39ff14] text-black border-[#39ff14]'
                      : 'bg-[#161616] text-[#9ca3af] border-[#222222]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Age (Years)"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />

          <Input
            label="Height (cm)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />

          <Input
            label="Current Weight (kg)"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />

          <div className="md:col-span-2 pt-4 flex justify-end">
            <Button type="submit" variant="primary" className="gap-2">
              <Save size={16} /> Save Personal Stats
            </Button>
          </div>
        </form>
      )}

      {/* ── Tab 2: Fitness & Diet Profile ── */}
      {activeTab === 'fitness' && (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 shadow-card">
          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full bg-[#161616] border border-[#222222] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#39ff14]"
            >
              <option value="sedentary">Sedentary (desk job, little activity)</option>
              <option value="light">Lightly Active (light workouts 1-3 days/wk)</option>
              <option value="moderate">Moderately Active (workouts 3-5 days/wk)</option>
              <option value="active">Very Active (hard exercise 6-7 days/wk)</option>
              <option value="extreme">Extremely Active (physical job & double sessions)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Fitness Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-[#161616] border border-[#222222] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#39ff14]"
            >
              <option value="lose">Weight Loss (Moderate Caloric Deficit)</option>
              <option value="cut">Aggressive Fat Loss (Cut)</option>
              <option value="maintain">Maintain Current Weight & Recompose</option>
              <option value="gain">Lean Muscle Hypertrophy</option>
              <option value="bulk">Mass Gain (Caloric Surplus)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Dietary Preference
            </label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full bg-[#161616] border border-[#222222] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#39ff14]"
            >
              <option value="vegetarian">Vegetarian (Lacto-Vegetarian / Indian)</option>
              <option value="non-vegetarian">Non-Vegetarian (Eggs, Poultry, Fish)</option>
              <option value="vegan">Strict Vegan (Plant-Based)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-2">
              Workout Setting & Equipment
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full bg-[#161616] border border-[#222222] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#39ff14]"
            >
              <option value="home">Home (Bodyweight & Resistance Bands)</option>
              <option value="gym">Full Commercial Gym</option>
              <option value="both">Hybrid (Home Dumbbells + Gym)</option>
            </select>
          </div>

          <div className="md:col-span-2 pt-4 flex justify-end">
            <Button type="submit" variant="primary" className="gap-2">
              <Save size={16} /> Update Fitness Preferences
            </Button>
          </div>
        </form>
      )}

      {/* ── Tab 3: Calculated Baselines ── */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5">
            <span className="text-xs text-[#9ca3af] uppercase font-bold">Body Mass Index (BMI)</span>
            <h3 className="text-2xl font-black text-white mt-1">{bmi?.value || '—'}</h3>
            <span className="text-xs font-semibold text-[#39ff14]">{bmi?.category}</span>
            <p className="text-xs text-[#9ca3af] mt-2">{bmi?.description}</p>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5">
            <span className="text-xs text-[#9ca3af] uppercase font-bold">Basal Metabolic Rate (BMR)</span>
            <h3 className="text-2xl font-black text-white mt-1">{bmr || '—'} kcal</h3>
            <span className="text-xs text-[#38bdf8] font-semibold">Mifflin-St Jeor Formula</span>
            <p className="text-xs text-[#9ca3af] mt-2">Base calories burned at complete rest per 24 hours.</p>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5">
            <span className="text-xs text-[#9ca3af] uppercase font-bold">Total Daily Energy (TDEE)</span>
            <h3 className="text-2xl font-black text-white mt-1">{tdee || '—'} kcal</h3>
            <span className="text-xs text-[#f59e0b] font-semibold">Includes Daily Physical Activity</span>
            <p className="text-xs text-[#9ca3af] mt-2">Maintenance calories burned with your current lifestyle.</p>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5">
            <span className="text-xs text-[#9ca3af] uppercase font-bold">Daily Calorie Target</span>
            <h3 className="text-2xl font-black text-[#39ff14] mt-1">{calorieGoal} kcal</h3>
            <span className="text-xs text-[#39ff14] font-semibold">Adjusted for {goal}</span>
            <p className="text-xs text-[#9ca3af] mt-2">Optimal intake to hit your target physique timeline.</p>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5">
            <span className="text-xs text-[#9ca3af] uppercase font-bold">Recommended Hydration</span>
            <h3 className="text-2xl font-black text-[#06b6d4] mt-1">{(waterGoal / 1000).toFixed(1)} Liters</h3>
            <span className="text-xs text-[#06b6d4] font-semibold">{waterGoal} ml / day</span>
            <p className="text-xs text-[#9ca3af] mt-2">35ml per kg body weight benchmark.</p>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5">
            <span className="text-xs text-[#9ca3af] uppercase font-bold">System Status</span>
            <h3 className="text-2xl font-black text-white mt-1">Synced</h3>
            <span className="text-xs text-[#39ff14] font-semibold">AI Assistant Context Active</span>
            <p className="text-xs text-[#9ca3af] mt-2">FitBuddy Coach uses these metrics to personalize answers.</p>
          </div>
        </div>
      )}
    </div>
  );
}
