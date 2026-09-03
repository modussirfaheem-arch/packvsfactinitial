import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Camera, Scale, Sparkles, Filter, IndianRupee, ShieldCheck, Info, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = [
  'All Categories', 'Instant Noodles', 'Biscuits & Cookies', 'Chips & Crisps',
  'Namkeen & Savouries', 'Breakfast Cereals & Oats', 'Soft Drinks & Carbonated',
  'Fruit Juices & Beverages', 'Chocolates & Confectionery', 'Dairy Products', 'Protein Supplements'
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeNotice, setBarcodeNotice] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const cat = selectedCategory === 'All Categories' ? '' : selectedCategory;
      const res = await api.searchProducts(query, cat, null, maxPriceFilter ? parseFloat(maxPriceFilter) : null);
      setProducts(res.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleBarcodeSearch = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    try {
      const res = await api.getProductByBarcode(barcodeInput.trim());
      if (res.found) {
        navigate(`/product/${res.product_id}`);
      } else {
        setBarcodeNotice(res);
      }
    } catch (err) {
      setBarcodeNotice({
        found: false,
        message: 'Product not available in the current verified dataset.',
        action: 'Submit product for verification'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-emerald-900/30 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>India-First Food Intelligence & Consumer Transparency Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-lime-300 to-teal-200 bg-clip-text text-transparent mb-4">
            Know what's inside. Know what's better.
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-8">
            Analyze Nutri-Score, NOVA processing levels, ingredient risks, allergen alerts, and packaging claim evidence. Discover budget-aware healthier alternatives for Indian food products.
          </p>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
            <Link
              to="/scan"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/80 hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-slate-200">Scan Label / OCR</span>
            </Link>

            <button
              onClick={() => document.getElementById('barcode-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/80 hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-lime-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5 text-lime-400" />
              </div>
              <span className="text-xs font-bold text-slate-200">Enter Barcode</span>
            </button>

            <Link
              to="/compare"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/80 hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Scale className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-xs font-bold text-slate-200">Compare Products</span>
            </Link>

            <Link
              to="/assistant"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/80 hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs font-bold text-slate-200">Local AI Assistant</span>
            </Link>
          </div>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search food by name, brand (e.g. Maggi, Parle-G, Lay's, Quaker)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm text-slate-100 outline-none transition placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Barcode Search Box Section */}
        <div id="barcode-section" className="mb-8 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center border border-lime-500/30">
              <Search className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Barcode Lookup Engine</h3>
              <p className="text-xs text-slate-400">Enter an Indian food barcode number (e.g. 8901058000108)</p>
            </div>
          </div>
          <form onSubmit={handleBarcodeSearch} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g. 8901058000108"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 outline-none focus:border-lime-500 w-full md:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs transition"
            >
              Lookup
            </button>
          </form>
        </div>

        {/* Barcode Not Found Warning Banner */}
        {barcodeNotice && (
          <div className="mb-8 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">{barcodeNotice.message}</p>
                <p className="text-[11px] text-amber-300/80 mt-1">
                  PackVsFact strictly presents verified or calculated data. We do not invent fake product details when missing.
                </p>
              </div>
            </div>
            <Link
              to="/scan"
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shrink-0 hover:bg-amber-400"
            >
              {barcodeNotice.action}
            </Link>
          </div>
        )}

        {/* Category & Budget Filters */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Budget Quick Filter */}
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <IndianRupee className="w-3.5 h-3.5 text-lime-400" />
            <span className="text-slate-400">Max Budget:</span>
            <input
              type="number"
              placeholder="e.g. 30"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              className="w-16 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-200 outline-none text-xs"
            />
            <button
              onClick={fetchProducts}
              className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-bold"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-900/60 rounded-2xl border border-slate-800"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Info className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold text-sm">No products found matching query.</p>
            <p className="text-slate-500 text-xs mt-1">Try clearing filters or search for another Indian food item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-md"
              >
                {/* Header Badge Strip */}
                <div className="p-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {p.category}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      p.verification_status === 'LAB VERIFIED'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : p.verification_status === 'VERIFIED'
                        ? 'bg-lime-950/60 text-lime-300 border-lime-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {p.verification_status}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-emerald-400">{p.brand}</p>
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-xs font-extrabold text-lime-400 mt-1">₹{p.price}</p>
                    </div>
                  </div>

                  {/* Nutri-Score & NOVA Indicators */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-center">
                    {/* Nutri-Score */}
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Nutri-Score</p>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <span className={`text-base font-black px-2 py-0.5 rounded text-slate-950 ${
                          p.nutri_score_grade === 'A' ? 'bg-emerald-500' :
                          p.nutri_score_grade === 'B' ? 'bg-lime-400' :
                          p.nutri_score_grade === 'C' ? 'bg-yellow-400' :
                          p.nutri_score_grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {p.nutri_score_grade}
                        </span>
                      </div>
                      <span className="text-[8px] text-slate-500 font-semibold block mt-1">[CALCULATED]</span>
                    </div>

                    {/* NOVA Group */}
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">NOVA Group</p>
                      <p className={`text-base font-black mt-1 ${
                        p.nova_group === 1 ? 'text-emerald-400' :
                        p.nova_group === 2 ? 'text-lime-400' :
                        p.nova_group === 3 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        Group {p.nova_group}
                      </p>
                      <span className="text-[8px] text-slate-500 font-semibold block mt-1">[MODEL]</span>
                    </div>

                    {/* Insight Score */}
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Score</p>
                      <p className="text-base font-black text-emerald-400 mt-1">{p.insight_score}/100</p>
                      <span className="text-[8px] text-slate-500 font-semibold block mt-1">PackVsFact</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    to={`/product/${p.id}`}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <span>Analyze Product</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/alternatives?product_id=${p.id}&max_budget_inr=${p.price}`}
                    className="text-[11px] font-semibold text-lime-400 hover:text-lime-300 bg-lime-950/40 px-2.5 py-1 rounded-lg border border-lime-500/30"
                  >
                    Find Cheaper & Better
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
