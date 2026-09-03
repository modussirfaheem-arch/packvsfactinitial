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
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 pb-16">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-b from-amber-50/60 via-[#faf7f2] to-[#faf7f2] pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>India-First Food Intelligence & Consumer Transparency Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 mb-4">
            Know what's inside. <span className="text-emerald-700">Know what's better.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-600 mb-8 leading-relaxed">
            Analyze Nutri-Score, NOVA processing levels, ingredient risks, allergen alerts, and packaging claim evidence. Discover budget-aware healthier alternatives for Indian food products.
          </p>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto mb-8">
            <Link
              to="/scan"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="text-xs font-bold text-stone-800">Scan Label / OCR</span>
            </Link>

            <button
              onClick={() => document.getElementById('barcode-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-xs font-bold text-stone-800">Enter Barcode</span>
            </button>

            <Link
              to="/compare"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-teal-50/50 border border-stone-200 hover:border-teal-300 shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100/80 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Scale className="w-5 h-5 text-teal-700" />
              </div>
              <span className="text-xs font-bold text-stone-800">Compare Products</span>
            </Link>

            <Link
              to="/assistant"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-cyan-50/50 border border-stone-200 hover:border-cyan-300 shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100/80 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-cyan-700" />
              </div>
              <span className="text-xs font-bold text-stone-800">Local AI Assistant</span>
            </Link>
          </div>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search 100+ Indian foods by name, brand (Maggi, Parle-G, Lay's, Quaker)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl text-sm text-stone-900 outline-none transition placeholder-stone-400 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Barcode Search Box Section */}
        <div id="barcode-section" className="mb-8 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 flex items-center justify-center border border-amber-200">
              <Search className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Barcode Lookup Engine</h3>
              <p className="text-xs text-stone-500">Enter a real Indian food barcode (e.g. 8901058000108)</p>
            </div>
          </div>
          <form onSubmit={handleBarcodeSearch} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g. 8901058000108"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 outline-none focus:border-emerald-600 w-full md:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Lookup
            </button>
          </form>
        </div>

        {/* Barcode Not Found Warning Banner */}
        {barcodeNotice && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">{barcodeNotice.message}</p>
                <p className="text-[11px] text-amber-700/80 mt-1">
                  PackVsFact strictly presents verified or calculated data. We do not invent fake product details when missing.
                </p>
              </div>
            </div>
            <Link
              to="/scan"
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shrink-0 hover:bg-amber-500"
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Budget Quick Filter */}
          <div className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs shadow-xs">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-stone-500">Max Budget:</span>
            <input
              type="number"
              placeholder="e.g. 30"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              className="w-16 bg-stone-50 px-2 py-0.5 rounded border border-stone-300 text-stone-900 outline-none text-xs"
            />
            <button
              onClick={fetchProducts}
              className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[11px] font-bold"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white rounded-2xl border border-stone-200"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-xs">
            <Info className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <p className="text-stone-700 font-semibold text-sm">No products found matching query or price filter.</p>
            <p className="text-stone-500 text-xs mt-1 mb-4">
              {maxPriceFilter ? `Max budget is set to ₹${maxPriceFilter}. Packaged items start at ₹10.` : 'Try searching for another Indian food item.'}
            </p>
            {maxPriceFilter && (
              <button
                onClick={() => { setMaxPriceFilter(''); setSelectedCategory('All Categories'); setQuery(''); setTimeout(fetchProducts, 100); }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition"
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
                className="group rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Header Badge Strip */}
                <div className="p-3.5 flex items-center justify-between border-b border-stone-100 bg-amber-50/30">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
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

                {/* Body Content */}
                <div className="p-4 flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-emerald-700">{p.brand}</p>
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-xs font-extrabold text-amber-700 mt-1">₹{p.price}</p>
                    </div>
                  </div>

                  {/* Nutri-Score & NOVA Indicators */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-center">
                    {/* Nutri-Score */}
                    <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Nutri-Score</p>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <span className={`text-base font-black px-2 py-0.5 rounded text-white ${
                          p.nutri_score_grade === 'A' ? 'bg-emerald-600' :
                          p.nutri_score_grade === 'B' ? 'bg-lime-600' :
                          p.nutri_score_grade === 'C' ? 'bg-amber-500' :
                          p.nutri_score_grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {p.nutri_score_grade}
                        </span>
                      </div>
                      <span className="text-[8px] text-stone-400 font-semibold block mt-1">[CALCULATED]</span>
                    </div>

                    {/* NOVA Group */}
                    <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">NOVA Group</p>
                      <p className={`text-base font-black mt-1 ${
                        p.nova_group === 1 ? 'text-emerald-600' :
                        p.nova_group === 2 ? 'text-lime-600' :
                        p.nova_group === 3 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        Group {p.nova_group}
                      </p>
                      <span className="text-[8px] text-stone-400 font-semibold block mt-1">[MODEL]</span>
                    </div>

                    {/* Insight Score */}
                    <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Score</p>
                      <p className="text-base font-black text-emerald-700 mt-1">{p.insight_score}/100</p>
                      <span className="text-[8px] text-stone-400 font-semibold block mt-1">PackVsFact</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                  <Link
                    to={`/product/${p.id}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                  >
                    <span>Analyze Product</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/alternatives?product_id=${p.id}&max_budget_inr=${p.price}`}
                    className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200"
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
