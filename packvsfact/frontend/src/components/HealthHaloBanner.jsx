import React from 'react';
import { AlertOctagon, Info } from 'lucide-react';

export default function HealthHaloBanner({ detected = false, reason = "" }) {
  if (!detected) return null;

  return (
    <div className="w-full rounded-2xl bg-amber-950/40 border border-amber-500/40 p-5 shadow-glow-amber my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start space-x-3.5">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex-shrink-0 mt-0.5 sm:mt-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white text-base tracking-tight">
              HEALTH HALO DETECTED
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              CONSUMER ALERT
            </span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed max-w-3xl">
            {reason || "The front-of-pack messaging heavily emphasizes positive wellness attributes. The complete nutrition panel provides additional context that consumers may want to evaluate."}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 text-[11px] font-mono text-amber-400/80 bg-amber-900/40 px-3 py-1.5 rounded-lg border border-amber-700/50 flex-shrink-0">
        <Info className="w-3.5 h-3.5" />
        <span>Neutral Scientific Analysis</span>
      </div>
    </div>
  );
}
