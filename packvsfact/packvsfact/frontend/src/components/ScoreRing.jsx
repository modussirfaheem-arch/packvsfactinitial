import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function ScoreRing({ score = 75, grade = "GOOD" }) {
  // Determine color theme based on score
  let strokeColor = "#22c55e"; // Electric Lime
  let glowClass = "shadow-glow-lime";
  let textColor = "text-electric-lime";
  let bgBadge = "bg-electric-lime/10 text-electric-lime border-electric-lime/30";

  if (score >= 85) {
    strokeColor = "#22c55e";
    glowClass = "shadow-glow-lime";
    textColor = "text-electric-lime";
  } else if (score >= 70) {
    strokeColor = "#10b981";
    glowClass = "shadow-glow-lime";
    textColor = "text-emerald-400";
  } else if (score >= 50) {
    strokeColor = "#f59e0b";
    glowClass = "shadow-glow-amber";
    textColor = "text-amber-400";
    bgBadge = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  } else {
    strokeColor = "#ef4444";
    glowClass = "shadow-glow-amber";
    textColor = "text-red-400";
    bgBadge = "bg-red-500/10 text-red-400 border-red-500/30";
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      {/* SVG Score Ring */}
      <div className={`relative w-48 h-48 flex items-center justify-center rounded-full ${glowClass}`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="text-slate-800/80 stroke-current"
            strokeWidth="14"
            fill="transparent"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke={strokeColor}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
            PACKVSFACT
          </span>
          <div className="flex items-baseline space-x-0.5">
            <span className={`text-5xl font-black tracking-tight ${textColor}`}>
              {score}
            </span>
            <span className="text-lg font-bold text-slate-500">/100</span>
          </div>
          <span className={`mt-1 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold border ${bgBadge}`}>
            {grade}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
        <Info className="w-3.5 h-3.5 text-slate-500" />
        <span>PackVsFact Consumer Awareness Index</span>
      </div>
    </div>
  );
}
