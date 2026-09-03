import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const SCAN_STAGES = [
  "01 — Reading package front & back images",
  "02 — Extracting front marketing claims & brand identity",
  "03 — Grok Vision OCR parsing nutrition facts label",
  "04 — Reading full ingredient list & additives",
  "05 — Evaluating marketing context vs actual facts",
  "06 — Calculating PackVsFact consumer index (0-100)",
  "07 — Detecting Health Halo discrepancies",
  "08 — Compiling healthier category alternatives"
];

export default function ScanProgress({ isScanning, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isScanning) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < SCAN_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isScanning, onComplete]);

  if (!isScanning) return null;

  return (
    <div className="w-full glass-panel rounded-3xl p-8 border border-electric-lime/30 shadow-glow-lime my-8 relative overflow-hidden">
      {/* Animated scanline backdrop */}
      <div className="absolute inset-0 scanline-effect opacity-30 animate-scan-line pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        
        {/* Glowing Engine Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-electric-lime/30 to-cyan-500/30 border border-electric-lime flex items-center justify-center text-electric-lime shadow-glow-lime animate-pulse-slow">
            <Cpu className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-electric-lime text-black flex items-center justify-center font-mono text-[10px] font-bold">
            AI
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
            <span>PACK<span className="text-electric-lime">VS</span>FACT AI</span>
            <Sparkles className="w-5 h-5 text-electric-lime animate-bounce" />
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            GROK VISION ENGINE ANALYZING LABEL DATA
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md bg-slate-900/90 rounded-full h-3 p-0.5 border border-slate-800 relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-electric-lime via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-glow-lime"
            style={{ width: `${((currentStep + 1) / SCAN_STAGES.length) * 100}%` }}
          />
        </div>

        {/* Live Stage List */}
        <div className="w-full max-w-lg space-y-2 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 font-mono text-xs">
          {SCAN_STAGES.map((stage, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 px-3 py-1.5 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-electric-lime/15 text-electric-lime border border-electric-lime/30 font-semibold'
                    : isDone
                    ? 'text-slate-400 opacity-70'
                    : 'text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-electric-lime flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-electric-lime animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                )}
                <span className="truncate">{stage}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
