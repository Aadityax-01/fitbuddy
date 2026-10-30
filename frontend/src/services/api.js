import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/* ─── Axios instance ──────────────────────────────────────────────── */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/* ─── Auth token injection ────────────────────────────────────────── */
api.interceptors.request.use((config) => {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('fitbuddy_user')); } catch { return null; }
  })();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

/* ─── 401 handler ─────────────────────────────────────────────────── */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fitbuddy_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/* ─── Helper: safe API call with demo fallback ───────────────────── */
const safeCall = async (fn, fallback) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    if (process.env.NODE_ENV === 'development' || !navigator.onLine) {
      console.warn('API unavailable, using demo data');
      return typeof fallback === 'function' ? fallback() : fallback;
    }
    throw err;
  }
};

/* ═══════════════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════════════════ */
export const authApi = {
  login: (email, password) => safeCall(
    () => api.post('/auth/login', { email, password }),
    { token: `demo_${Date.now()}`, user: { id: '1', name: email.split('@')[0], email } }
  ),
  signup: (name, email, password) => safeCall(
    () => api.post('/auth/register', { name, email, password }),
    { token: `demo_${Date.now()}`, user: { id: '1', name, email } }
  ),
};

/* ═══════════════════════════════════════════════════════════════════
   USER / PROFILE
══════════════════════════════════════════════════════════════════════ */
export const userApi = {
  getMe: () => safeCall(() => api.get('/users/me'), null),
  updateMe: (data) => safeCall(() => api.put('/users/me', data), data),
  getProfile: () => safeCall(() => api.get('/users/me/profile'), null),
  updateProfile: (data) => safeCall(() => api.put('/users/me/profile', data), data),
};

/* ═══════════════════════════════════════════════════════════════════
   DIET PLANNER
══════════════════════════════════════════════════════════════════════ */
export const dietApi = {
  generatePlan: (params) => safeCall(
    () => api.post('/diet/generate', params),
    () => generateDemoDietPlan(params)
  ),
  getTodayPlan: () => safeCall(() => api.get('/diet/today'), null),
  getHistory: () => safeCall(() => api.get('/diet/history'), []),
};

/* ═══════════════════════════════════════════════════════════════════
   WORKOUT PLANNER
══════════════════════════════════════════════════════════════════════ */
export const workoutApi = {
  generatePlan: (params) => safeCall(
    () => api.post('/workout/generate', params),
    () => generateDemoWorkoutPlan(params)
  ),
  getTodayPlan: () => safeCall(() => api.get('/workout/today'), null),
  completePlan: (id) => safeCall(() => api.put(`/workout/${id}/complete`, {}), { success: true }),
};

/* ═══════════════════════════════════════════════════════════════════
   CHAT
══════════════════════════════════════════════════════════════════════ */
export const chatApi = {
  sendMessage: (message, sessionId, userProfile) => safeCall(
    () => api.post('/chat/message', { message, session_id: sessionId }),
    () => getDemoChatResponse(message, userProfile)
  ),
  getHistory: (sessionId) => safeCall(() => api.get(`/chat/history/${sessionId}`), []),
  deleteHistory: (sessionId) => safeCall(() => api.delete(`/chat/history/${sessionId}`), {}),
};

/* ═══════════════════════════════════════════════════════════════════
   FOOD LOGS
══════════════════════════════════════════════════════════════════════ */
export const foodApi = {
  logFood: (data) => safeCall(() => api.post('/food/log', data), { id: Date.now(), ...data }),
  getLogs: (date) => safeCall(() => api.get('/food/logs', { params: { date } }), []),
  deleteLog: (id) => safeCall(() => api.delete(`/food/logs/${id}`), {}),
  getSummary: (date) => safeCall(() => api.get('/food/summary', { params: { date } }), null),
  searchFood: (query) => safeCall(
    () => api.get('/food/search', { params: { q: query } }),
    () => INDIAN_FOOD_DB.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
  ),
};

