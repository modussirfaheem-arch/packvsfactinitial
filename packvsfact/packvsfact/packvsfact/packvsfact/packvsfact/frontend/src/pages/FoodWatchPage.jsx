import React, { useEffect, useState } from 'react';
import IndiaFoodMap from '../components/IndiaFoodMap';
import { ShieldAlert, ExternalLink, CheckCircle2, Filter, MapPin } from 'lucide-react';
import api from '../services/api';

export default function FoodWatchPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getFoodWatchAlerts('', selectedCategory, '')
      .then((res) => setAlerts(res))
      .catch((err) => console.error("Alerts load error:", err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-lime/10 border border-electric-lime/40 text-electric-lime text-xs font-mono font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>CIVIC FOOD TRANSPARENCY</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          FOOD WATCH INDIA
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Verified food safety alerts, regulatory notices, and quality recall notifications across Indian states.
        </p>
      </div>

      {/* Interactive India Food Safety Map */}
      <IndiaFoodMap alerts={alerts} />

      {/* Feed Filter & Feed Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-white tracking-tight">
            VERIFIED FOOD WATCH FEED
          </h2>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono outline-none"
            >
              <option value="">All Categories</option>
              <option value="Adulteration">Adulteration</option>
              <option value="Recall">Recall</option>
              <option value="Regulatory Update">Regulatory Update</option>
              <option value="Food Safety">Food Safety</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 font-mono text-xs text-slate-400">
            LOADING FOOD WATCH FEED...
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 font-mono text-xs text-slate-500">
            Live verified Food Watch data will appear once an official source is connected.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {alert.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-electric-lime" />
                      <span>{alert.location}</span>
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    alert.severity === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/30' : alert.severity === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {alert.severity} SEVERITY
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base leading-snug">
                  {alert.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {alert.details}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-electric-lime" />
                    <span>Verified: {alert.source}</span>
                  </div>

                  {alert.source_url && (
                    <a
                      href={alert.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-electric-lime hover:underline flex items-center space-x-1"
                    >
                      <span>Source Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
