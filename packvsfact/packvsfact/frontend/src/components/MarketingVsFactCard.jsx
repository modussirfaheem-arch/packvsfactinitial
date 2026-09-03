import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, Award, ArrowRight } from 'lucide-react';

export default function MarketingVsFactCard({ claims = [], marketingScore = 60 }) {
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'SUPPORTED':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
          icon: CheckCircle2,
          label: 'SUPPORTED'
        };
      case 'PARTIALLY SUPPORTED':
        return {
          bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
          icon: CheckCircle2,
          label: 'PARTIALLY SUPPORTED'
        };
      case 'NEEDS CONTEXT':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
          icon: AlertTriangle,
          label: 'NEEDS CONTEXT'
        };
      case 'MISLEADING':
        return {
          bg: 'bg-red-500/15 text-red-400 border-red-500/40',
          icon: XCircle,
          label: 'MISLEADING'
        };
      default:
        return {
          bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
          icon: HelpCircle,
          label: 'UNCLEAR'
        };
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-electric-lime/10 text-electric-lime font-mono text-[11px] font-bold border border-electric-lime/30">
              SIGNATURE INNOVATION
            </span>
            <span className="text-xs text-slate-400 font-mono">GROK CLAIM ENGINE</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
            WHAT THE PACK SAYS <span className="text-electric-lime">VS</span> WHAT THE FACTS SHOW
          </h2>
        </div>

        {/* Marketing Reality Badge */}
        <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
          <Award className="w-6 h-6 text-electric-lime" />
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Marketing Reality</div>
            <div className="text-lg font-black text-white font-mono">
              {marketingScore}<span className="text-slate-500 text-sm">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Comparison List */}
      <div className="space-y-4">
        {claims.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            No specific marketing claims extracted from package.
          </div>
        ) : (
          claims.map((claim, idx) => {
            const badge = getBadgeStyle(claim.status);
            const StatusIcon = badge.icon;

            return (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                {/* Front of Pack Claim */}
                <div className="md:col-span-5 flex flex-col justify-center space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    WHAT THE PACK SAYS:
                  </span>
                  <div className="font-extrabold text-base text-white flex items-center space-x-2">
                    <span className="text-electric-lime font-mono">✓</span>
                    <span>"{claim.claim_text}"</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Category: {claim.claim_type}
                  </span>
                </div>

                {/* Divider Arrow */}
                <div className="hidden md:flex md:col-span-1 items-center justify-center text-slate-600">
                  <ArrowRight className="w-5 h-5 text-electric-lime/60" />
                </div>

                {/* Back Label Reality */}
                <div className="md:col-span-6 flex flex-col justify-center space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                      WHAT THE FACTS SHOW:
                    </span>
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.bg}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {claim.reality_explanation}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