/* ═══════════════════════════════════════════════════════════════════
   WATER LOGS
══════════════════════════════════════════════════════════════════════ */
export const waterApi = {
  logWater: (amount_ml) => safeCall(
    () => api.post('/water/log', { amount_ml }),
    { id: Date.now(), amount_ml, created_at: new Date().toISOString() }
  ),
  getLogs: (date) => safeCall(() => api.get('/water/logs', { params: { date } }), []),
  getSummary: (date) => safeCall(() => api.get('/water/summary', { params: { date } }), { total_ml: 0 }),
};

/* ═══════════════════════════════════════════════════════════════════
   PROGRESS
══════════════════════════════════════════════════════════════════════ */
export const progressApi = {
  logWeight: (weight_kg) => safeCall(
    () => api.post('/progress/weight', { weight_kg }),
    { id: Date.now(), weight_kg, date: new Date().toISOString().split('T')[0] }
  ),
  getWeightHistory: () => safeCall(() => api.get('/progress/weight'), DEMO_WEIGHT_HISTORY),
  getOverview: () => safeCall(() => api.get('/progress/overview'), DEMO_OVERVIEW),
  getWeekly: () => safeCall(() => api.get('/progress/weekly'), DEMO_WEEKLY),
};

/* ═══════════════════════════════════════════════════════════════════
   DEMO DATA GENERATORS
══════════════════════════════════════════════════════════════════════ */
export const INDIAN_FOOD_DB = [
  { id: 1, name: 'Cooked Rice', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, unit: '100g', category: 'grains' },
  { id: 2, name: 'Dal Tadka', calories: 120, protein: 7, carbs: 18, fats: 3, unit: '100g', category: 'dal' },
  { id: 3, name: 'Roti / Chapati', calories: 80, protein: 2.5, carbs: 15, fats: 1.2, unit: '1 piece', category: 'grains' },
  { id: 4, name: 'Paneer', calories: 265, protein: 18, carbs: 2, fats: 21, unit: '100g', category: 'dairy' },
  { id: 5, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, unit: '100g', category: 'protein' },
  { id: 6, name: 'Egg (Whole)', calories: 78, protein: 6, carbs: 0.6, fats: 5, unit: '1 egg', category: 'protein' },
  { id: 7, name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, unit: '1 medium', category: 'fruit' },
  { id: 8, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, unit: '1 medium', category: 'fruit' },
  { id: 9, name: 'Oats', calories: 389, protein: 17, carbs: 66, fats: 7, unit: '100g', category: 'grains' },
  { id: 10, name: 'Curd / Yogurt', calories: 98, protein: 11, carbs: 3.4, fats: 4.7, unit: '100g', category: 'dairy' },
  { id: 11, name: 'Almonds', calories: 69, protein: 2.5, carbs: 2.4, fats: 6, unit: '10 pieces', category: 'nuts' },
  { id: 12, name: 'Peanut Butter', calories: 94, protein: 4, carbs: 3, fats: 8, unit: '1 tbsp', category: 'nuts' },
  { id: 13, name: 'Paratha', calories: 200, protein: 4, carbs: 27, fats: 8, unit: '1 piece', category: 'grains' },
  { id: 14, name: 'Idli', calories: 39, protein: 1.9, carbs: 8, fats: 0.2, unit: '1 piece', category: 'grains' },
  { id: 15, name: 'Sambar', calories: 55, protein: 3, carbs: 9, fats: 1, unit: '100ml', category: 'dal' },
  { id: 16, name: 'Dosa', calories: 133, protein: 3, carbs: 25, fats: 2.5, unit: '1 piece', category: 'grains' },
  { id: 17, name: 'Poha', calories: 76, protein: 1.5, carbs: 15, fats: 1.8, unit: '100g cooked', category: 'grains' },
  { id: 18, name: 'Rajma (Cooked)', calories: 127, protein: 8, carbs: 23, fats: 0.5, unit: '100g', category: 'dal' },
  { id: 19, name: 'Chana Masala', calories: 130, protein: 7, carbs: 22, fats: 2.5, unit: '100g', category: 'dal' },
  { id: 20, name: 'Moong Dal', calories: 105, protein: 7, carbs: 19, fats: 0.4, unit: '100g cooked', category: 'dal' },
  { id: 21, name: 'Aloo (Boiled)', calories: 77, protein: 2, carbs: 17, fats: 0.1, unit: '100g', category: 'vegetable' },
  { id: 22, name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, unit: '100g', category: 'vegetable' },
  { id: 23, name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, unit: '100g', category: 'vegetable' },
  { id: 24, name: 'Tomato', calories: 22, protein: 1.1, carbs: 4.8, fats: 0.2, unit: '1 medium', category: 'vegetable' },
  { id: 25, name: 'Mixed Veg Sabzi', calories: 60, protein: 2, carbs: 10, fats: 2, unit: '100g', category: 'vegetable' },
  { id: 26, name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fats: 0.4, unit: '100g', category: 'fruit' },
  { id: 27, name: 'Papaya', calories: 43, protein: 0.5, carbs: 11, fats: 0.3, unit: '100g', category: 'fruit' },
  { id: 28, name: 'Full Fat Milk', calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, unit: '100ml', category: 'dairy' },
  { id: 29, name: 'Whey Protein', calories: 120, protein: 25, carbs: 3, fats: 1.5, unit: '1 scoop (30g)', category: 'supplement' },
  { id: 30, name: 'Upma', calories: 84, protein: 2, carbs: 16, fats: 2.5, unit: '100g cooked', category: 'grains' },
  { id: 31, name: 'Palak Paneer', calories: 185, protein: 11, carbs: 8, fats: 13, unit: '100g', category: 'curry' },
  { id: 32, name: 'Chicken Curry', calories: 180, protein: 19, carbs: 5, fats: 10, unit: '100g', category: 'curry' },
  { id: 33, name: 'Fish (Rohu)', calories: 97, protein: 16, carbs: 0, fats: 3.5, unit: '100g', category: 'protein' },
  { id: 34, name: 'Multigrain Bread', calories: 69, protein: 3, carbs: 12, fats: 1.5, unit: '1 slice', category: 'grains' },
  { id: 35, name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, unit: '100g', category: 'dairy' },
];

