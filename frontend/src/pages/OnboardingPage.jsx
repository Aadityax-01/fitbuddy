import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Activity, Target, UtensilsCrossed,
  ChevronRight, ChevronLeft, CheckCircle2,
  Zap, Flame, Dumbbell,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

/* ─── Step configurations ─── */
const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Activity Level', icon: Activity },
  { label: 'Fitness Goals', icon: Target },
  { label: 'Diet & Prefs', icon: UtensilsCrossed },
];

const ACTIVITY_OPTIONS = [
  { key: 'sedentary',    label: 'Sedentary',         desc: 'Little or no exercise',            multiplier: 1.2  },
  { key: 'light',        label: 'Lightly Active',     desc: '1-3 days/week exercise',           multiplier: 1.375 },
  { key: 'moderate',     label: 'Moderately Active',  desc: '3-5 days/week exercise',           multiplier: 1.55 },
  { key: 'very',         label: 'Very Active',        desc: '6-7 days/week hard exercise',      multiplier: 1.725 },
  { key: 'extreme',      label: 'Extremely Active',   desc: 'Physical job + hard training',     multiplier: 1.9  },
];

const GOAL_OPTIONS = [
  { key: 'lose',      label: 'Lose Weight',        icon: '🔥', desc: 'Burn fat, maintain muscle',     adjust: -300 },
  { key: 'build',     label: 'Build Muscle',        icon: '💪', desc: 'Gain lean muscle mass',         adjust: +300 },
  { key: 'stay',      label: 'Stay Fit',            icon: '⚡', desc: 'Maintain current physique',      adjust: 0    },
  { key: 'gain',      label: 'Gain Weight',         icon: '📈', desc: 'Healthy weight gain',           adjust: +500 },
  { key: 'endurance', label: 'Improve Endurance',   icon: '🏃', desc: 'Boost cardio & stamina',        adjust: +100 },
];

const DIET_TYPES   = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];
const CUISINE_OPTS = ['Indian', 'Mixed', 'Western', 'Other'];
const ALLERGY_OPTS = ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Soy'];
const EQUIPMENT    = ['Home', 'Gym', 'Both'];

