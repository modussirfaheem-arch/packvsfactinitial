import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AlternativesCard({ alternatives = [] }) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-electric-lime/10 text-electric-lime font-mono text-[11px] font-bold border border-electric-lime/30">
              SMART RECOMMENDATIONS
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-electric-lime" />
            <span>HEALTHIER CATEGORY ALTERNATIVES</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alternatives.map((alt) => (
          <div
            key={alt.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-electric-lime/40 transition-all flex flex-col justify-between space-y-4 glass-panel-hover"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {alt.category || 'Category Alternative'}
                </span>
                <div className="flex items-center space-x-1 bg-electric-lime/15 text-electric-lime px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border border-electric-lime/30">
                  <span>Score {alt.score}</span>
                </div>
              </div>

              <h4 className="font-extrabold text-white text-base leading-tight">
                {alt.name}
              </h4>
              <p className="text-xs text-slate-400 font-mono">{alt.brand}</p>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 font-sans leading-relaxed">
                {alt.why_better}
              </p>
            </div>

            <Link
              to={`/results/${alt.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-electric-lime hover:text-black text-slate-200 font-semibold text-xs transition-all flex items-center justify-center space-x-2"
            >
              <span>View Full Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
