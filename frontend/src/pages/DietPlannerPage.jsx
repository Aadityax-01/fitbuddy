import React, { useState } from "react";

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_PLANS = {
  vegetarian: {
    breakfast: {
      name: "Breakfast",
      icon: "🌅",
      time: "7:00 – 8:00 AM",
      items: [
        { name: "Masala Oats", portion: "1 bowl (80g)", calories: 310, protein: 10, carbs: 52, fats: 6 },
        { name: "Mixed Nuts (almonds, walnuts)", portion: "1 small handful (25g)", calories: 145, protein: 4, carbs: 5, fats: 13 },
        { name: "Banana", portion: "1 medium", calories: 89, protein: 1, carbs: 23, fats: 0 },
        { name: "Green Tea", portion: "1 cup", calories: 2, protein: 0, carbs: 0, fats: 0 },
      ],
    },
    lunch: {
      name: "Lunch",
      icon: "☀️",
      time: "12:30 – 1:30 PM",
      items: [
        { name: "Dal Tadka", portion: "2 katori (200g)", calories: 220, protein: 12, carbs: 34, fats: 5 },
        { name: "Steamed Basmati Rice", portion: "1 cup cooked (150g)", calories: 195, protein: 4, carbs: 43, fats: 0 },
        { name: "Aloo Gobhi Sabzi", portion: "1 katori (150g)", calories: 145, protein: 4, carbs: 20, fats: 5 },
        { name: "Curd (low-fat)", portion: "1 bowl (100g)", calories: 60, protein: 4, carbs: 5, fats: 2 },
        { name: "Salad (cucumber + tomato)", portion: "1 plate", calories: 35, protein: 1, carbs: 7, fats: 0 },
      ],
    },
    snack: {
      name: "Evening Snack",
      icon: "🌤️",
      time: "4:00 – 5:00 PM",
      items: [
        { name: "Paneer Tikka (grilled)", portion: "100g", calories: 170, protein: 14, carbs: 4, fats: 11 },
        { name: "Mint Chutney", portion: "2 tbsp", calories: 15, protein: 0, carbs: 3, fats: 0 },
        { name: "Lemon Water / Buttermilk", portion: "1 glass", calories: 15, protein: 1, carbs: 2, fats: 0 },
      ],
    },
    dinner: {
      name: "Dinner",
      icon: "🌙",
      time: "7:30 – 8:30 PM",
      items: [
        { name: "Whole Wheat Roti", portion: "3 rotis", calories: 255, protein: 9, carbs: 48, fats: 3 },
        { name: "Palak Paneer", portion: "1 katori (150g)", calories: 200, protein: 13, carbs: 10, fats: 13 },
        { name: "Moong Dal Soup", portion: "1 bowl (200ml)", calories: 110, protein: 8, carbs: 16, fats: 1 },
      ],
    },
  },
  non_veg: {
    breakfast: {
      name: "Breakfast",
      icon: "🌅",
      time: "7:00 – 8:00 AM",
      items: [
        { name: "Scrambled Eggs (3 eggs)", portion: "3 whole eggs", calories: 210, protein: 18, carbs: 2, fats: 15 },
        { name: "Whole Wheat Toast", portion: "2 slices", calories: 140, protein: 5, carbs: 24, fats: 2 },
        { name: "Orange Juice", portion: "1 glass (200ml)", calories: 90, protein: 1, carbs: 21, fats: 0 },
      ],
    },
    lunch: {
      name: "Lunch",
      icon: "☀️",
      time: "12:30 – 1:30 PM",
      items: [
        { name: "Chicken Curry", portion: "200g (with 2 pieces)", calories: 290, protein: 30, carbs: 8, fats: 14 },
        { name: "Brown Rice", portion: "1 cup cooked (150g)", calories: 215, protein: 5, carbs: 45, fats: 2 },
        { name: "Mixed Vegetable Sabzi", portion: "1 katori", calories: 120, protein: 3, carbs: 18, fats: 4 },
        { name: "Raita", portion: "1 bowl (100g)", calories: 55, protein: 3, carbs: 6, fats: 2 },
      ],
    },
    snack: {
      name: "Evening Snack",
      icon: "🌤️",
      time: "4:00 – 5:00 PM",
      items: [
        { name: "Boiled Eggs", portion: "2 eggs", calories: 140, protein: 12, carbs: 1, fats: 10 },
        { name: "Apple", portion: "1 medium", calories: 80, protein: 0, carbs: 21, fats: 0 },
        { name: "Black Coffee", portion: "1 cup", calories: 5, protein: 0, carbs: 1, fats: 0 },
      ],
    },
    dinner: {
      name: "Dinner",
      icon: "🌙",
      time: "7:30 – 8:30 PM",
      items: [
        { name: "Grilled Fish (Rohu / Pomfret)", portion: "150g", calories: 185, protein: 28, carbs: 0, fats: 7 },
        { name: "Whole Wheat Roti", portion: "2 rotis", calories: 170, protein: 6, carbs: 32, fats: 2 },
        { name: "Dal Makhani", portion: "1 katori (150g)", calories: 200, protein: 10, carbs: 28, fats: 7 },
        { name: "Cucumber Salad", portion: "1 bowl", calories: 25, protein: 1, carbs: 5, fats: 0 },
      ],
    },
  },
  vegan: {
    breakfast: {
      name: "Breakfast",
      icon: "🌅",
      time: "7:00 – 8:00 AM",
      items: [
        { name: "Overnight Oats (almond milk)", portion: "1 bowl (300ml)", calories: 290, protein: 9, carbs: 47, fats: 8 },
        { name: "Chia Seeds", portion: "1 tbsp", calories: 58, protein: 2, carbs: 5, fats: 4 },
        { name: "Blueberries", portion: "½ cup", calories: 42, protein: 1, carbs: 11, fats: 0 },
        { name: "Walnuts", portion: "5 halves", calories: 93, protein: 2, carbs: 2, fats: 9 },
      ],
    },
    lunch: {
      name: "Lunch",
      icon: "☀️",
      time: "12:30 – 1:30 PM",
      items: [
        { name: "Rajma (kidney bean curry)", portion: "1.5 katori", calories: 240, protein: 14, carbs: 40, fats: 3 },
        { name: "Quinoa / Brown Rice", portion: "1 cup cooked", calories: 220, protein: 8, carbs: 39, fats: 4 },
        { name: "Roasted Veggies", portion: "1 bowl", calories: 110, protein: 3, carbs: 18, fats: 3 },
      ],
    },
    snack: {
      name: "Evening Snack",
      icon: "🌤️",
      time: "4:00 – 5:00 PM",
      items: [
        { name: "Hummus", portion: "3 tbsp (60g)", calories: 108, protein: 4, carbs: 10, fats: 6 },
        { name: "Carrot & Celery Sticks", portion: "1 cup", calories: 50, protein: 1, carbs: 11, fats: 0 },
        { name: "Coconut Water", portion: "1 glass (250ml)", calories: 45, protein: 0, carbs: 9, fats: 0 },
      ],
    },
    dinner: {
      name: "Dinner",
      icon: "🌙",
      time: "7:30 – 8:30 PM",
      items: [
        { name: "Tofu Bhurji", portion: "150g", calories: 170, protein: 16, carbs: 6, fats: 9 },
        { name: "Whole Wheat Roti", portion: "3 rotis", calories: 255, protein: 9, carbs: 48, fats: 3 },
        { name: "Chana Dal", portion: "1 katori", calories: 190, protein: 11, carbs: 32, fats: 3 },
      ],
    },
  },
};

