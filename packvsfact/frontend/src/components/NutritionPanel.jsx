import React from 'react';
import { PieChart, Flame, Droplet, Wheat, ShieldCheck, HelpCircle } from 'lucide-react';

export default function NutritionPanel({ nutrition }) {
  if (!nutrition) return null;

  const metrics = [
    { label: "Calories", value: `${nutrition.calories || 0} kcal`, pct: minPct(nutrition.calories, 2000), cat: "BASIC" },
    { label: "Total Sugar", value: `${nutrition.sugar_g || 0}g`, pct: minPct(nutrition.sugar_g, 50), cat: (nutrition.sugar_g > 12 ? "ATTENTION" : "GOOD") },
    { label: "Added Sugar", value: `${nutrition.added_sugar_g || 0}g`, pct: minPct(nutrition.added_sugar_g, 25), cat: (nutrition.added_sugar_g > 10 ? "ATTENTION" : "GOOD") },
    { label: "Protein", value: `${nutrition.protein_g || 0}g`, pct: minPct(nutrition.protein_g, 50), cat: (nutrition.protein_g >= 8 ? "GOOD" : "BASIC") },
    { label: "Dietary Fiber", value: `${nutrition.fiber_g || 0}g`, pct: minPct(nutrition.fiber_g, 30), cat: (nutrition.fiber_g >= 3 ? "GOOD" : "BASIC") },
    { label: "Total Fat", value: `${nutrition.fat_g || 0}g`, pct: minPct(nutrition.fat_g, 70), cat: "BASIC" },
    { label: "Saturated Fat", value: `${nutrition.saturated_fat_g || 0}g`, pct: minPct(nutrition.saturated_fat_g, 20), cat: (nutrition.saturated_fat_g > 5 ? "ATTENTION" : "GOOD") },
    { label: "Sodium", value: `${nutrition.sodium_mg || 0} mg`, pct: minPct(nutrition.sodium_mg, 2000), cat: (nutrition.sodium_mg > 400 ? "ATTENTION" : "GOOD") },
  ];

  function minPct(val, ref) {
    if (!val) return 5;
    return Math.min(100, Math.round((val / ref) * 100));
  }

  const getCatBadge = (cat) => {
    if (cat === 'GOOD') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (cat === 'ATTENTION') return 'bg-red-500/10 text-red-400 border-red-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-electric-lime/10 text-electric-lime font-mono text-[11px] font-bold border border-electric-lime/30">
              GROK LABELS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Reference Basis: {nutrition.serving_size || "100g / Serving"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1 flex items-center space-x-2">
            <PieChart className="w-6 h-6 text-electric-lime" />
            <span>NUTRITION FACT ANALYSIS</span>
          </h2>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-medium">{m.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${getCatBadge(m.cat)}`}>
                {m.cat}
              </span>
            </div>

            <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
              {m.value}
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    m.cat === 'ATTENTION' ? 'bg-red-500 shadow-glow-amber' : m.cat === 'GOOD' ? 'bg-electric-lime shadow-glow-lime' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${m.pct}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-right">
                {m.pct}% reference standard
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