/* ─── BMI calculation ─── */
function calcBMI(weight, height) {
  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  if (!h || !w) return null;
  return (w / (h * h)).toFixed(1);
}
function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
  if (bmi < 25)   return { label: 'Normal',       color: '#39ff14' };
  if (bmi < 30)   return { label: 'Overweight',   color: '#f97316' };
  return                  { label: 'Obese',        color: '#ef4444' };
}
function calcTDEE(age, gender, weight, height, activityMultiplier) {
  const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age);
  if (!w || !h || !a) return null;
  // Mifflin-St Jeor
  const bmr = gender === 'Female'
    ? 10 * w + 6.25 * h - 5 * a - 161
    : 10 * w + 6.25 * h - 5 * a + 5;
  return Math.round(bmr * activityMultiplier);
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateProfile } = useContext(AuthContext);

  const [step, setStep]   = useState(0);
  const [saving, setSaving] = useState(false);

  const [info, setInfo] = useState({ age: '', gender: '', height: '', weight: '' });
  const [activity, setActivity]   = useState('');
  const [goals, setGoals]         = useState([]);
  const [diet, setDiet]           = useState({
    type: '', cuisine: '', allergies: [], equipment: '',
  });

  /* ── derived values ── */
  const bmi     = calcBMI(info.weight, info.height);
  const bmiCat  = bmi ? bmiCategory(parseFloat(bmi)) : null;
  const actMult = ACTIVITY_OPTIONS.find(a => a.key === activity)?.multiplier || 1.55;
  const tdee    = calcTDEE(info.age, info.gender, info.weight, info.height, actMult);
  const goalAdj = GOAL_OPTIONS.find(g => goals.includes(g.key))?.adjust || 0;
  const calorieGoal = tdee ? tdee + goalAdj : null;

  /* ── step validation ── */
  const canNext = () => {
    if (step === 0) return info.age && info.gender && info.height && info.weight;
    if (step === 1) return !!activity;
    if (step === 2) return goals.length > 0;
    if (step === 3) return diet.type && diet.equipment;
    return true;
  };

  const handleAllergyToggle = allergy => {
    setDiet(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  const handleGoalToggle = key => {
    setGoals(prev =>
      prev.includes(key) ? prev.filter(g => g !== key) : [...prev, key]
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await updateProfile({
        ...info,
        activityLevel: activity,
        goals,
        diet,
        bmi: parseFloat(bmi),
        calorieGoal,
      });
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  /* ── reusable style helpers ── */
  const card = (selected, color = '#39ff14') => ({
    background: selected ? `${color}15` : '#1a1a1a',
    border: `1px solid ${selected ? color : '#2a2a2a'}`,
    borderRadius: '12px', padding: '1rem 1.25rem',
    cursor: 'pointer', transition: 'all 0.2s',
    color: '#fff',
  });

  const labelStyle = { display: 'block', color: '#9ca3af', fontSize: '0.82rem', marginBottom: '5px', fontWeight: 500 };
  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: '10px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box',
  };

  /* ── Step renderers ── */
  const renderStep0 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Gender */}
      <div>
        <label style={labelStyle}>Gender</label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {['Male', 'Female', 'Other'].map(g => (
            <button key={g} type="button"
              onClick={() => setInfo(p => ({ ...p, gender: g }))}
              style={{
                flex: 1, padding: '10px',
                background: info.gender === g ? '#39ff1415' : '#1a1a1a',
                border: `1px solid ${info.gender === g ? '#39ff14' : '#2a2a2a'}`,
                borderRadius: '10px', color: info.gender === g ? '#39ff14' : '#9ca3af',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <label style={labelStyle}>Age (years)</label>
        <input type="number" min="10" max="100" placeholder="25"
          value={info.age} onChange={e => setInfo(p => ({ ...p, age: e.target.value }))}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#39ff14'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {/* Height */}
        <div>
          <label style={labelStyle}>Height (cm)</label>
          <input type="number" min="100" max="250" placeholder="170"
            value={info.height} onChange={e => setInfo(p => ({ ...p, height: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#39ff14'}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          />
        </div>
        {/* Weight */}
        <div>
          <label style={labelStyle}>Weight (kg)</label>
          <input type="number" min="20" max="300" placeholder="70"
            value={info.weight} onChange={e => setInfo(p => ({ ...p, weight: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#39ff14'}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          />
        </div>
      </div>

      {/* Live BMI preview */}
      {bmi && bmiCat && (
        <div style={{
          background: `${bmiCat.color}10`, border: `1px solid ${bmiCat.color}40`,
          borderRadius: '12px', padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Your BMI</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: bmiCat.color }}>{bmi}</div>
          </div>
          <div style={{
            background: `${bmiCat.color}20`, borderRadius: '8px',
            padding: '6px 12px', color: bmiCat.color, fontWeight: 700, fontSize: '0.875rem',
          }}>
            {bmiCat.label}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {ACTIVITY_OPTIONS.map(opt => (
        <button key={opt.key} type="button"
          onClick={() => setActivity(opt.key)}
          style={{
            ...card(activity === opt.key),
            display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
          }}>
          <div style={{
            background: activity === opt.key ? '#39ff1420' : '#ffffff0a',
            borderRadius: '10px', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Activity size={20} color={activity === opt.key ? '#39ff14' : '#9ca3af'} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{opt.label}</div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{opt.desc}</div>
          </div>
          {activity === opt.key && (
            <CheckCircle2 size={18} color="#39ff14" style={{ marginLeft: 'auto' }} />
          )}
        </button>
      ))}
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
      {GOAL_OPTIONS.map(opt => (
        <button key={opt.key} type="button"
          onClick={() => handleGoalToggle(opt.key)}
          style={{
            ...card(goals.includes(opt.key)),
            textAlign: 'left',
            gridColumn: opt.key === 'endurance' ? 'span 2' : 'span 1',
          }}>
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>{opt.icon}</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>{opt.label}</div>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{opt.desc}</div>
          {goals.includes(opt.key) && (
            <div style={{ marginTop: '8px' }}>
              <CheckCircle2 size={16} color="#39ff14" />
            </div>
          )}
        </button>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Diet type */}
      <div>
        <label style={labelStyle}>Diet Type</label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {DIET_TYPES.map(t => (
            <button key={t} type="button"
              onClick={() => setDiet(p => ({ ...p, type: t }))}
              style={{
                padding: '9px 18px',
                background: diet.type === t ? '#39ff1415' : '#1a1a1a',
                border: `1px solid ${diet.type === t ? '#39ff14' : '#2a2a2a'}`,
                borderRadius: '8px', color: diet.type === t ? '#39ff14' : '#9ca3af',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine preference */}
      <div>
        <label style={labelStyle}>Cuisine Preference</label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {CUISINE_OPTS.map(c => (
            <button key={c} type="button"
              onClick={() => setDiet(p => ({ ...p, cuisine: c }))}
              style={{
                padding: '9px 18px',
                background: diet.cuisine === c ? '#3b82f615' : '#1a1a1a',
                border: `1px solid ${diet.cuisine === c ? '#3b82f6' : '#2a2a2a'}`,
                borderRadius: '8px', color: diet.cuisine === c ? '#3b82f6' : '#9ca3af',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label style={labelStyle}>Food Allergies (optional)</label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {ALLERGY_OPTS.map(a => (
            <button key={a} type="button"
              onClick={() => handleAllergyToggle(a)}
              style={{
                padding: '8px 14px',
                background: diet.allergies.includes(a) ? '#ef444415' : '#1a1a1a',
                border: `1px solid ${diet.allergies.includes(a) ? '#ef4444' : '#2a2a2a'}`,
                borderRadius: '8px', color: diet.allergies.includes(a) ? '#ef4444' : '#9ca3af',
                cursor: 'pointer', fontWeight: 500, fontSize: '0.82rem',
                transition: 'all 0.2s',
              }}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div>
        <label style={labelStyle}>Available Equipment</label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {EQUIPMENT.map(eq => (
            <button key={eq} type="button"
              onClick={() => setDiet(p => ({ ...p, equipment: eq }))}
              style={{
                flex: 1, padding: '10px',
                background: diet.equipment === eq ? '#39ff1415' : '#1a1a1a',
                border: `1px solid ${diet.equipment === eq ? '#39ff14' : '#2a2a2a'}`,
                borderRadius: '10px', color: diet.equipment === eq ? '#39ff14' : '#9ca3af',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}>
              <Dumbbell size={16} style={{ margin: '0 auto 4px', display: 'block' }} />
              {eq}
            </button>
          ))}
        </div>
      </div>

      {/* Calorie goal preview */}
      {calorieGoal && (
        <div style={{
          background: '#39ff1410', border: '1px solid #39ff1430',
          borderRadius: '12px', padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <Flame size={24} color="#39ff14" />
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Your Daily Calorie Goal</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#39ff14' }}>
              {calorieGoal.toLocaleString()} kcal
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const stepContent = [renderStep0, renderStep1, renderStep2, renderStep3];

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'Inter, sans-serif',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, #39ff1408 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '540px',
        background: '#111', border: '1px solid #1a1a1a',
        borderRadius: '20px', padding: '2.5rem',
        position: 'relative', zIndex: 1,
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <Zap size={20} color="#39ff14" fill="#39ff14" />
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>FitBuddy <span style={{ color: '#39ff14' }}>AI</span></span>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {STEPS.map(({ label, icon: Icon }, i) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: i <= step ? '#39ff14' : '#1a1a1a',
                  border: `2px solid ${i <= step ? '#39ff14' : '#2a2a2a'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  {i < step ? (
                    <CheckCircle2 size={16} color="#000" />
                  ) : (
                    <Icon size={14} color={i === step ? '#000' : '#9ca3af'} />
                  )}
                </div>
                <span style={{ fontSize: '0.65rem', color: i <= step ? '#39ff14' : '#9ca3af', fontWeight: 600, textAlign: 'center', maxWidth: '60px' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress line */}
          <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '2px', marginTop: '4px' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              background: '#39ff14',
              width: `${(step / (STEPS.length - 1)) * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Step title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
            {['Tell us about yourself', 'How active are you?', 'What are your goals?', 'Diet & equipment'][step]}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
            {[
              'We need this to calculate your personalized calorie and macro targets.',
              'Your activity level helps us set the right energy expenditure.',
              'Select all that apply — you can change these later.',
              'Customize your meal plan and workout preferences.',
            ][step]}
          </p>
        </div>

        {/* Step content */}
        {stepContent[step]()}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: '0 0 auto', padding: '12px 20px',
                background: '#1a1a1a', border: '1px solid #2a2a2a',
                borderRadius: '10px', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontWeight: 600, fontSize: '0.9rem',
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              style={{
                flex: 1, padding: '12px',
                background: canNext() ? '#39ff14' : '#39ff1450',
                color: '#000', fontWeight: 800, fontSize: '0.95rem',
                borderRadius: '10px', border: 'none',
                cursor: canNext() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canNext() || saving}
              style={{
                flex: 1, padding: '12px',
                background: canNext() ? '#39ff14' : '#39ff1450',
                color: '#000', fontWeight: 800, fontSize: '0.95rem',
                borderRadius: '10px', border: 'none',
                cursor: canNext() && !saving ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {saving ? 'Saving...' : <>Complete Setup <CheckCircle2 size={16} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