// ─── Macro Mini Bar ───────────────────────────────────────────────────────────
function MealMacroBar({ protein, carbs, fats }) {
  const total = protein * 4 + carbs * 4 + fats * 9 || 1;
  return (
    <div className="mt-3">
      <div className="flex gap-1 mb-1">
        <div style={{ flex: protein * 4, background: "#39ff14", borderRadius: "3px 0 0 3px" }} className="h-2" />
        <div style={{ flex: carbs   * 4, background: "#facc15" }} className="h-2" />
        <div style={{ flex: fats    * 9, background: "#f97316", borderRadius: "0 3px 3px 0" }} className="h-2" />
      </div>
      <div className="flex gap-3 text-xs text-gray-500">
        <span><span className="text-[#39ff14]">P</span> {protein}g</span>
        <span><span className="text-[#facc15]">C</span> {carbs}g</span>
        <span><span className="text-[#f97316]">F</span> {fats}g</span>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl" />
        <div>
          <div className="w-24 h-4 bg-[#1a1a1a] rounded mb-1" />
          <div className="w-32 h-3 bg-[#1a1a1a] rounded" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between py-2 border-b border-[#1a1a1a]">
          <div className="w-36 h-3 bg-[#1a1a1a] rounded" />
          <div className="w-16 h-3 bg-[#1a1a1a] rounded" />
        </div>
      ))}
      <div className="mt-3 w-full h-2 bg-[#1a1a1a] rounded" />
    </div>
  );
}

