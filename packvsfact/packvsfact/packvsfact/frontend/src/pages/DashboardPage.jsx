import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Camera, Scale, Sparkles, Filter, IndianRupee, ShieldCheck, Info, CheckCircle2, AlertTriangle, ArrowRight, Zap, Award, Layers, ChevronRight } from 'lucide-react';
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

  const handleBarcodeSearch = async (e, customCode = null) => {
    if (e) e.preventDefault();
    const targetCode = customCode || barcodeInput.trim();
    if (!targetCode) return;

    try {
      const res = await api.getProductByBarcode(targetCode);
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
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 pb-20 selection:bg-emerald-200">
      {/* 3D Hero Ambient Background & Header */}
      <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-amber-100/50 via-[#faf7f2] to-[#faf7f2] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Decorative 3D Ambient Glowing Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none -translate-y-12"></div>
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Floating 3D Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-stone-200 shadow-md text-emerald-800 text-xs font-bold mb-6 backdrop-blur-md hover:scale-105 transition-transform cursor-pointer">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>India-First Food Intelligence & Consumer Transparency Platform</span>
          </div>

          {/* Main 3D Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 mb-4 leading-tight">
            Know What's Inside. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-700 via-lime-600 to-amber-600 bg-clip-text text-transparent">
              Know What's Better.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-600 mb-10 leading-relaxed font-medium">
            Real Nutri-Score calculation, NOVA ultra-processing classification, 6 Scikit-Learn ML models, ingredient risk analysis, and budget-filtered healthier alternatives across 100+ Indian packaged foods.
          </p>

          {/* 3D Interactive Feature Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            <Link
              to="/scan"
              className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-stone-200/90 shadow-lg shadow-stone-900/5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-500 p-0.5 shadow-md mb-3 group-hover:rotate-6 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Camera className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xs font-extrabold text-stone-900 group-hover:text-emerald-700">Scan Label OCR</h3>
              <p className="text-[10px] text-stone-500 mt-1">Local Image Scanner</p>
            </Link>

            <button
              onClick={() => document.getElementById('barcode-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-stone-200/90 shadow-lg shadow-stone-900/5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md mb-3 group-hover:rotate-6 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Search className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-xs font-extrabold text-stone-900 group-hover:text-amber-700">Enter Barcode</h3>
              <p className="text-[10px] text-stone-500 mt-1">Instant EAN-13 Lookup</p>
            </button>

            <Link
              to="/compare"
              className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-stone-200/90 shadow-lg shadow-stone-900/5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 p-0.5 shadow-md mb-3 group-hover:rotate-6 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Scale className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <h3 className="text-xs font-extrabold text-stone-900 group-hover:text-teal-700">Compare Foods</h3>
              <p className="text-[10px] text-stone-500 mt-1">Side-by-Side Matrix</p>
            </Link>

            <Link
              to="/assistant"
              className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-stone-200/90 shadow-lg shadow-stone-900/5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-md mb-3 group-hover:rotate-6 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xs font-extrabold text-stone-900 group-hover:text-purple-700">18 Lang Voice AI</h3>
              <p className="text-[10px] text-stone-500 mt-1">Offline Local Assistant</p>
            </Link>
          </div>

          {/* 3D Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search 100+ Indian products (Maggi, Parle-G, Lay's, Quaker, Haldiram's)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 rounded-2xl text-sm font-semibold text-stone-900 outline-none transition shadow-lg shadow-stone-900/5 placeholder-stone-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* 3D Metrics Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-white border border-stone-200/90 shadow-xl shadow-stone-900/5 backdrop-blur-md">
          <div className="p-3 text-center border-r border-stone-100 last:border-0">
            <span className="text-2xl font-black text-emerald-700 block">100+</span>
            <span className="text-[11px] font-bold text-stone-500">Real Indian Products</span>
          </div>
          <div className="p-3 text-center border-r border-stone-100 last:border-0">
            <span className="text-2xl font-black text-lime-700 block">99.5%</span>
            <span className="text-[11px] font-bold text-stone-500">NOVA ML Accuracy</span>
          </div>
          <div className="p-3 text-center border-r border-stone-100 last:border-0">
            <span className="text-2xl font-black text-amber-700 block">18</span>
            <span className="text-[11px] font-bold text-stone-500">Indian Languages AI</span>
          </div>
          <div className="p-3 text-center">
            <span className="text-2xl font-black text-cyan-700 block">0</span>
            <span className="text-[11px] font-bold text-stone-500">Paid API Dependencies</span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* 3D Barcode Widget */}
        <div id="barcode-section" className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-white to-emerald-500/10 border border-stone-200 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900">Real Indian EAN-13 Barcode Engine</h3>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                Quick test real Indian barcodes:
                <button onClick={() => handleBarcodeSearch(null, '8901058000108')} className="ml-1.5 font-bold text-emerald-700 underline hover:text-emerald-800">Maggi (8901058000108)</button>,
                <button onClick={() => handleBarcodeSearch(null, '8901030001234')} className="ml-1 font-bold text-amber-700 underline hover:text-amber-800">Parle-G (8901030001234)</button>,
                <button onClick={() => handleBarcodeSearch(null, '8901491101234')} className="ml-1 font-bold text-teal-700 underline hover:text-teal-800">Lay's (8901491101234)</button>
              </p>
            </div>
          </div>

          <form onSubmit={handleBarcodeSearch} className="flex items-center gap-2 w-full lg:w-auto">
            <input
              type="text"
              placeholder="e.g. 8901058000108"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 outline-none focus:border-amber-500 w-full lg:w-64 shadow-inner"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md transition shrink-0"
            >
              Lookup
            </button>
          </form>
        </div>

        {/* Missing Barcode Notice Banner */}
        {barcodeNotice && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start justify-between shadow-xs">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">{barcodeNotice.message}</p>
                <p className="text-[11px] text-amber-800 mt-1">
                  PackVsFact strictly presents verified or calculated data. We do not invent fake product details when missing.
                </p>
              </div>
            </div>
            <Link to="/scan" className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shrink-0 hover:bg-amber-500">
              {barcodeNotice.action}
            </Link>
          </div>
        )}

        {/* Category Pills & Budget Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shadow-xs ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-stone-200 text-xs shadow-xs">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span className="text-stone-600 font-bold">Max Budget:</span>
            <input
              type="number"
              placeholder="e.g. 30"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              className="w-16 bg-stone-50 px-2 py-1 rounded-lg border border-stone-300 text-stone-900 outline-none text-xs font-bold"
            />
            <button
              onClick={fetchProducts}
              className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-extrabold"
            >
              Filter
            </button>
          </div>
        </div>

        {/* 3D Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-3xl border border-stone-200"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-md">
            <Info className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No products found matching query or price filter.</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              {maxPriceFilter ? `Max budget is set to ₹${maxPriceFilter}. Packaged items start at ₹10.` : 'Try searching for another Indian food item.'}
            </p>
            {maxPriceFilter && (
              <button
                onClick={() => { setMaxPriceFilter(''); setSelectedCategory('All Categories'); setQuery(''); setTimeout(fetchProducts, 100); }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition"
              >
                Clear Budget & Search Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="group rounded-3xl bg-white border border-stone-200/90 hover:border-emerald-400 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Header Tag Strip */}
                <div className="p-4 flex items-center justify-between border-b border-stone-100 bg-amber-50/20">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {p.category}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      p.verification_status === 'VERIFIED' || p.verification_status === 'LAB VERIFIED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                  >
                    [{p.verification_status}]
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                      alt={p.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-emerald-700">{p.brand}</span>
                      <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {p.name}
                      </h3>
                      <p className="text-sm font-black text-amber-800 mt-1">₹{p.price}</p>
                    </div>
                  </div>

                  {/* 3D Indicators Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100 text-center">
                    {/* Nutri-Score */}
                    <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200 shadow-inner">
                      <span className="text-[9px] font-extrabold text-stone-500 uppercase tracking-wider block">Nutri-Score</span>
                      <span className={`inline-block text-base font-black px-2.5 py-0.5 rounded-lg text-white mt-1 shadow-xs ${
                        p.nutri_score_grade === 'A' ? 'bg-emerald-600' :
                        p.nutri_score_grade === 'B' ? 'bg-lime-600' :
                        p.nutri_score_grade === 'C' ? 'bg-amber-500' :
                        p.nutri_score_grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        {p.nutri_score_grade}
                      </span>
                      <span className="text-[8px] text-stone-400 font-bold block mt-1">[CALCULATED]</span>
                    </div>

                    {/* NOVA Group */}
                    <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200 shadow-inner">
                      <span className="text-[9px] font-extrabold text-stone-500 uppercase tracking-wider block">NOVA</span>
                      <p className={`text-sm font-black mt-1 ${
                        p.nova_group === 1 ? 'text-emerald-600' :
                        p.nova_group === 2 ? 'text-lime-600' :
                        p.nova_group === 3 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        Group {p.nova_group}
                      </p>
                      <span className="text-[8px] text-stone-400 font-bold block mt-1">[MODEL]</span>
                    </div>

                    {/* Insight Score */}
                    <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200 shadow-inner">
                      <span className="text-[9px] font-extrabold text-stone-500 uppercase tracking-wider block">Score</span>
                      <p className="text-sm font-black text-emerald-700 mt-1">{p.insight_score}/100</p>
                      <span className="text-[8px] text-stone-400 font-bold block mt-1">PackVsFact</span>
                    </div>
                  </div>
                </div>

                {/* Footer 3D Action Bar */}
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                  <Link
                    to={`/product/${p.id}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                  >
                    <span>Analyze Product</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/alternatives?product_id=${p.id}&max_budget_inr=${p.price}`}
                    className="text-[11px] font-extrabold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs transition"
                  >
                    Find Better Option
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
