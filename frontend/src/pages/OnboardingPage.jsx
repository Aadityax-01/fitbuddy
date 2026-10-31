import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Activity, Target, UtensilsCrossed,
  ChevronRight, ChevronLeft, CheckCircle2,
  Zap, Flame, Dumbbell,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

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

function calcBMI(weight, height) {
  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  if (!h || !w) return null;
  return (w / (h * h)).toFixed(1);
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#D4D4D4' };
  if (bmi < 25)   return { label: 'Normal',       color: '#FFFFFF' };
  if (bmi < 30)   return { label: 'Overweight',   color: '#A3A3A3' };
  return                  { label: 'Obese',        color: '#737373' };
}

function calcTDEE(age, gender, weight, height, activityMultiplier) {
  const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age);
  if (!w || !h || !a) return null;
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

  const bmi     = calcBMI(info.weight, info.height);
  const bmiCat  = bmi ? bmiCategory(parseFloat(bmi)) : null;
  const actMult = ACTIVITY_OPTIONS.find(a => a.key === activity)?.multiplier || 1.55;
  const tdee    = calcTDEE(info.age, info.gender, info.weight, info.height, actMult);
  const goalAdj = GOAL_OPTIONS.find(g => goals.includes(g.key))?.adjust || 0;
  const calorieGoal = tdee ? tdee + goalAdj : null;

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

  const card = (selected) => ({
    background: selected ? '#262626' : '#171717',
    border: `1px solid ${selected ? '#FFFFFF' : '#404040'}`,
    borderRadius: '12px', padding: '1rem 1.25rem',
    cursor: 'pointer', transition: 'all 0.2s',
    color: '#fff',
  });

  const labelStyle = { display: 'block', color: '#A3A3A3', fontSize: '0.82rem', marginBottom: '5px', fontWeight: 600 };
  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: '#262626', border: '1px solid #404040',
    borderRadius: '10px', color: '#fff', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box',
  };

  const renderStep0 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      <div>
        <label style={labelStyle}>Gender</label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {['Male', 'Female', 'Other'].map(g => (
            <button key={g} type="button"
              onClick={() => setInfo(p => ({ ...p, gender: g }))}
              style={{
                flex: 1, padding: '10px',
                background: info.gender === g ? '#262626' : '#171717',
                border: `1px solid ${info.gender === g ? '#FFFFFF' : '#404040'}`,
                borderRadius: '10px', color: info.gender === g ? '#FFFFFF' : '#A3A3A3',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Age (years)</label>
        <input type="number" min="10" max="100" placeholder="25"
          value={info.age} onChange={e => setInfo(p => ({ ...p, age: e.target.value }))}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#FFFFFF'}
          onBlur={e => e.target.style.borderColor = '#404040'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={labelStyle}>Height (cm)</label>
          <input type="number" min="100" max="250" placeholder="170"
            value={info.height} onChange={e => setInfo(p => ({ ...p, height: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#FFFFFF'}
            onBlur={e => e.target.style.borderColor = '#404040'}
          />
        </div>
        <div>
          <label style={labelStyle}>Weight (kg)</label>
          <input type="number" min="20" max="300" placeholder="70"
            value={info.weight} onChange={e => setInfo(p => ({ ...p, weight: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#FFFFFF'}
            onBlur={e => e.target.style.borderColor = '#404040'}
          />
        </div>
      </div>

      {bmi && bmiCat && (
        <div style={{
          background: '#262626', border: '1px solid #404040',
          borderRadius: '12px', padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#A3A3A3' }}>Your BMI</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: bmiCat.color }}>{bmi}</div>
          </div>
          <div style={{
            background: '#171717', border: '1px solid #404040', borderRadius: '8px',
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
            background: activity === opt.key ? '#FFFFFF' : '#262626',
            borderRadius: '10px', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Activity size={20} color={activity === opt.key ? '#000000' : '#A3A3A3'} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px', color: '#FFFFFF' }}>{opt.label}</div>
            <div style={{ fontSize: '0.8rem', color: '#A3A3A3' }}>{opt.desc}</div>
          </div>
          {activity === opt.key && (
            <CheckCircle2 size={18} color="#FFFFFF" style={{ marginLeft: 'auto' }} />
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
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px', color: '#FFFFFF' }}>{opt.label}</div>
          <div style={{ fontSize: '0.78rem', color: '#A3A3A3' }}>{opt.desc}</div>
          {goals.includes(opt.key) && (
            <div style={{ marginTop: '8px' }}>
              <CheckCircle2 size={16} color="#FFFFFF" />
            </div>
          )}
        </button>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={labelStyle}>Diet Type</label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {DIET_TYPES.map(t => (
            <button key={t} type="button"
              onClick={() => setDiet(p => ({ ...p, type: t }))}
              style={{
                padding: '9px 18px',
                background: diet.type === t ? '#262626' : '#171717',
                border: `1px solid ${diet.type === t ? '#FFFFFF' : '#404040'}`,
                borderRadius: '8px', color: diet.type === t ? '#FFFFFF' : '#A3A3A3',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Cuisine Preference</label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {CUISINE_OPTS.map(c => (
            <button key={c} type="button"
              onClick={() => setDiet(p => ({ ...p, cuisine: c }))}
              style={{
                padding: '9px 18px',
                background: diet.cuisine === c ? '#262626' : '#171717',
                border: `1px solid ${diet.cuisine === c ? '#FFFFFF' : '#404040'}`,
                borderRadius: '8px', color: diet.cuisine === c ? '#FFFFFF' : '#A3A3A3',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Food Allergies (optional)</label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {ALLERGY_OPTS.map(a => (
            <button key={a} type="button"
              onClick={() => handleAllergyToggle(a)}
              style={{
                padding: '8px 14px',
                background: diet.allergies.includes(a) ? '#262626' : '#171717',
                border: `1px solid ${diet.allergies.includes(a) ? '#FFFFFF' : '#404040'}`,
                borderRadius: '8px', color: diet.allergies.includes(a) ? '#FFFFFF' : '#A3A3A3',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                transition: 'all 0.2s',
              }}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Available Equipment</label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {EQUIPMENT.map(eq => (
            <button key={eq} type="button"
              onClick={() => setDiet(p => ({ ...p, equipment: eq }))}
              style={{
                flex: 1, padding: '10px',
                background: diet.equipment === eq ? '#262626' : '#171717',
                border: `1px solid ${diet.equipment === eq ? '#FFFFFF' : '#404040'}`,
                borderRadius: '10px', color: diet.equipment === eq ? '#FFFFFF' : '#A3A3A3',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}>
              <Dumbbell size={16} style={{ margin: '0 auto 4px', display: 'block' }} />
              {eq}
            </button>
          ))}
        </div>
      </div>

      {calorieGoal && (
        <div style={{
          background: '#262626', border: '1px solid #404040',
          borderRadius: '12px', padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <Flame size={24} color="#FFFFFF" />
          <div>
            <div style={{ fontSize: '0.8rem', color: '#A3A3A3' }}>Your Daily Calorie Goal</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
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
      minHeight: '100vh', background: '#000000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'Inter, sans-serif',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', maxWidth: '540px',
        background: '#171717', border: '1px solid #404040',
        borderRadius: '20px', padding: '2.5rem',
        position: 'relative', zIndex: 1,
        boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <Zap size={20} color="#FFFFFF" fill="#FFFFFF" />
          <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>FitBuddy <span style={{ color: '#FFFFFF' }}>AI</span></span>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {STEPS.map(({ label, icon: Icon }, i) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: i <= step ? '#FFFFFF' : '#262626',
                  border: `2px solid ${i <= step ? '#FFFFFF' : '#404040'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  {i < step ? (
                    <CheckCircle2 size={16} color="#000000" />
                  ) : (
                    <Icon size={14} color={i === step ? '#000000' : '#A3A3A3'} />
                  )}
                </div>
                <span style={{ fontSize: '0.65rem', color: i <= step ? '#FFFFFF' : '#A3A3A3', fontWeight: 600, textAlign: 'center', maxWidth: '60px' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div style={{ height: '3px', background: '#262626', borderRadius: '2px', marginTop: '4px' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              background: '#FFFFFF',
              width: `${(step / (STEPS.length - 1)) * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Step title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.25rem', color: '#FFFFFF' }}>
            {['Tell us about yourself', 'How active are you?', 'What are your goals?', 'Diet & equipment'][step]}
          </h2>
          <p style={{ color: '#A3A3A3', fontSize: '0.85rem', margin: 0 }}>
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
                background: '#262626', border: '1px solid #404040',
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
                background: canNext() ? '#FFFFFF' : '#404040',
                color: canNext() ? '#000000' : '#737373', fontWeight: 800, fontSize: '0.95rem',
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
                background: canNext() ? '#FFFFFF' : '#404040',
                color: canNext() ? '#000000' : '#737373', fontWeight: 800, fontSize: '0.95rem',
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
