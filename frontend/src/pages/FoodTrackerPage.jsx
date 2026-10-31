import { useState, useMemo, useRef } from 'react';
import {
  Search, Plus, Trash2, ChevronLeft, ChevronRight, X,
  Flame, Beef, Wheat, Droplets, Coffee, Sun, Moon, Sunset,
  UtensilsCrossed, TrendingUp,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ProgressRing from '../components/ui/ProgressRing';

/* ─── Food Database ─────────────────────────────────────────────────────── */
const FOOD_DB = [
  { id: 1,  name: 'Rice (cooked)',        unit: '100g',  cal: 130, p: 2.7, c: 28.0, f: 0.3  },
  { id: 2,  name: 'Dal Tadka',            unit: '100g',  cal: 120, p: 7.0, c: 14.0, f: 3.5  },
  { id: 3,  name: 'Roti',                 unit: '1 piece',cal:80,  p: 2.5, c: 15.0, f: 1.2  },
  { id: 4,  name: 'Paneer',               unit: '100g',  cal: 265, p: 18.0,c: 2.0,  f: 21.0 },
  { id: 5,  name: 'Chicken Breast',       unit: '100g',  cal: 165, p: 31.0,c: 0.0,  f: 3.6  },
  { id: 6,  name: 'Egg (whole)',          unit: '1 piece',cal:78,  p: 6.0, c: 0.6,  f: 5.0  },
  { id: 7,  name: 'Banana',              unit: '1 piece',cal:89,  p: 1.1, c: 23.0, f: 0.3  },
  { id: 8,  name: 'Apple',               unit: '1 piece',cal:95,  p: 0.5, c: 25.0, f: 0.3  },
  { id: 9,  name: 'Oats',                unit: '100g',  cal: 389, p: 17.0,c: 66.0, f: 7.0  },
  { id: 10, name: 'Curd / Yogurt',       unit: '100g',  cal: 98,  p: 11.0,c: 3.4,  f: 4.7  },
  { id: 11, name: 'Almonds (10 pcs)',    unit: '10 pcs', cal: 69,  p: 2.5, c: 2.4,  f: 6.0  },
  { id: 12, name: 'Peanut Butter',       unit: '1 tbsp', cal: 94,  p: 4.0, c: 3.1,  f: 8.0  },
  { id: 13, name: 'Chapati',             unit: '1 piece',cal:70,  p: 2.0, c: 13.0, f: 1.0  },
  { id: 14, name: 'Paratha',             unit: '1 piece',cal:200, p: 4.0, c: 28.0, f: 8.0  },
  { id: 15, name: 'Idli',                unit: '1 piece',cal:39,  p: 1.5, c: 7.5,  f: 0.4  },
  { id: 16, name: 'Sambar',              unit: '100ml', cal: 55,  p: 2.5, c: 8.0,  f: 1.5  },
  { id: 17, name: 'Dosa',                unit: '1 piece',cal:133, p: 3.0, c: 22.0, f: 4.0  },
  { id: 18, name: 'Poha',                unit: '100g',  cal: 76,  p: 2.2, c: 16.0, f: 0.7  },
  { id: 19, name: 'Upma',                unit: '100g',  cal: 84,  p: 2.4, c: 14.0, f: 2.0  },
  { id: 20, name: 'Rajma (cooked)',      unit: '100g',  cal: 127, p: 8.7, c: 22.0, f: 0.5  },
  { id: 21, name: 'Chana Masala',        unit: '100g',  cal: 130, p: 7.0, c: 20.0, f: 3.0  },
  { id: 22, name: 'Moong Dal',           unit: '100g',  cal: 105, p: 7.0, c: 18.0, f: 0.4  },
  { id: 23, name: 'Aloo (Potato)',       unit: '100g',  cal: 77,  p: 2.0, c: 17.0, f: 0.1  },
  { id: 24, name: 'Broccoli',            unit: '100g',  cal: 34,  p: 2.8, c: 6.6,  f: 0.4  },
  { id: 25, name: 'Spinach (Palak)',     unit: '100g',  cal: 23,  p: 2.9, c: 3.6,  f: 0.4  },
  { id: 26, name: 'Tomato',              unit: '1 piece',cal:22,  p: 1.1, c: 4.8,  f: 0.2  },
  { id: 27, name: 'Cucumber',            unit: '100g',  cal: 15,  p: 0.7, c: 3.6,  f: 0.1  },
  { id: 28, name: 'Mixed Veg Sabzi',     unit: '100g',  cal: 60,  p: 2.0, c: 8.0,  f: 2.5  },
  { id: 29, name: 'Mango',               unit: '100g',  cal: 60,  p: 0.8, c: 15.0, f: 0.4  },
  { id: 30, name: 'Papaya',              unit: '100g',  cal: 43,  p: 0.5, c: 11.0, f: 0.3  },
  { id: 31, name: 'Grapes',              unit: '100g',  cal: 69,  p: 0.7, c: 18.0, f: 0.2  },
  { id: 32, name: 'Milk',                unit: '200ml', cal: 122, p: 6.3, c: 9.7,  f: 4.7  },
  { id: 33, name: 'Whey Protein',        unit: '1 scoop',cal:120, p: 25.0,c: 3.0,  f: 1.5  },
  { id: 34, name: 'Pav Bhaji',           unit: '1 plate',cal:350, p: 8.0, c: 55.0, f: 10.0 },
  { id: 35, name: 'Chole Bhature',       unit: '1 plate',cal:490, p: 12.0,c: 70.0, f: 18.0 },
  { id: 36, name: 'Biryani (chicken)',   unit: '1 plate',cal:490, p: 22.0,c: 65.0, f: 14.0 },
  { id: 37, name: 'Masala Chai',         unit: '1 cup', cal: 55,  p: 1.5, c: 8.5,  f: 1.5  },
  { id: 38, name: 'Black Coffee',        unit: '1 cup', cal: 5,   p: 0.3, c: 0.0,  f: 0.0  },
  { id: 39, name: 'Orange Juice',        unit: '200ml', cal: 88,  p: 1.4, c: 21.0, f: 0.4  },
  { id: 40, name: 'Coconut Water',       unit: '250ml', cal: 48,  p: 1.8, c: 9.0,  f: 0.5  },
  { id: 41, name: 'Butter',              unit: '1 tsp', cal: 36,  p: 0.0, c: 0.0,  f: 4.1  },
  { id: 42, name: 'Ghee',                unit: '1 tsp', cal: 45,  p: 0.0, c: 0.0,  f: 5.0  },
  { id: 43, name: 'Sweet Lassi',         unit: '1 glass',cal:180, p: 5.0, c: 30.0, f: 4.5  },
  { id: 44, name: 'Paneer Butter Masala',unit: '100g', cal: 180, p: 7.0, c: 8.0,  f: 14.0 },
  { id: 45, name: 'Mutton Curry',        unit: '100g',  cal: 230, p: 20.0,c: 4.0,  f: 15.0 },
  { id: 46, name: 'Fish Curry',          unit: '100g',  cal: 175, p: 18.0,c: 5.0,  f: 9.0  },
  { id: 47, name: 'Bhindi (Okra)',       unit: '100g',  cal: 33,  p: 1.9, c: 7.5,  f: 0.1  },
  { id: 48, name: 'Raita',               unit: '100g',  cal: 60,  p: 3.5, c: 5.0,  f: 2.5  },
  { id: 49, name: 'Watermelon',          unit: '100g',  cal: 30,  p: 0.6, c: 7.6,  f: 0.2  },
  { id: 50, name: 'Peanuts (roasted)',   unit: '30g',   cal: 176, p: 7.5, c: 6.0,  f: 14.0 },
];

const QUICK_ITEMS = [1, 3, 6, 7, 5, 9, 10, 33];

/* ─── Meal definitions ──────────────────────────────────────────────────── */
const MEAL_DEFS = [
  { id: 'breakfast', label: 'Breakfast',     icon: Coffee,   color: '#FFFFFF' },
  { id: 'lunch',     label: 'Lunch',          icon: Sun,      color: '#FFFFFF' },
  { id: 'snack',     label: 'Evening Snack',  icon: Sunset,   color: '#FFFFFF' },
  { id: 'dinner',    label: 'Dinner',          icon: Moon,     color: '#FFFFFF' },
];

/* ─── Demo seed for today ───────────────────────────────────────────────── */
const TODAY_SEED = {
  breakfast: [
    { ...FOOD_DB[8], entryId: 'e1', qty: 1, totalCal: 389, totalP: 17, totalC: 66, totalF: 7 },
    { ...FOOD_DB[9], entryId: 'e2', qty: 1, totalCal: 98,  totalP: 11, totalC: 3.4,totalF: 4.7 },
    { ...FOOD_DB[35],entryId: 'e3', qty: 1, totalCal: 120, totalP: 25, totalC: 3, totalF: 1.5 },
  ],
  lunch: [
    { ...FOOD_DB[0], entryId: 'e4', qty: 2, totalCal: 260, totalP: 5.4,totalC: 56, totalF: 0.6 },
    { ...FOOD_DB[1], entryId: 'e5', qty: 1, totalCal: 120, totalP: 7,  totalC: 14, totalF: 3.5 },
    { ...FOOD_DB[4], entryId: 'e6', qty: 1, totalCal: 165, totalP: 31, totalC: 0,  totalF: 3.6 },
  ],
  snack: [
    { ...FOOD_DB[10],entryId: 'e7', qty: 1, totalCal: 69,  totalP: 2.5,totalC: 2.4,totalF: 6   },
    { ...FOOD_DB[6], entryId: 'e8', qty: 1, totalCal: 89,  totalP: 1.1,totalC: 23, totalF: 0.3 },
  ],
  dinner: [],
};

const WEEKLY = [
  { day: 'Mon', cal: 1850 },
  { day: 'Tue', cal: 2100 },
  { day: 'Wed', cal: 1950 },
  { day: 'Thu', cal: 2050 },
  { day: 'Fri', cal: 2200 },
  { day: 'Sat', cal: 1900 },
  { day: 'Sun', cal: 2000 },
];

const formatDate = (d) =>
  d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

const CALORIE_TARGET = 2200;
const PROTEIN_TARGET = 150;
const CARBS_TARGET   = 250;
const FAT_TARGET     = 65;

function MacroBar({ label, current, target, color = '#FFFFFF', unit = 'g' }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-white">{label}</span>
        <span className="text-xs text-[#A3A3A3]">{Math.round(current)}/{target}{unit}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-[#262626]">
        <div
          className="h-full rounded-full transition-all duration-700 bg-white"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-sm bg-[#262626] border border-[#404040]">
      <p className="text-[#A3A3A3] mb-1">{label}</p>
      <p className="font-bold text-white">{payload[0].value} kcal</p>
    </div>
  );
}

export default function FoodTrackerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState(TODAY_SEED);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [activeMeal, setActiveMeal] = useState('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty]   = useState(1);
  const searchRef = useRef(null);

  const isToday = useMemo(() => {
    const t = new Date();
    return currentDate.toDateString() === t.toDateString();
  }, [currentDate]);

  const totals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0;
    Object.values(meals).forEach((list) =>
      list.forEach((item) => { cal += item.totalCal; p += item.totalP; c += item.totalC; f += item.totalF; })
    );
    return { cal: Math.round(cal), p: Math.round(p * 10) / 10, c: Math.round(c * 10) / 10, f: Math.round(f * 10) / 10 };
  }, [meals]);

  const calPct = Math.round((totals.cal / CALORIE_TARGET) * 100);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return FOOD_DB.filter((f) => QUICK_ITEMS.includes(f.id));
    const q = searchQuery.toLowerCase();
    return FOOD_DB.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 10);
  }, [searchQuery]);

  const shiftDate = (days) =>
    setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() + days); return n; });

  const openPanel = (mealId) => {
    setActiveMeal(mealId);
    setSelectedFood(null);
    setSearchQuery('');
    setQty(1);
    setPanelOpen(true);
    setTimeout(() => searchRef.current?.focus(), 100);
  };

  const addFood = () => {
    if (!selectedFood) return;
    const entry = {
      ...selectedFood,
      entryId: `e_${Date.now()}`,
      qty,
      totalCal: Math.round(selectedFood.cal * qty),
      totalP:   Math.round(selectedFood.p * qty * 10) / 10,
      totalC:   Math.round(selectedFood.c * qty * 10) / 10,
      totalF:   Math.round(selectedFood.f * qty * 10) / 10,
    };
    setMeals((prev) => ({ ...prev, [activeMeal]: [...prev[activeMeal], entry] }));
    setPanelOpen(false);
  };

  const removeFood = (mealId, entryId) =>
    setMeals((prev) => ({ ...prev, [mealId]: prev[mealId].filter((e) => e.entryId !== entryId) }));

  const mealTotals = (list) => ({
    cal: Math.round(list.reduce((s, e) => s + e.totalCal, 0)),
  });

  return (
    <div className="min-h-screen p-6 bg-[#000000] text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <UtensilsCrossed size={26} className="text-white" />
            Food Tracker
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">Log meals and track your nutrition</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-[#171717] border border-[#404040]">
          <button onClick={() => shiftDate(-1)} className="p-1 rounded-lg hover:bg-[#262626] transition-colors">
            <ChevronLeft size={18} className="text-[#A3A3A3]" />
          </button>
          <span className="text-sm font-semibold px-2 min-w-[170px] text-center">
            {isToday ? 'Today — ' : ''}{formatDate(currentDate)}
          </span>
          <button
            onClick={() => shiftDate(1)}
            disabled={isToday}
            className="p-1 rounded-lg hover:bg-[#262626] transition-colors disabled:opacity-30"
          >
            <ChevronRight size={18} className="text-[#A3A3A3]" />
          </button>
        </div>
      </div>

      {/* Nutrition Summary */}
      <div className="rounded-2xl p-6 mb-6 bg-[#171717] border border-[#404040]">
        <h2 className="text-base font-bold mb-5 text-white">Daily Nutrition Summary</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col items-center gap-2">
            <ProgressRing
              percentage={calPct}
              size={140}
              strokeWidth={12}
              value={`${totals.cal}`}
              label={`/ ${CALORIE_TARGET} kcal`}
              color="#FFFFFF"
              trackColor="#262626"
            />
            <div className="text-center">
              <p className="text-xs text-[#A3A3A3]">Remaining</p>
              <p className="font-black text-lg text-white">
                {Math.max(CALORIE_TARGET - totals.cal, 0)} kcal
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-5 w-full">
            <MacroBar label="Protein"       current={totals.p} target={PROTEIN_TARGET} color="#FFFFFF" />
            <MacroBar label="Carbohydrates" current={totals.c} target={CARBS_TARGET}   color="#D4D4D4" />
            <MacroBar label="Fats"          current={totals.f} target={FAT_TARGET}     color="#A3A3A3" />
          </div>

          <div className="flex flex-col gap-3 min-w-[130px]">
            {[
              { label: 'Calories',  val: `${totals.cal}`, unit: 'kcal', Icon: Flame },
              { label: 'Protein',   val: `${totals.p}`,   unit: 'g',    Icon: Beef },
              { label: 'Carbs',     val: `${totals.c}`,   unit: 'g',    Icon: Wheat },
              { label: 'Fats',      val: `${totals.f}`,   unit: 'g',    Icon: Droplets },
            ].map(({ label, val, unit, Icon }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl px-3 py-2 bg-[#262626] border border-[#404040]">
                <Icon size={16} className="text-white" />
                <div>
                  <p className="text-xs text-[#A3A3A3]">{label}</p>
                  <p className="text-sm font-bold text-white">{val}<span className="text-xs text-[#A3A3A3] ml-0.5">{unit}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {MEAL_DEFS.map(({ id, label, icon: MealIcon }) => {
          const list = meals[id] || [];
          const mt = mealTotals(list);
          return (
            <div key={id} className="rounded-2xl overflow-hidden bg-[#171717] border border-[#404040]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#404040]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#262626] border border-[#404040]">
                    <MealIcon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{label}</p>
                    <p className="text-xs text-[#A3A3A3]">{mt.cal} kcal</p>
                  </div>
                </div>
                <button
                  onClick={() => openPanel(id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all bg-[#262626] text-white border border-[#404040] hover:bg-[#333333]"
                >
                  <Plus size={14} /> Add Food
                </button>
              </div>

              <div className="p-2">
                {list.length === 0 ? (
                  <div className="py-6 text-center text-sm text-[#737373]">No items logged yet</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-[#A3A3A3]">
                        <th className="text-left px-3 py-2">Food</th>
                        <th className="text-center px-2 py-2">Cal</th>
                        <th className="text-center px-2 py-2 hidden sm:table-cell">P</th>
                        <th className="text-center px-2 py-2 hidden sm:table-cell">C</th>
                        <th className="text-center px-2 py-2 hidden sm:table-cell">F</th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((item) => (
                        <tr
                          key={item.entryId}
                          className="border-t border-[#404040] hover:bg-[#262626] transition-colors"
                        >
                          <td className="px-3 py-2.5">
                            <p className="font-medium text-white text-xs">{item.name}</p>
                            <p className="text-[#A3A3A3] text-[11px]">
                              {item.qty > 1 ? `${item.qty}×` : ''} {item.unit}
                            </p>
                          </td>
                          <td className="text-center px-2 py-2.5 font-bold text-xs text-white">
                            {item.totalCal}
                          </td>
                          <td className="text-center px-2 py-2.5 text-[#A3A3A3] text-xs hidden sm:table-cell">{item.totalP}g</td>
                          <td className="text-center px-2 py-2.5 text-[#A3A3A3] text-xs hidden sm:table-cell">{item.totalC}g</td>
                          <td className="text-center px-2 py-2.5 text-[#A3A3A3] text-xs hidden sm:table-cell">{item.totalF}g</td>
                          <td className="px-2 py-2.5">
                            <button
                              onClick={() => removeFood(id, item.entryId)}
                              className="p-1.5 rounded-lg hover:bg-[#262626] text-[#A3A3A3] hover:text-white transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Chart */}
      <div className="rounded-2xl p-6 bg-[#171717] border border-[#404040]">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-white" />
          <h2 className="font-bold text-base text-white">Weekly Calorie History</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={WEEKLY} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="day" stroke="#404040" tick={{ fill: '#A3A3A3', fontSize: 12 }} />
            <YAxis stroke="#404040" tick={{ fill: '#A3A3A3', fontSize: 12 }} domain={[1500, 2500]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="cal"
              stroke="#FFFFFF"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#FFFFFF', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#FFFFFF', strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey={() => CALORIE_TARGET}
              stroke="#737373"
              strokeWidth={1}
              strokeDasharray="6 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-[#737373] mt-2 text-center">Dashed line = daily target ({CALORIE_TARGET} kcal)</p>
      </div>

      {/* Search Panel (slide-in overlay) */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />
          <div
            className="relative w-full max-w-md h-full flex flex-col overflow-hidden bg-[#171717] border-l border-[#404040]"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#404040]">
              <div>
                <h3 className="font-bold text-base text-white">Add Food</h3>
                <p className="text-xs text-[#A3A3A3] mt-0.5 capitalize">
                  → {MEAL_DEFS.find((m) => m.id === activeMeal)?.label}
                </p>
              </div>
              <button onClick={() => setPanelOpen(false)} className="p-2 rounded-xl hover:bg-[#262626] transition-colors">
                <X size={20} className="text-[#A3A3A3]" />
              </button>
            </div>

            <div className="p-4 border-b border-[#404040]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSelectedFood(null); }}
                  placeholder="Search foods..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none placeholder-[#737373] text-white bg-[#262626] border border-[#404040] focus:border-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-xs text-[#A3A3A3] mb-3">
                {searchQuery ? `${results.length} results` : 'Quick Add — Popular Items'}
              </p>
              {results.map((food) => (
                <button
                  key={food.id}
                  onClick={() => { setSelectedFood(food); setQty(1); }}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all hover:bg-[#262626] border ${
                    selectedFood?.id === food.id ? 'bg-[#262626] border-white' : 'border-[#404040]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{food.name}</p>
                    <p className="text-xs text-[#A3A3A3] mt-0.5">{food.unit} · P:{food.p}g C:{food.c}g F:{food.f}g</p>
                  </div>
                  <span className="text-sm font-bold ml-3 shrink-0 text-white">{food.cal}<span className="text-xs font-normal text-[#A3A3A3]"> kcal</span></span>
                </button>
              ))}
            </div>

            {selectedFood && (
              <div className="p-4 space-y-4 border-t border-[#404040] bg-[#171717]">
                <div className="rounded-xl p-3 bg-[#262626] border border-[#404040]">
                  <p className="font-bold text-sm mb-1 text-white">{selectedFood.name}</p>
                  <p className="text-xs text-[#A3A3A3]">Per {selectedFood.unit}: {selectedFood.cal} kcal | P:{selectedFood.p}g C:{selectedFood.c}g F:{selectedFood.f}g</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-[#A3A3A3] shrink-0 font-medium">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty((q) => Math.max(0.5, q - 0.5))} className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center bg-[#262626] border border-[#404040] text-white hover:bg-[#333333] transition-colors">−</button>
                    <span className="w-10 text-center font-bold text-lg text-white">{qty}</span>
                    <button onClick={() => setQty((q) => q + 0.5)} className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center bg-[#262626] border border-[#404040] text-white hover:bg-[#333333] transition-colors">+</button>
                  </div>
                  <span className="text-xs text-[#A3A3A3]">× {selectedFood.unit}</span>
                  <span className="ml-auto text-sm font-bold text-white">
                    {Math.round(selectedFood.cal * qty)} kcal
                  </span>
                </div>
                <button
                  onClick={addFood}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all bg-white text-black hover:bg-[#E5E5E5]"
                >
                  Add to {MEAL_DEFS.find((m) => m.id === activeMeal)?.label}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
