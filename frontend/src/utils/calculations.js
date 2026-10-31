/* ─────────────────────────────────────────────────────────────────────────
   FitBuddy AI  ·  Fitness Calculation Utilities
   All pure functions — no side effects, no imports needed.
   ───────────────────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════════════════
   REFERENCE DATA
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Activity level definitions with TDEE multipliers.
 * @type {Array<{id: string, label: string, description: string, multiplier: number}>}
 */
export const activityLevels = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    description: 'Little or no exercise, desk job',
    multiplier: 1.2,
  },
  {
    id: 'lightly_active',
    label: 'Lightly Active',
    description: 'Light exercise 1–3 days/week',
    multiplier: 1.375,
  },
  {
    id: 'moderately_active',
    label: 'Moderately Active',
    description: 'Moderate exercise 3–5 days/week',
    multiplier: 1.55,
  },
  {
    id: 'very_active',
    label: 'Very Active',
    description: 'Hard exercise 6–7 days/week',
    multiplier: 1.725,
  },
  {
    id: 'extra_active',
    label: 'Extra Active',
    description: 'Very hard exercise, physical job, or training twice/day',
    multiplier: 1.9,
  },
];

/**
 * Fitness goal definitions with calorie adjustments.
 * @type {Array<{id: string, label: string, description: string, calorieAdjustment: number, icon: string}>}
 */
export const fitnessGoals = [
  {
    id: 'lose_fast',
    label: 'Lose Weight (Aggressive)',
    description: 'Lose ~1 kg/week  · 1000 kcal deficit',
    calorieAdjustment: -1000,
    icon: '🔥',
  },
  {
    id: 'lose',
    label: 'Lose Weight',
    description: 'Lose ~0.5 kg/week  · 500 kcal deficit',
    calorieAdjustment: -500,
    icon: '⬇️',
  },
  {
    id: 'maintain',
    label: 'Maintain Weight',
    description: 'Stay at current weight',
    calorieAdjustment: 0,
    icon: '⚖️',
  },
  {
    id: 'gain',
    label: 'Gain Muscle',
    description: 'Gain ~0.25 kg/week  · 250 kcal surplus',
    calorieAdjustment: 250,
    icon: '💪',
  },
  {
    id: 'gain_fast',
    label: 'Bulk Up',
    description: 'Gain ~0.5 kg/week  · 500 kcal surplus',
    calorieAdjustment: 500,
    icon: '📈',
  },
];

/**
 * Diet type presets.
 * @type {Array<{id: string, label: string, proteinPct: number, carbsPct: number, fatsPct: number}>}
 */
export const dietTypes = [
  { id: 'balanced',      label: 'Balanced',       proteinPct: 0.30, carbsPct: 0.40, fatsPct: 0.30 },
  { id: 'low_carb',      label: 'Low Carb',        proteinPct: 0.35, carbsPct: 0.25, fatsPct: 0.40 },
  { id: 'keto',          label: 'Keto',            proteinPct: 0.25, carbsPct: 0.05, fatsPct: 0.70 },
  { id: 'high_protein',  label: 'High Protein',    proteinPct: 0.40, carbsPct: 0.35, fatsPct: 0.25 },
  { id: 'vegan',         label: 'Vegan',           proteinPct: 0.25, carbsPct: 0.50, fatsPct: 0.25 },
  { id: 'mediterranean', label: 'Mediterranean',   proteinPct: 0.25, carbsPct: 0.45, fatsPct: 0.30 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   BMI
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Calculate BMI and return its category + display color.
 *
 * @param {number} weight  - Weight in kilograms
 * @param {number} height  - Height in centimetres
 * @returns {{ value: number, category: string, color: string, description: string }}
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height || height <= 0 || weight <= 0) {
    return { value: 0, category: 'Unknown', color: '#5a5a5a', description: '' };
  }

  const heightM = height / 100;
  const value   = parseFloat((weight / (heightM * heightM)).toFixed(1));

  let category, color, description;

  if (value < 16) {
    category    = 'Severely Underweight';
    color       = '#A3A3A3';
    description = 'Severely underweight. Immediate medical attention is advised.';
  } else if (value < 18.5) {
    category    = 'Underweight';
    color       = '#A3A3A3';
    description = 'Below healthy range. Consider a calorie surplus and strength training.';
  } else if (value < 25) {
    category    = 'Normal Weight';
    color       = '#FFFFFF';
    description = 'You are within the healthy weight range. Keep it up!';
  } else if (value < 30) {
    category    = 'Overweight';
    color       = '#D4D4D4';
    description = 'Slightly above the healthy range. A mild calorie deficit can help.';
  } else if (value < 35) {
    category    = 'Obese Class I';
    color       = '#A3A3A3';
    description = 'Moderately obese. Diet and regular exercise are recommended.';
  } else if (value < 40) {
    category    = 'Obese Class II';
    color       = '#737373';
    description = 'Severely obese. Consulting a healthcare professional is strongly advised.';
  } else {
    category    = 'Obese Class III';
    color       = '#525252';
    description = 'Very severely obese. Please seek medical guidance immediately.';
  }

  return { value, category, color, description };
};

