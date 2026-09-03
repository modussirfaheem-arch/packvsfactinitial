import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Scan, Search, ShieldCheck, ArrowRight, Eye, Layers, Award, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 text-center max-w-5xl mx-auto px-4 space-y-8">
        
        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-electric-lime/10 border border-electric-lime/40 text-electric-lime text-xs font-mono font-bold shadow-glow-lime">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED FOOD TRANSPARENCY PLATFORM</span>
        </div>

        {/* Hero Title & Tagline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]">
            PACK<span className="text-electric-lime">VS</span>FACT
          </h1>
          <p className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-electric-lime to-cyan-400 max-w-3xl mx-auto">
            "Don't Just Read the Pack. Know the Fact."
          </p>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Revealing what food packaging promises — and what the label actually tells you using Grok AI Vision, deterministic scoring, and ingredient intelligence.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/scan"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-electric-lime via-emerald-500 to-cyan-500 text-black font-extrabold text-base shadow-glow-lime hover:scale-105 transition-all flex items-center justify-center space-x-3"
          >
            <Scan className="w-5 h-5" />
            <span>SCAN A PRODUCT PACK</span>
          </Link>

          <Link
            to="/search"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 text-slate-200 border border-slate-700 hover:border-electric-lime/50 font-bold text-base transition-all flex items-center justify-center space-x-3"
          >
            <Search className="w-5 h-5 text-electric-lime" />
            <span>SEARCH FOOD DATABASE</span>
          </Link>
        </div>

        {/* Floating Package Visual Concept */}
        <div className="relative pt-12 pb-6 max-w-4xl mx-auto">
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 scanline-effect opacity-20 animate-scan-line pointer-events-none" />

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
              {[
                { step: "01", title: "PACK CLAIMS", desc: "High Protein, Whole Grain" },
                { step: "02", title: "GROK VISION", desc: "Multi-pass OCR parsing" },
                { step: "03", title: "INGREDIENT INTEL", desc: "Role & additive context" },
                { step: "04", title: "NUTRITION FACTS", desc: "Sugar, Sodium, Fiber" },
                { step: "05", title: "PACKVSFACT SCORE", desc: "0-100 Consumer Index" },
                { step: "06", title: "BETTER CHOICE", desc: "Healthier Alternatives" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-electric-lime font-bold">{item.step}</span>
                  <h4 className="font-extrabold text-white text-xs tracking-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-mono leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Signature Section: What the Pack Says vs What the Facts Show */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-slate-800 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-electric-lime/10 text-electric-lime font-mono text-xs font-bold border border-electric-lime/30">
              CORE INNOVATION
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              WHAT THE PACK SAYS <span className="text-electric-lime">VS</span> WHAT THE FACTS SHOW
            </h2>
            <p className="text-sm text-slate-400">
              Ultra-processed food items often use front-of-pack claims to create a "health halo". PackVsFact cross-checks front claims directly against back label nutrition facts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-electric-lime/10 text-electric-lime flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="font-extrabold text-white text-lg">Claim Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grok Vision scans front packaging for health phrases ("High Protein", "No Added Sugar", "Multigrain") and flags marketing rhetoric.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="font-extrabold text-white text-lg">Label Reality Check</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Back-of-pack nutrition tables and ingredient lists are parsed to verify sugar, sodium, fiber, and additive concentrations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="font-extrabold text-white text-lg">Deterministic Score</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A 0–100 PackVsFact Score is generated using objective nutrition guidelines, ingredient roles, and marketing transparency ratios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIH Impact & Public Vision */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
              SMART INDIA HACKATHON (SIH) VISION
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Empowering 1.4 Billion Consumers with Food Truth
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              PackVsFact is designed as an SIH-ready digital public infrastructure prototype. By transforming obscure nutrition panels into clear, explainable intelligence, it encourages healthier dietary choices and greater food brand accountability.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-electric-lime text-black font-extrabold text-sm shadow-glow-lime hover:scale-105 transition-all flex items-center space-x-2"
              >
                <span>Explore SIH Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              System Capabilities Matrix
            </h4>
            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span>AI Vision Engine</span>
                <span className="text-electric-lime font-bold">xAI Grok Vision API</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span>Scoring Logic</span>
                <span className="text-electric-lime font-bold">Deterministic Engine (0-100)</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span>Food Safety Feed</span>
                <span className="text-cyan-400 font-bold">Food Watch India & Map</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span>Comparison Matrix</span>
                <span className="text-electric-lime font-bold">2-4 Product Overlay</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
