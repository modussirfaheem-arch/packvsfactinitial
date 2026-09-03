import React from 'react';
import { Activity, Flame, ShieldAlert, Award, Layers } from 'lucide-react';

export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const items = [
    { label: "Nutrition Quality", score: breakdown.nutrition_quality, weight: "35%", icon: Activity },
    { label: "Ingredient Profile", score: breakdown.ingredient_profile, weight: "25%", icon: Layers },
    { label: "Marketing Reality", score: breakdown.marketing_reality, weight: "25%", icon: Award },
    { label: "Sugar Impact", score: breakdown.sugar_impact, weight: "Watchpoint", icon: Flame },
    { label: "Sodium Level", score: breakdown.sodium_level, weight: "Watchpoint", icon: ShieldAlert },
  ];

  const getBarColor = (score) => {
    if (score >= 80) return "bg-electric-lime shadow-glow-lime";
    if (score >= 60) return "bg-emerald-400";
    if (score >= 45) return "bg-amber-400";
    return "bg-red-500 shadow-glow-amber";
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Activity className="w-4 h-4 text-electric-lime" />
          <span>Score Breakdown Matrix</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">DETERMINISTIC ENGINE</span>
      </div>

      <div className="space-y-3.5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 font-medium text-slate-200">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-[10px] text-slate-500">{item.weight}</span>
                  <span className="font-bold text-white">{item.score}/100</span>
                </div>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(item.score)}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