/**
 * Return the position (0–100%) of a BMI value on a reference scale of 10–45.
 *
 * @param {number} bmi
 * @returns {number}  percentage 0–100
 */
export const bmiToPercent = (bmi) => {
  const min = 10, max = 45;
  return Math.min(100, Math.max(0, ((bmi - min) / (max - min)) * 100));
};

/* ═══════════════════════════════════════════════════════════════════════════
   BMR  (Mifflin-St Jeor Equation)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Calculate Basal Metabolic Rate using the Mifflin-St Jeor equation.
 *
 * Male:   BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
 * Female: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161
 *
 * @param {number} weight  - Weight in kilograms
 * @param {number} height  - Height in centimetres
 * @param {number} age     - Age in years
 * @param {'male'|'female'|'other'} gender
 * @returns {number}  BMR in kcal/day (rounded)
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age) return 0;

  const base           = 10 * weight + 6.25 * height - 5 * age;
  const genderConstant = gender === 'female' ? -161 : 5;
  return Math.round(base + genderConstant);
};

/* ═══════════════════════════════════════════════════════════════════════════
   TDEE
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Calculate Total Daily Energy Expenditure.
 *
 * @param {number} bmr
 * @param {string} activityLevel  - id from activityLevels array
 * @returns {number}  TDEE in kcal/day (rounded)
 */
export const calculateTDEE = (bmr, activityLevel) => {
  if (!bmr) return 0;
  const level      = activityLevels.find((a) => a.id === activityLevel);
  const multiplier = level ? level.multiplier : 1.2;
  return Math.round(bmr * multiplier);
};

/* ═══════════════════════════════════════════════════════════════════════════
   CALORIE GOAL
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Adjust TDEE based on the user's fitness goal.
 *
 * @param {number} tdee
 * @param {string} goal  - id from fitnessGoals array
 * @returns {number}  target calories per day (minimum 1200)
 */
export const getCalorieGoal = (tdee, goal) => {
  if (!tdee) return 0;
  const preset     = fitnessGoals.find((g) => g.id === goal);
  const adjustment = preset ? preset.calorieAdjustment : 0;
  return Math.max(1200, Math.round(tdee + adjustment));
};

/* ═══════════════════════════════════════════════════════════════════════════
   MACROS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Calculate macro targets in grams based on daily calorie goal and diet type.
 *
 * Caloric density: Protein = 4 kcal/g, Carbs = 4 kcal/g, Fats = 9 kcal/g
 *
 * @param {number} calories   - Daily calorie target
 * @param {string} [dietType='balanced']
 * @returns {{ protein: number, carbs: number, fats: number, calories: number }}
 */
export const calculateMacros = (calories, dietType = 'balanced') => {
  if (!calories) return { protein: 0, carbs: 0, fats: 0, calories: 0 };

  const preset  = dietTypes.find((d) => d.id === dietType) || dietTypes[0];
  const protein = Math.round((calories * preset.proteinPct) / 4);
  const carbs   = Math.round((calories * preset.carbsPct)   / 4);
  const fats    = Math.round((calories * preset.fatsPct)    / 9);

  return { protein, carbs, fats, calories };
};

/* ═══════════════════════════════════════════════════════════════════════════
   WATER INTAKE
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Recommended daily water intake based on body weight.
 * Rule of thumb: 35 ml per kg of body weight.
 *
 * @param {number} weight  - Weight in kilograms
 * @returns {number}  litres per day (rounded to 1 decimal)
 */
export const getWaterIntakeGoal = (weight) => {
  if (!weight || weight <= 0) return 2.5;
  return parseFloat(((weight * 35) / 1000).toFixed(1));
};

/** @param {number} litres @returns {number} */
export const litresToMl = (litres) => Math.round(litres * 1000);

/** @param {number} ml @returns {number} */
export const mlToLitres = (ml) => parseFloat((ml / 1000).toFixed(2));

/* ═══════════════════════════════════════════════════════════════════════════
   FORMATTING HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Format a calorie number for display (e.g. 2150 → "2,150").
 * @param {number} num
 * @returns {string}
 */
export const formatCalories = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Math.round(num).toLocaleString('en-US');
};

/**
 * Format weight for display.
 * @param {number} num
 * @param {'kg'|'lbs'} [unit='kg']
 * @returns {string}
 */
export const formatWeight = (num, unit = 'kg') => {
  if (!num) return `0 ${unit}`;
  if (unit === 'lbs') return `${(num * 2.20462).toFixed(1)} lbs`;
  return `${parseFloat(num.toFixed(1))} kg`;
};

