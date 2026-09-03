import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Sparkles, ArrowRight, AlertCircle, Scan } from 'lucide-react';
import api from '../services/api';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minScore, setMinScore] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "All Categories",
    "Breakfast Cereals",
    "Biscuits & Cookies",
    "Instant Foods",
    "Beverages",
    "Dairy Products"
  ];

  const fetchResults = async () => {
    setLoading(true);
    try {
      const cat = selectedCategory === "All Categories" ? "" : selectedCategory;
      const minS = minScore ? parseInt(minScore) : null;
      const res = await api.searchProducts(searchTerm, cat, minS);
      setProducts(res);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchTerm, selectedCategory, minScore]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-lime/10 border border-electric-lime/40 text-electric-lime text-xs font-mono font-bold">
          <Search className="w-3.5 h-3.5" />
          <span>FOOD INTELLIGENCE DATABASE</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
          SEARCH PACKAGED FOODS
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Search indexed Indian packaged food products to view PackVsFact scores and marketing claims.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by product name, brand, or claim (e.g. Maggi, Oreo, Muesli)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-electric-lime outline-none transition-colors"
            />
          </div>

          {/* Category Select */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 focus:border-electric-lime outline-none transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Min Score Select */}
          <div className="md:col-span-3">
            <select
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 focus:border-electric-lime outline-none transition-colors"
            >
              <option value="">Any Score</option>
              <option value="80">Score 80+ (Excellent)</option>
              <option value="60">Score 60+ (Good)</option>
              <option value="40">Score 40+ (Moderate)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 font-mono text-xs">
          SEARCHING PRODUCT DATABASE...
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Product Not Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              This product is not yet in our pre-indexed database. Upload the package label to analyze it with Grok Vision!
            </p>
          </div>
          <Link
            to="/scan"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-electric-lime text-black font-extrabold text-xs shadow-glow-lime hover:scale-105 transition-all"
          >
            <Scan className="w-4 h-4" />
            <span>UPLOAD & SCAN PACKAGE</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/results/${p.id}`}
              className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-electric-lime/50 transition-all flex flex-col justify-between space-y-4 glass-panel-hover group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {p.category || 'Packaged Food'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                    p.score >= 80 ? 'bg-electric-lime/10 text-electric-lime border-electric-lime/30' : p.score >= 60 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    Score {p.score}/100
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-lg group-hover:text-electric-lime transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">Brand: {p.brand}</p>

                {p.health_halo_detected && (
                  <div className="px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] font-mono flex items-center space-x-1">
                    <span>⚠ Health Halo Detected</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-electric-lime">
                <span>View Full Analysis</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
