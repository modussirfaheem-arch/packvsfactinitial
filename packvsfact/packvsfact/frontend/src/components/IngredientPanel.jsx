import React from 'react';
import { Layers, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function IngredientPanel({ ingredients = [] }) {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  const getAttnBadge = (level) => {
    const lvl = (level || 'LOW').toUpperCase();
    if (lvl === 'ATTENTION') {
      return {
        style: 'bg-red-500/10 text-red-400 border-red-500/30',
        label: 'ATTENTION NEEDED'
      };
    }
    if (lvl === 'MODERATE') {
      return {
        style: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        label: 'MODERATE'
      };
    }
    return {
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      label: 'WHOLE / STANDARD'
    };
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-electric-lime/10 text-electric-lime font-mono text-[11px] font-bold border border-electric-lime/30">
              INGREDIENT INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400 font-mono">NON-FEARMONGERING CONTEXT</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1 flex items-center space-x-2">
            <Layers className="w-6 h-6 text-electric-lime" />
            <span>FULL INGREDIENT LIST & ROLES</span>
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Info className="w-4 h-4 text-electric-lime" />
          <span>{ingredients.length} total components</span>
        </div>
      </div>

      {/* Ingredient Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ingredients.map((ing, idx) => {
          const badge = getAttnBadge(ing.attention_level);
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-white text-sm flex items-center space-x-1.5">
                    <span className="font-mono text-electric-lime text-xs">#{idx + 1}</span>
                    <span>{ing.name}</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Role: {ing.role || 'Ingredient'}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${badge.style} flex-shrink-0`}>
                  {badge.label}
                </span>
              </div>

              {ing.context && (
                <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 leading-relaxed font-sans">
                  {ing.context}
                </p>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