/**
 * Format height for display including imperial equivalent.
 * @param {number} cm
 * @returns {string}
 */
export const formatHeight = (cm) => {
  if (!cm) return '0 cm';
  const totalInches = cm / 2.54;
  const feet        = Math.floor(totalInches / 12);
  const inches      = Math.round(totalInches % 12);
  return `${cm} cm (${feet}'${inches}")`;
};

/**
 * Format a fraction as a percentage string.
 * @param {number} value
 * @param {number} total
 * @param {number} [decimals=0]
 * @returns {string}
 */
export const formatPercent = (value, total, decimals = 0) => {
  if (!total) return '0%';
  return `${((value / total) * 100).toFixed(decimals)}%`;
};

/**
 * Format millilitres for display.
 * @param {number} ml
 * @returns {string}
 */
export const formatWater = (ml) => {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`;
  return `${Math.round(ml)} ml`;
};

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Progress percentage, clamped 0–100.
 * @param {number} current
 * @param {number} goal
 * @returns {number}
 */
export const calcProgress = (current, goal) => {
  if (!goal) return 0;
  return Math.min(100, Math.max(0, Math.round((current / goal) * 100)));
};

/**
 * Remaining calories for the day.
 * @param {number} goal
 * @param {number} consumed
 * @returns {number}
 */
export const remainingCalories = (goal, consumed) =>
  Math.max(0, Math.round(goal - consumed));

/**
 * Net calories (consumed minus burned).
 * @param {number} goal
 * @param {number} consumed
 * @param {number} [burned=0]
 * @returns {number}
 */
export const netCalories = (goal, consumed, burned = 0) =>
  Math.round(consumed - burned);

/* ═══════════════════════════════════════════════════════════════════════════
   IDEAL WEIGHT  (Devine Formula)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Estimate ideal body weight using the Devine formula.
 *
 * Male:   IBW = 50 + 2.3 × (height_in − 60)
 * Female: IBW = 45.5 + 2.3 × (height_in − 60)
 *
 * @param {number} height  - Height in centimetres
 * @param {'male'|'female'|'other'} gender
 * @returns {number}  Ideal body weight in kg
 */
export const calculateIdealWeight = (height, gender) => {
  if (!height) return 0;
  const heightIn = height / 2.54;
  const base     = gender === 'female' ? 45.5 : 50;
  const ibw      = base + 2.3 * (heightIn - 60);
  return Math.max(0, parseFloat(ibw.toFixed(1)));
};

/* ═══════════════════════════════════════════════════════════════════════════
   CALORIE BURN ESTIMATES
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Rough estimate of calories burned using MET values.
 *
 * @param {string} exerciseType
 * @param {number} durationMinutes
 * @param {number} weightKg
 * @returns {number}  estimated kcal burned
 */
export const estimateCaloriesBurned = (exerciseType, durationMinutes, weightKg) => {
  const metValues = {
    walking:    3.5,
    jogging:    7.0,
    running:    9.8,
    cycling:    6.8,
    swimming:   6.0,
    yoga:       2.5,
    strength:   5.0,
    hiit:       8.0,
    dancing:    4.8,
    elliptical: 5.0,
    rowing:     7.0,
    jump_rope:  10.0,
    stretching: 2.3,
  };

  const met   = metValues[exerciseType] || 5.0;
  const hours = durationMinutes / 60;
  return Math.round(met * weightKg * hours);
};

/* ═══════════════════════════════════════════════════════════════════════════
   DATE / STREAK HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

/** @returns {string}  YYYY-MM-DD for today */
export const todayString = () => new Date().toISOString().split('T')[0];

/**
 * Human-readable relative date label.
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const relativeDateLabel = (dateInput) => {
  const input = new Date(dateInput);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  input.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - input) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return `${diffDays} days ago`;
  return input.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Calculate streak from an array of YYYY-MM-DD date strings.
 * @param {string[]} dates
 * @returns {number}
 */
export const calculateStreak = (dates) => {
  if (!dates || dates.length === 0) return 0;

  const sorted = [...dates]
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  const today     = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000;

  if (sorted[0] < yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1] - sorted[i] === 86400000) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

/* ═══════════════════════════════════════════════════════════════════════════
   COLOUR HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Return a colour based on progress percentage.
 * @param {number} percent  0–100
 * @returns {string}
 */
export const progressColor = (percent) => {
  if (percent >= 100) return '#FFFFFF';
  if (percent >= 75)  return '#E5E5E5';
  if (percent >= 50)  return '#D4D4D4';
  if (percent >= 25)  return '#A3A3A3';
  return '#737373';
};

/**
 * Return a colour for a macro ring segment.
 * @param {'protein'|'carbs'|'fats'} macro
 * @returns {string}
 */
export const macroColor = (macro) => {
  const map = { protein: '#FFFFFF', carbs: '#D4D4D4', fats: '#A3A3A3' };
  return map[macro] || '#737373';
};
