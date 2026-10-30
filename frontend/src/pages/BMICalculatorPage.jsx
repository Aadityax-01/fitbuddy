import React, { useState, useRef, useEffect } from "react";
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  getCalorieGoal,
  calculateMacros,
  getWaterIntakeGoal,
  activityLevels,
} from "../utils/calculations";

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (desk job, little to no exercise)", mult: 1.2 },
  { value: "lightly_active", label: "Lightly Active (1–3 days/week)", mult: 1.375 },
  { value: "moderately_active", label: "Moderately Active (3–5 days/week)", mult: 1.55 },
  { value: "very_active", label: "Very Active (6–7 days/week)", mult: 1.725 },
  { value: "extra_active", label: "Extra Active (physical job & hard training)", mult: 1.9 },
];

// ─── SVG Arc Gauge ────────────────────────────────────────────────────────────
function BMIGauge({ bmi }) {
  const clampedBMI = Math.min(Math.max(bmi, 10), 40);
  // Map 10-40 → 0-180 degrees
  const angle = ((clampedBMI - 10) / 30) * 180;
  const cx = 120, cy = 110, r = 90;

  const polarToXY = (deg) => {
    const rad = ((deg - 180) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const start = polarToXY(0);
  const end   = polarToXY(180);
  const needle = polarToXY(angle);

  const zones = [
    { from: 0, to: 50,  color: "#3b82f6" }, // underweight
    { from: 50, to: 95, color: "#39ff14" }, // normal
    { from: 95, to: 130, color: "#facc15" }, // overweight
    { from: 130, to: 180, color: "#ef4444" }, // obese
  ];

  const arcPath = (fromDeg, toDeg, color) => {
    const s = polarToXY(fromDeg);
    const e = polarToXY(toDeg);
    const large = toDeg - fromDeg > 90 ? 1 : 0;
    return (
      <path
        key={color + fromDeg}
        d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`}
        stroke={color}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
    );
  };

  return (
    <svg viewBox="0 0 240 130" className="w-full max-w-xs mx-auto">
      {/* Track */}
      <path
        d={`M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`}
        stroke="#1a1a1a"
        strokeWidth="14"
        fill="none"
      />
      {zones.map((z) => arcPath(z.from, z.to, z.color))}
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needle.x}
        y2={needle.y}
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="6" fill="#fff" />
      {/* Labels */}
      <text x="12"  y="125" fontSize="9" fill="#3b82f6">Under</text>
      <text x="68"  y="30"  fontSize="9" fill="#39ff14">Normal</text>
      <text x="145" y="30"  fontSize="9" fill="#facc15">Over</text>
      <text x="192" y="125" fontSize="9" fill="#ef4444">Obese</text>
    </svg>
  );
}

// ─── Macro Bar ────────────────────────────────────────────────────────────────
function MacroBar({ protein, carbs, fats }) {
  const total = protein * 4 + carbs * 4 + fats * 9;
  const pPct  = total ? ((protein * 4) / total) * 100 : 0;
  const cPct  = total ? ((carbs   * 4) / total) * 100 : 0;
  const fPct  = total ? ((fats    * 9) / total) * 100 : 0;

  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-3 mb-2">
        <div style={{ width: `${pPct}%`, background: "#39ff14" }} />
        <div style={{ width: `${cPct}%`, background: "#facc15" }} />
        <div style={{ width: `${fPct}%`, background: "#f97316" }} />
      </div>
      <div className="flex gap-4 text-xs text-gray-400">
        <span><span className="text-[#39ff14]">■</span> Protein {protein}g</span>
        <span><span className="text-[#facc15]">■</span> Carbs {carbs}g</span>
        <span><span className="text-[#f97316]">■</span> Fats {fats}g</span>
      </div>
    </div>
  );
}

// ─── Slider + Number combo ────────────────────────────────────────────────────
function SliderInput({ label, value, onChange, min, max, unit, step = 1 }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <label className="text-gray-300">{label}</label>
        <span className="text-[#39ff14] font-semibold">{value} <span className="text-gray-400 text-xs">{unit}</span></span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: "#39ff14" }}
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-[#39ff14]"
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BMICalculatorPage() {
  const [height, setHeight]   = useState(170);
  const [weight, setWeight]   = useState(70);
  const [age, setAge]         = useState(25);
  const [gender, setGender]   = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal]       = useState("maintain");
  const [results, setResults] = useState(null);
  const [animating, setAnimating] = useState(false);
  const resultsRef = useRef(null);

  const handleCalculate = () => {
    const bmiResult = calculateBMI(weight, height);
    const bmiVal    = bmiResult.value;
    const cat       = {
      label: bmiResult.category,
      color: bmiResult.color,
      range: bmiVal < 18.5 ? "< 18.5" : bmiVal < 25 ? "18.5 – 24.9" : bmiVal < 30 ? "25.0 – 29.9" : "≥ 30.0",
    };
    const bmr   = calculateBMR(weight, height, age, gender);
    const tdee  = calculateTDEE(bmr, activity);
    const goalKey = goal === "lose_weight" ? "lose" : goal === "gain_muscle" ? "gain" : "maintain";
    const cal   = getCalorieGoal(tdee, goalKey);
    const macros = calculateMacros(cal, goalKey);
    const water = (getWaterIntakeGoal(weight) / 1000).toFixed(1);

    setAnimating(true);
    setResults({ bmi: bmiVal, cat, bmr, tdee, cal, macros, water });
    setTimeout(() => {
      setAnimating(false);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const bmiCategories = [
    { range: "< 18.5",     label: "Underweight", color: "#3b82f6" },
    { range: "18.5 – 24.9",label: "Normal",      color: "#39ff14" },
    { range: "25.0 – 29.9",label: "Overweight",  color: "#facc15" },
    { range: "≥ 30.0",     label: "Obese",       color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          BMI <span className="text-[#39ff14]">Calculator</span>
        </h1>
        <p className="text-gray-400 mt-1">
          Calculate your Body Mass Index, BMR, TDEE, and get personalised macro targets.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* ─── Left: Form ─────────────────────────────────────────────────── */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Your Details</h2>

          {/* Height */}
          <SliderInput label="Height" value={height} onChange={setHeight} min={100} max={220} unit="cm" />

          {/* Weight */}
          <SliderInput label="Weight" value={weight} onChange={setWeight} min={30} max={200} unit="kg" />

          {/* Age */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Age</label>
            <input
              type="number"
              min={10}
              max={100}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14] transition-colors"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Gender</label>
            <div className="flex gap-3">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all border ${
                    gender === g
                      ? "bg-[#39ff14] text-black border-[#39ff14]"
                      : "bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-[#39ff14]"
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14] transition-colors appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%239ca3af' viewBox='0 0 20 20'%3E%3Cpath d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
            >
              {ACTIVITY_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#39ff14] transition-colors appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%239ca3af' viewBox='0 0 20 20'%3E%3Cpath d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
            >
              <option value="lose_weight">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain_muscle">Gain Muscle</option>
            </select>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-xl font-bold text-black bg-[#39ff14] hover:bg-[#2fd10f] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] active:scale-95"
          >
            Calculate My Stats
          </button>

          {/* BMI Table */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">BMI Categories</h3>
            <div className="rounded-xl overflow-hidden border border-[#1a1a1a]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a1a1a]">
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">BMI Range</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {bmiCategories.map((c, i) => (
                    <tr key={c.label} className={i % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#111111]"}>
                      <td className="px-4 py-2 text-gray-300">{c.range}</td>
                      <td className="px-4 py-2 font-medium" style={{ color: c.color }}>{c.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ─── Right: Results ──────────────────────────────────────────────── */}
        <div ref={resultsRef}>
          {!results ? (
            <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#39ff14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fill in your details</h3>
              <p className="text-gray-500 text-sm max-w-xs">Enter your height, weight, age, and other info on the left, then hit "Calculate My Stats" to see your results.</p>
            </div>
          ) : (
            <div
              className={`space-y-5 transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
            >
              {/* BMI Score Card */}
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Your BMI Result</h2>
                <BMIGauge bmi={results.bmi} />
                <div className="text-center mt-4">
                  <div
                    className="text-6xl font-black"
                    style={{ color: results.cat.color }}
                  >
                    {results.bmi.toFixed(1)}
                  </div>
                  <div className="mt-1 text-lg font-semibold" style={{ color: results.cat.color }}>
                    {results.cat.label}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">BMI Range: {results.cat.range}</div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "BMR", value: `${Math.round(results.bmr)}`, unit: "kcal/day", tip: "Base Metabolic Rate — calories burned at rest" },
                  { label: "TDEE", value: `${Math.round(results.tdee)}`, unit: "kcal/day", tip: "Total Daily Energy Expenditure" },
                  { label: "Water", value: `${results.water}`, unit: "litres/day", tip: "Recommended daily water intake" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4 text-center group relative cursor-default">
                    <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-[#39ff14]">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.unit}</div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black border border-[#2a2a2a] text-gray-300 text-xs rounded-lg px-3 py-2 w-40 text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                      {stat.tip}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Calories */}
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Recommended Daily Intake</h3>
                  <span className="bg-[#39ff14]/10 text-[#39ff14] text-sm px-3 py-1 rounded-full font-medium border border-[#39ff14]/20">
                    {goal === "lose_weight" ? "Deficit" : goal === "gain_muscle" ? "Surplus" : "Maintenance"}
                  </span>
                </div>
                <div className="text-5xl font-black text-white mb-1">
                  {results.cal.toLocaleString()}
                  <span className="text-xl font-normal text-gray-400 ml-2">kcal</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  {goal === "lose_weight"
                    ? "A 500 kcal deficit from your TDEE to lose ~0.5 kg/week."
                    : goal === "gain_muscle"
                    ? "A 300 kcal surplus from your TDEE to support muscle growth."
                    : "Matches your TDEE to maintain your current weight."}
                </p>
              </div>

              {/* Macros */}
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Macro Breakdown</h3>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: "Protein", value: results.macros.protein, unit: "g", color: "#39ff14", kcal: results.macros.protein * 4 },
                    { label: "Carbs",   value: results.macros.carbs,   unit: "g", color: "#facc15", kcal: results.macros.carbs   * 4 },
                    { label: "Fats",    value: results.macros.fats,    unit: "g", color: "#f97316", kcal: results.macros.fats    * 9 },
                  ].map((m) => (
                    <div key={m.label} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                      <div className="text-2xl font-bold" style={{ color: m.color }}>{m.value}g</div>
                      <div className="text-xs text-gray-600 mt-1">{m.kcal} kcal</div>
                    </div>
                  ))}
                </div>
                <MacroBar {...results.macros} />
              </div>

              {/* Disclaimer */}
              <div className="flex gap-3 bg-[#1a1a0a] border border-[#2a2a0a] rounded-xl p-4">
                <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-400">
                  <span className="text-yellow-400 font-medium">Disclaimer:</span> These are estimates based on standard formulas. Individual results may vary. Please consult a qualified healthcare professional or registered dietitian for personalised advice.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