// ─── Meal Card ────────────────────────────────────────────────────────────────
function MealCard({ meal, onSwap }) {
  const totalCals    = meal.items.reduce((s, i) => s + i.calories, 0);
  const totalProtein = meal.items.reduce((s, i) => s + i.protein,  0);
  const totalCarbs   = meal.items.reduce((s, i) => s + i.carbs,    0);
  const totalFats    = meal.items.reduce((s, i) => s + i.fats,     0);

  return (
    <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#39ff14]/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-2xl">
            {meal.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{meal.name}</h3>
            <p className="text-xs text-gray-500">{meal.time}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-[#39ff14]">{totalCals}</div>
          <div className="text-xs text-gray-500">kcal</div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-0 divide-y divide-[#1a1a1a]">
        {meal.items.map((item) => (
          <div key={item.name} className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-sm text-gray-200">{item.name}</p>
              <p className="text-xs text-gray-500">{item.portion}</p>
            </div>
            <span className="text-sm text-gray-400 font-medium">{item.calories} kcal</span>
          </div>
        ))}
      </div>

      {/* Macros */}
      <MealMacroBar protein={totalProtein} carbs={totalCarbs} fats={totalFats} />

      {/* Swap button */}
      <button
        onClick={onSwap}
        className="mt-4 w-full py-2 rounded-lg text-sm text-gray-400 border border-[#2a2a2a] hover:border-[#39ff14] hover:text-[#39ff14] transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Swap this meal
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DietPlannerPage() {
  const [calories, setCalories]     = useState(2000);
  const [dietType, setDietType]     = useState("vegetarian");
  const [cuisine, setCuisine]       = useState("Indian");
  const [budget, setBudget]         = useState("medium");
  const [goal, setGoal]             = useState("maintain");
  const [allergies, setAllergies]   = useState([]);
  const [plan, setPlan]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [saved, setSaved]           = useState(false);

  const allergyOptions = ["Dairy", "Gluten", "Nuts", "Soy", "Eggs", "Shellfish"];

  const toggleAllergy = (a) =>
    setAllergies((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const generatePlan = async () => {
    setLoading(true);
    setPlan(null);
    setSaved(false);
    try {
      const res = await fetch("/api/diet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calories, dietType, cuisine, budget, goal, allergies }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setPlan(data);
    } catch {
      // Fallback to demo data
      const key = dietType === "non_vegetarian" ? "non_veg" : dietType === "vegan" ? "vegan" : "vegetarian";
      await new Promise((r) => setTimeout(r, 1800));
      setPlan(DEMO_PLANS[key] || DEMO_PLANS.vegetarian);
    }
    setLoading(false);
  };

  const swapMeal = (mealKey) => {
    if (!plan) return;
    // Cycle within the same diet type
    const key = dietType === "non_vegetarian" ? "non_veg" : dietType === "vegan" ? "vegan" : "vegetarian";
    const pool = DEMO_PLANS[key];
    setPlan((prev) => ({ ...prev, [mealKey]: pool[mealKey] }));
  };

  const totalCals    = plan ? Object.values(plan).reduce((s, m) => s + m.items.reduce((ss, i) => ss + i.calories, 0), 0) : 0;
  const totalProtein = plan ? Object.values(plan).reduce((s, m) => s + m.items.reduce((ss, i) => ss + i.protein,  0), 0) : 0;
  const totalCarbs   = plan ? Object.values(plan).reduce((s, m) => s + m.items.reduce((ss, i) => ss + i.carbs,    0), 0) : 0;
  const totalFats    = plan ? Object.values(plan).reduce((s, m) => s + m.items.reduce((ss, i) => ss + i.fats,     0), 0) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Diet <span className="text-[#39ff14]">Planner</span>
        </h1>
        <p className="text-gray-400 mt-1">Get a personalised daily meal plan based on your preferences and goals.</p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* ─── Left: Preferences ──────────────────────────────────────────── */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 space-y-6 sticky top-8">
          <h2 className="font-semibold text-white text-lg">Preferences</h2>

          {/* Calorie Target */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-gray-300">Calorie Target</label>
              <span className="text-[#39ff14] font-semibold">{calories} kcal</span>
            </div>
            <input
              type="range" min={1200} max={3500} step={50} value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#39ff14" }}
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>1200</span><span>3500</span>
            </div>
          </div>

          {/* Diet Type */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Diet Type</label>
            <div className="flex gap-2">
              {[
                { value: "vegetarian",     label: "Veg 🥦" },
                { value: "non_vegetarian", label: "Non-Veg 🍗" },
                { value: "vegan",          label: "Vegan 🌱" },
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDietType(d.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                    dietType === d.value
                      ? "bg-[#39ff14] text-black border-[#39ff14]"
                      : "bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-[#39ff14]/50"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Cuisine</label>
            <div className="flex gap-2">
              {["Indian", "Continental", "Mixed"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCuisine(c)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                    cuisine === c
                      ? "bg-[#39ff14] text-black border-[#39ff14]"
                      : "bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-[#39ff14]/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Budget</label>
            <div className="flex gap-2">
              {[
                { value: "low", label: "Low 💰" },
                { value: "medium", label: "Medium 💰💰" },
                { value: "high", label: "High 💰💰💰" },
              ].map((b) => (
                <button
                  key={b.value}
                  onClick={() => setBudget(b.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                    budget === b.value
                      ? "bg-[#39ff14] text-black border-[#39ff14]"
                      : "bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-[#39ff14]/50"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "lose",     label: "Lose Weight" },
                { value: "maintain", label: "Maintain"    },
                { value: "gain",     label: "Gain Muscle" },
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                    goal === g.value
                      ? "bg-[#39ff14] text-black border-[#39ff14]"
                      : "bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-[#39ff14]/50"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Allergies / Exclude</label>
            <div className="grid grid-cols-2 gap-2">
              {allergyOptions.map((a) => (
                <label key={a} className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => toggleAllergy(a)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                      allergies.includes(a)
                        ? "bg-[#39ff14] border-[#39ff14]"
                        : "border-[#2a2a2a] group-hover:border-[#39ff14]/50"
                    }`}
                  >
                    {allergies.includes(a) && (
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    onClick={() => toggleAllergy(a)}
                    className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors"
                  >
                    {a}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-black bg-[#39ff14] hover:bg-[#2fd10f] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate My Diet Plan"
            )}
          </button>
        </div>

        {/* ─── Right: Plan ─────────────────────────────────────────────────── */}
        <div>
          {!plan && !loading && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-[#111111] border border-[#1a1a1a] rounded-2xl flex items-center justify-center text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-semibold text-white mb-2">No plan generated yet</h3>
              <p className="text-gray-500 text-sm max-w-xs">Configure your preferences on the left and click "Generate My Diet Plan" to get started.</p>
            </div>
          )}

          {loading && (
            <div className="grid sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {plan && !loading && (
            <>
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                {Object.entries(plan).map(([key, meal]) => (
                  <MealCard key={key} meal={meal} onSwap={() => swapMeal(key)} />
                ))}
              </div>

              {/* Daily Totals */}
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-5 mb-5">
                <h3 className="font-semibold text-white mb-4">Daily Totals</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Calories", value: totalCals,    unit: "kcal", color: "#39ff14" },
                    { label: "Protein",  value: totalProtein, unit: "g",    color: "#3b82f6" },
                    { label: "Carbs",    value: totalCarbs,   unit: "g",    color: "#facc15" },
                    { label: "Fats",     value: totalFats,    unit: "g",    color: "#f97316" },
                  ].map((t) => (
                    <div key={t.label} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: t.color }}>{t.value}</div>
                      <div className="text-xs text-gray-500">{t.unit} {t.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-[#1a1a1a] rounded-full h-2 flex overflow-hidden">
                  <div style={{ flex: totalProtein * 4, background: "#3b82f6" }} />
                  <div style={{ flex: totalCarbs   * 4, background: "#facc15" }} />
                  <div style={{ flex: totalFats    * 9, background: "#f97316" }} />
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span><span className="text-blue-400">■</span> Protein {Math.round((totalProtein * 4 / (totalCals || 1)) * 100)}%</span>
                  <span><span className="text-yellow-400">■</span> Carbs {Math.round((totalCarbs   * 4 / (totalCals || 1)) * 100)}%</span>
                  <span><span className="text-orange-400">■</span> Fats {Math.round((totalFats    * 9 / (totalCals || 1)) * 100)}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={generatePlan}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-300 border border-[#2a2a2a] hover:border-[#39ff14] hover:text-[#39ff14] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate Plan
                </button>
                <button
                  onClick={() => setSaved(true)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    saved
                      ? "bg-[#1a1a1a] text-[#39ff14] border border-[#39ff14]"
                      : "bg-[#39ff14] text-black hover:bg-[#2fd10f] shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                  }`}
                >
                  {saved ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Plan Saved!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save Plan
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