const generateDemoDietPlan = (params) => {
  const cal = params?.calories_target || 2000;
  const isVeg = params?.diet_type === 'vegetarian' || params?.diet_type === 'vegan';

  return {
    id: `plan_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    calories_target: cal,
    meals: {
      breakfast: {
        name: 'Breakfast',
        time: '7:30 AM',
        calories: Math.round(cal * 0.25),
        items: isVeg
          ? [
              { name: 'Oats with banana', portion: '1 bowl (150g)', calories: 200, protein: 7, carbs: 38, fats: 4 },
              { name: 'Boiled eggs', portion: '2 eggs', calories: 156, protein: 12, carbs: 1, fats: 10 },
              { name: 'Green tea', portion: '1 cup', calories: 5, protein: 0, carbs: 1, fats: 0 },
            ]
          : [
              { name: 'Oats with banana', portion: '1 bowl (150g)', calories: 200, protein: 7, carbs: 38, fats: 4 },
              { name: 'Boiled eggs', portion: '2 eggs', calories: 156, protein: 12, carbs: 1, fats: 10 },
              { name: 'Green tea', portion: '1 cup', calories: 5, protein: 0, carbs: 1, fats: 0 },
            ],
        protein: 19, carbs: 40, fats: 14,
      },
      lunch: {
        name: 'Lunch',
        time: '1:00 PM',
        calories: Math.round(cal * 0.35),
        items: isVeg
          ? [
              { name: 'Roti', portion: '3 pieces', calories: 240, protein: 7.5, carbs: 45, fats: 3.6 },
              { name: 'Paneer sabzi', portion: '100g', calories: 185, protein: 11, carbs: 8, fats: 13 },
              { name: 'Dal', portion: '1 katori (100g)', calories: 120, protein: 7, carbs: 18, fats: 3 },
              { name: 'Curd', portion: '1 katori (100g)', calories: 98, protein: 11, carbs: 3.4, fats: 4.7 },
            ]
          : [
              { name: 'Rice', portion: '1 bowl (150g)', calories: 195, protein: 4, carbs: 42, fats: 0.5 },
              { name: 'Chicken curry', portion: '150g', calories: 270, protein: 28, carbs: 7.5, fats: 15 },
              { name: 'Dal', portion: '1 katori (100g)', calories: 120, protein: 7, carbs: 18, fats: 3 },
              { name: 'Salad', portion: '1 bowl', calories: 50, protein: 2, carbs: 10, fats: 0.5 },
            ],
        protein: 40, carbs: 75, fats: 22,
      },
      snack: {
        name: 'Evening Snack',
        time: '4:00 PM',
        calories: Math.round(cal * 0.10),
        items: [
          { name: 'Almonds', portion: '20 pieces', calories: 138, protein: 5, carbs: 4.8, fats: 12 },
          { name: 'Apple', portion: '1 medium', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
        ],
        protein: 5.5, carbs: 29.8, fats: 12.3,
      },
      dinner: {
        name: 'Dinner',
        time: '8:00 PM',
        calories: Math.round(cal * 0.30),
        items: isVeg
          ? [
              { name: 'Multigrain roti', portion: '2 pieces', calories: 160, protein: 5, carbs: 30, fats: 2.4 },
              { name: 'Mixed veg sabzi', portion: '150g', calories: 90, protein: 3, carbs: 15, fats: 3 },
              { name: 'Dal', portion: '1 katori', calories: 120, protein: 7, carbs: 18, fats: 3 },
              { name: 'Curd', portion: '100g', calories: 98, protein: 11, carbs: 3.4, fats: 4.7 },
            ]
          : [
              { name: 'Multigrain roti', portion: '2 pieces', calories: 160, protein: 5, carbs: 30, fats: 2.4 },
              { name: 'Grilled chicken', portion: '100g', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
              { name: 'Stir-fried vegetables', portion: '150g', calories: 90, protein: 3, carbs: 15, fats: 3 },
            ],
        protein: 45, carbs: 63, fats: 13,
      },
    },
  };
};

const generateDemoWorkoutPlan = (params) => {
  const level = params?.level || 'beginner';
  const isGym = params?.type === 'gym';

  const homeBeginnerPlan = {
    id: `workout_${Date.now()}`,
    title: 'Full Body Home Workout',
    level: 'Beginner',
    type: 'Home',
    duration: params?.duration_mins || 30,
    warmup: [
      { name: 'Jumping Jacks', duration: '2 min', instructions: 'Stand upright, jump spreading legs and raising arms simultaneously.' },
      { name: 'Arm Circles', duration: '1 min', instructions: 'Extend arms, rotate in forward then backward circles.' },
      { name: 'Leg Swings', duration: '1 min', instructions: 'Hold wall, swing each leg forward and back.' },
    ],
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '10–12', rest: '60 sec', muscle: 'Chest, Shoulders, Triceps', instructions: 'Keep body straight, lower chest to floor, push back up.' },
      { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '60 sec', muscle: 'Quads, Glutes, Hamstrings', instructions: 'Feet shoulder-width apart, lower until thighs are parallel to floor.' },
      { name: 'Plank', sets: 3, reps: '30 sec', rest: '45 sec', muscle: 'Core', instructions: 'Forearms and toes on ground, keep body straight as a plank.' },
      { name: 'Glute Bridges', sets: 3, reps: '15', rest: '45 sec', muscle: 'Glutes, Core', instructions: 'Lie on back, feet flat, drive hips up squeezing glutes.' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 total', rest: '60 sec', muscle: 'Core, Cardio', instructions: 'Plank position, alternate driving knees to chest quickly.' },
    ],
    cooldown: [
      { name: 'Child\'s Pose', duration: '1 min', instructions: 'Kneel and stretch arms forward on the floor, relax.' },
      { name: 'Hamstring Stretch', duration: '1 min each leg', instructions: 'Sit, extend one leg, reach toward foot.' },
      { name: 'Chest Stretch', duration: '1 min', instructions: 'Clasp hands behind back, lift and squeeze shoulder blades.' },
    ],
  };

  return homeBeginnerPlan;
};

const DEMO_RESPONSES = {
  protein: 'Based on your fitness goal, you need approximately **1.6–2.2g of protein per kg** of body weight. For a 70kg person, that\'s **112–154g of protein daily**. Good sources include chicken breast, eggs, paneer, dal, curd, and whey protein. 💪',
  diet: 'Here\'s a simple Indian diet plan for you:\n\n**Breakfast:** Oats with milk + 2 boiled eggs or paneer bhurji\n**Lunch:** 2–3 rotis + dal + sabzi + curd\n**Snack:** Fruits + a handful of almonds\n**Dinner:** 2 rotis + dal or light sabzi\n\nFocus on whole foods and avoid processed junk! 🥗',
  workout: 'Here\'s a simple beginner workout to start with:\n\n**Monday/Wednesday/Friday (Full Body):**\n- Push-ups: 3 × 10\n- Squats: 3 × 15\n- Plank: 3 × 30 sec\n- Walking/Jogging: 20 min\n\nRest on Tue/Thu/Sat. Consistency beats intensity for beginners! 🏋️',
  calories: 'Calorie needs vary based on your age, weight, height, and activity level. To estimate:\n1. Calculate BMR using the **Mifflin-St Jeor formula**\n2. Multiply by your activity level (1.2–1.9)\n\nFor example, a moderately active 25-year-old male weighing 70kg needs approximately **2,200–2,500 calories/day**. Use the BMI Calculator for precise estimates! 🔢',
  default: 'I\'m FitBuddy AI Coach! I can help you with:\n\n• **Diet planning** – personalized meal plans\n• **Workout routines** – beginner to advanced\n• **Calorie tracking** – what to eat and how much\n• **Nutrition info** – macros, vitamins, Indian foods\n\nWhat would you like to know? Ask me anything about fitness and nutrition! 💚',
};

const getDemoChatResponse = (message, userProfile) => {
  const msg = message.toLowerCase();
  let reply = DEMO_RESPONSES.default;

  if (msg.includes('protein')) reply = DEMO_RESPONSES.protein;
  else if (msg.includes('diet') || msg.includes('eat') || msg.includes('meal') || msg.includes('food')) reply = DEMO_RESPONSES.diet;
  else if (msg.includes('workout') || msg.includes('exercise') || msg.includes('training')) reply = DEMO_RESPONSES.workout;
  else if (msg.includes('calorie') || msg.includes('weight') || msg.includes('bmi')) reply = DEMO_RESPONSES.calories;

  if (userProfile?.name) {
    reply = `Hey ${userProfile.name}! 👋\n\n` + reply;
  }

  return {
    id: `msg_${Date.now()}`,
    role: 'assistant',
    content: reply,
    created_at: new Date().toISOString(),
  };
};

const today = new Date();
export const DEMO_WEIGHT_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(today.getTime() - (29 - i) * 86400000).toISOString().split('T')[0],
  weight_kg: 75 - i * 0.15 + (Math.random() - 0.5) * 0.5,
}));

export const DEMO_OVERVIEW = {
  current_weight: 72.5,
  starting_weight: 78.0,
  target_weight: 68.0,
  total_workouts: 24,
  current_streak: 5,
  avg_calories: 2050,
  calorie_target: 2000,
  avg_water_ml: 2200,
  water_target: 2500,
};

export const DEMO_WEEKLY = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toISOString().split('T')[0],
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
    calories: 1800 + Math.round(Math.random() * 600),
    target: 2000,
    workout_done: Math.random() > 0.3,
    water_ml: 1800 + Math.round(Math.random() * 900),
  };
});

export default api;
