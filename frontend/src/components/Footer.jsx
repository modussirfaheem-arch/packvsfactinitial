import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, ExternalLink, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-dark-bg border-t border-slate-800/80 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-electric-lime/20 border border-electric-lime/40 flex items-center justify-center font-mono font-bold text-electric-lime">
                PVF
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                PACK<span className="text-electric-lime">VS</span>FACT
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Don't Just Read the Pack. Know the Fact.
              AI-powered food intelligence platform designed for India, comparing front-of-pack marketing claims against back-label nutritional facts.
            </p>
            <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-electric-lime" />
                <span>GROK VISION AI ENGINE</span>
              </span>
              <span>•</span>
              <span className="text-cyan-400">SIH 2026 READY</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-semibold">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/scan" className="hover:text-electric-lime transition-colors">AI Label Scanner</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-electric-lime transition-colors">Product Search Database</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-electric-lime transition-colors">Side-by-Side Compare</Link>
              </li>
              <li>
                <Link to="/food-watch" className="hover:text-electric-lime transition-colors">Food Watch India & Map</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-electric-lime transition-colors">SIH Command Center</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Disclaimer */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-semibold">
              Consumer Safety Notice
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Informational Index</span>
              </div>
              <p>
                PackVsFact Score is an independent consumer awareness index. It does not constitute official government rating or medical diagnosis.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <p>© 2026 PACKVSFACT. Built for Smart India Hackathon (SIH).</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1 text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Grok AI Vision Active</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
