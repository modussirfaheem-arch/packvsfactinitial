import React from 'react';
import { Sparkles, ShieldCheck, Cpu, Database, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-lime/10 border border-electric-lime/40 text-electric-lime text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCT VISION & METHODOLOGY</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          ABOUT PACKVSFACT
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          "Don't Just Read the Pack. Know the Fact."
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6 leading-relaxed text-slate-300 text-sm font-sans">
        <h2 className="text-xl font-black text-white">The Core Problem</h2>
        <p>
          In modern food markets across India, junk foods and ultra-processed products are aggressively positioned as healthy choices. Front packaging prominently features wellness buzzwords like "High Protein", "100% Whole Grain", "No Added Sugar", "Vitamin Enriched", and "Fitness Meal". However, consumers rarely have the time or technical expertise to decode complex nutrition panels and additive names printed on the back.
        </p>

        <h2 className="text-xl font-black text-white">Our Solution</h2>
        <p>
          PackVsFact bridges this gap by cross-examining <strong>What the Pack Says</strong> against <strong>What the Facts Show</strong>. Using Grok AI Vision through the backend and a deterministic scoring engine, our system extracts nutrition tables and ingredients to deliver an unbiased, transparent consumer score from 0 to 100.
        </p>
      </div>

      {/* Scoring Methodology Breakdown */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
        <h2 className="text-xl font-black text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-electric-lime" />
          <span>Scoring Methodology (0–100)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-extrabold text-electric-lime">Nutrition Quality (35%)</div>
            <p className="text-slate-400 text-[11px] font-sans">
              Evaluates sugar-to-fiber ratio, protein concentration, saturated fat, and sodium against standard reference guidelines.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-extrabold text-cyan-400">Ingredient Integrity (25%)</div>
            <p className="text-slate-400 text-[11px] font-sans">
              Assesses the ratio of whole food ingredients to ultra-processed additives, artificial sweeteners, and preservatives.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-extrabold text-amber-400">Marketing Reality (25%)</div>
            <p className="text-slate-400 text-[11px] font-sans">
              Measures the alignment ratio between front-of-pack promises and back-label analytical evidence.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="font-extrabold text-emerald-400">Claim Transparency (15%)</div>
            <p className="text-slate-400 text-[11px] font-sans">
              Detects Health Halo loopholes such as claiming 'No Added Sugar' while utilizing high natural fruit juices or maltodextrin.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
