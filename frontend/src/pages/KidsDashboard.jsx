import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Smile, Zap, ShieldCheck, Heart, Star, AlertTriangle, ArrowRight, Volume2, Search, Award, Gamepad2, CheckCircle2, Trophy, X, Filter } from 'lucide-react';
import api from '../services/api';

const MINI_GAME_FOOD_OPTIONS = [
  { id: 'almonds', name: 'Fresh Raw Almonds', icon: '🥜', healthy: true, desc: 'Gives Super Brain Power!' },
  { id: 'banana', name: 'Whole Yellow Banana', icon: '🍌', healthy: true, desc: 'Natural Fruit Energy!' },
  { id: 'candy', name: 'Fizzy Sugar Candy', icon: '🍬', healthy: false, desc: 'Sugar Spike Monster!' },
  { id: 'oats', name: 'Crunchy Rolled Oats', icon: '🥣', healthy: true, desc: 'High Fibre Defense!' }
];

const KIDS_CATEGORY_TABS = [
  { id: 'all', label: '🍿 All Snacks', icon: '🍿' },
  { id: 'chocolates', label: '🍫 Chocolates & Sweets', icon: '🍫', catFilter: 'Chocolates' },
  { id: 'noodles_crisps', label: '🍜 Noodles & Crisps', icon: '🍜', catFilter: 'Noodles' },
  { id: 'juices_drinks', label: '🥤 Juices & Carbonated', icon: '🥤', catFilter: 'Juices' },
  { id: 'cereals_oats', label: '🥣 Cereals & Oats', icon: '🥣', catFilter: 'Breakfast' },
  { id: 'dairy', label: '🥛 Dairy & Yogurt', icon: '🥛', catFilter: 'Dairy' }
];

export default function KidsDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeAvatar, setActiveAvatar] = useState('brocco');
  const [selectedTab, setSelectedTab] = useState('all');

  // Mini-Game Modal State
  const [gameTargetProduct, setGameTargetProduct] = useState(null);
  const [selectedGameFoods, setSelectedGameFoods] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameError, setGameError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.searchProducts(query, '', null, null, 'KIDS');
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

  // Filter products by selected tab
  const getFilteredProducts = () => {
    if (selectedTab === 'all') return products;
    if (selectedTab === 'chocolates') {
      return products.filter((p) => (p.category || '').toLowerCase().includes('chocolate') || (p.name || '').toLowerCase().includes('chocolate') || (p.name || '').toLowerCase().includes('bar') || (p.name || '').toLowerCase().includes('sweet'));
    }
    if (selectedTab === 'noodles_crisps') {
      return products.filter((p) => (p.category || '').toLowerCase().includes('noodle') || (p.category || '').toLowerCase().includes('chip') || (p.category || '').toLowerCase().includes('namkeen') || (p.category || '').toLowerCase().includes('crisp'));
    }
    if (selectedTab === 'juices_drinks') {
      return products.filter((p) => (p.category || '').toLowerCase().includes('juice') || (p.category || '').toLowerCase().includes('soft drink') || (p.category || '').toLowerCase().includes('beverage') || (p.category || '').toLowerCase().includes('carbonated'));
    }
    if (selectedTab === 'cereals_oats') {
      return products.filter((p) => (p.category || '').toLowerCase().includes('cereal') || (p.category || '').toLowerCase().includes('oat') || (p.category || '').toLowerCase().includes('biscuit'));
    }
    if (selectedTab === 'dairy') {
      return products.filter((p) => (p.category || '').toLowerCase().includes('dairy') || (p.category || '').toLowerCase().includes('milk') || (p.category || '').toLowerCase().includes('yogurt'));
    }
    return products;
  };

  const filteredProducts = getFilteredProducts();

  // Compute Kid-Friendly Stars
  const getKidStars = (nutriScore, novaGroup) => {
    let stars = 5;
    if (nutriScore === 'C') stars -= 1;
    if (nutriScore === 'D') stars -= 2;
    if (nutriScore === 'E') stars -= 3;
    if (novaGroup === 4) stars -= 1;
    return Math.max(1, stars);
  };

  const getKidBadge = (stars, novaGroup) => {
    if (stars >= 4) return { title: '🚀 Super Hero Snack!', color: 'bg-emerald-500 text-white', icon: '⚡' };
    if (stars === 3) return { title: '👍 Tasty & Okay!', color: 'bg-amber-400 text-stone-900', icon: '😋' };
    return { title: '👾 Sugar Monster Alert!', color: 'bg-rose-500 text-white', icon: '👾' };
  };

  // Mini Game Launch Handler
  const handleProductClick = (p, stars) => {
    if (stars <= 2 || p.nova_group === 4) {
      setGameTargetProduct(p);
      setSelectedGameFoods([]);
      setGameWon(false);
      setGameError(false);
    }
  };

  const handleFoodOptionClick = (food) => {
    if (!food.healthy) {
      setGameError(true);
      setTimeout(() => setGameError(false), 2000);
      return;
    }
    const updated = [...selectedGameFoods, food.id];
    setSelectedGameFoods(updated);

    const healthyCount = MINI_GAME_FOOD_OPTIONS.filter((f) => f.healthy).length;
    if (updated.length >= healthyCount) {
      setGameWon(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-[#faf7f2] to-amber-50 text-stone-900 pb-20 selection:bg-pink-200">
      {/* KIDS MODE HERO BANNER */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-sky-200/80 overflow-hidden">
        <div className="absolute -top-10 left-10 w-72 h-72 bg-yellow-300/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-pink-300/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border-2 border-sky-300 shadow-lg text-sky-800 text-xs font-black">
              <Smile className="w-5 h-5 text-amber-500 animate-bounce" />
              <span>WELCOME TO PACKVSFACT KIDS ZONE 🎈</span>
            </div>

            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-2xl bg-white border-2 border-emerald-500 text-emerald-800 hover:bg-emerald-50 text-xs font-black shadow-md transition flex items-center space-x-1.5"
            >
              <span>👨‍👩‍👧 Adult Catalog & Full Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 mb-4">
            Become a <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-500 bg-clip-text text-transparent">Super Food Hero!</span> 🚀
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-stone-700 font-bold mb-8">
            Explore 100+ Indian packaged foods, chocolates, juices, and snacks! Tap any snack with a Sugar Monster 👾 to play the Mini-Game!
          </p>

          {/* 3D Kid Avatar Selector */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveAvatar('brocco')}
              className={`p-4 rounded-3xl border-4 transition-all duration-300 flex items-center space-x-2 ${
                activeAvatar === 'brocco'
                  ? 'bg-emerald-500 text-white border-emerald-300 shadow-xl scale-110'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span className="text-2xl">🥦</span>
              <span className="text-xs font-black">Brocco-Shield</span>
            </button>

            <button
              onClick={() => setActiveAvatar('ninja')}
              className={`p-4 rounded-3xl border-4 transition-all duration-300 flex items-center space-x-2 ${
                activeAvatar === 'ninja'
                  ? 'bg-amber-500 text-white border-amber-300 shadow-xl scale-110'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span className="text-2xl">⚡</span>
              <span className="text-xs font-black">Sugar Ninja</span>
            </button>

            <button
              onClick={() => setActiveAvatar('hero')}
              className={`p-4 rounded-3xl border-4 transition-all duration-300 flex items-center space-x-2 ${
                activeAvatar === 'hero'
                  ? 'bg-sky-500 text-white border-sky-300 shadow-xl scale-110'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span className="text-2xl">🛡️</span>
              <span className="text-xs font-black">Nutri-Hero</span>
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Type any snack, chocolate, juice, or noodle name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-sky-300 focus:border-emerald-500 rounded-2xl text-xs font-black text-stone-900 outline-none shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-black text-xs shadow-lg hover:scale-105 transition-all"
            >
              Find Snack!
            </button>
          </form>
        </div>
      </section>

      {/* CATEGORY FILTER TABS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none">
          {KIDS_CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all shadow-md ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-lime-500 text-white shadow-lg scale-105'
                  : 'bg-white text-stone-700 border-2 border-stone-200 hover:border-emerald-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* SNACKS & PACKAGED FOODS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center space-x-2">
            <span>Kids Super Hero & Monster Snacks ({filteredProducts.length})</span>
            <span className="text-2xl">🍿</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-white rounded-3xl border-2 border-sky-200"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-amber-200 shadow-md">
            <p className="text-lg font-black text-stone-800">No snacks found in this category right now.</p>
            <button
              onClick={() => setSelectedTab('all')}
              className="mt-3 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-md"
            >
              View All Snacks 🍿
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const stars = getKidStars(p.nutri_score_grade, p.nova_group);
              const badge = getKidBadge(stars, p.nova_group);

              return (
                <div
                  key={p.id}
                  onClick={() => handleProductClick(p, stars)}
                  className="rounded-3xl bg-white border-4 border-sky-200 hover:border-emerald-400 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  {/* Badge Header */}
                  <div className={`p-3 text-center font-black text-xs ${badge.color} flex items-center justify-center space-x-2`}>
                    <span className="text-lg">{badge.icon}</span>
                    <span>{badge.title}</span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 text-center">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                      alt={p.name}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-stone-200 mx-auto mb-3 shadow-md"
                    />
                    <span className="text-[10px] font-black text-emerald-700 uppercase">{p.brand}</span>
                    <h3 className="text-sm font-black text-stone-900 line-clamp-2 mt-0.5">{p.name}</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-extrabold border border-stone-200">
                      {p.category}
                    </span>

                    {/* Star Rating Display */}
                    <div className="flex items-center justify-center space-x-1 my-3 bg-amber-50 py-2 rounded-2xl border border-amber-200">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= stars ? 'text-amber-400 fill-amber-400 scale-110' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                      <div className="bg-sky-50 p-2 rounded-xl border border-sky-200">
                        <span className="text-stone-500 block text-[9px]">Nutri-Score</span>
                        <span className="text-emerald-700 font-black">
                          Grade {p.nutri_score_grade}
                        </span>
                      </div>

                      <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                        <span className="text-stone-500 block text-[9px]">NOVA Processing</span>
                        <span className="text-emerald-800 font-black">
                          Group {p.nova_group} 🚀
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Kid Action Footer */}
                  <div className="p-4 bg-stone-50 border-t-2 border-stone-100 flex items-center justify-between">
                    <span className="text-sm font-black text-amber-800">₹{p.price}</span>
                    {stars <= 2 || p.nova_group === 4 ? (
                      <span className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-black text-xs shadow-md animate-pulse flex items-center space-x-1">
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>Defeat Monster Game</span>
                      </span>
                    ) : (
                      <Link
                        to={`/product/${p.id}`}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center space-x-1"
                      >
                        <span>Analyze Product</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D INTERACTIVE MINI-GAME MODAL */}
      {gameTargetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white border-4 border-amber-300 shadow-2xl relative text-center">
            <button
              onClick={() => setGameTargetProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!gameWon ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg animate-bounce">
                  👾
                </div>
                <h3 className="text-xl font-black text-stone-900">
                  Sugar Monster Alert!
                </h3>
                <p className="text-xs font-bold text-stone-600 mt-1 mb-4">
                  "{gameTargetProduct.name}" has ultra-processed additives! Pick all 3 Healthy Hero Foods below to defeat the monster!
                </p>

                {gameError && (
                  <div className="mb-4 p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black animate-shake">
                    ⚠️ Oops! That's a Sugar Candy Monster! Pick a Healthy Hero Food!
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {MINI_GAME_FOOD_OPTIONS.map((food) => {
                    const isSelected = selectedGameFoods.includes(food.id);
                    return (
                      <button
                        key={food.id}
                        onClick={() => handleFoodOptionClick(food)}
                        disabled={isSelected}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md'
                            : 'bg-stone-50 hover:bg-emerald-50 border-stone-200 hover:border-emerald-400 text-stone-800'
                        }`}
                      >
                        <span className="text-3xl block mb-1">{food.icon}</span>
                        <span className="text-xs font-black block">{food.name}</span>
                        <span className="text-[9px] font-bold block opacity-80 mt-0.5">{food.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-4 animate-scaleUp">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-900 flex items-center justify-center text-5xl mx-auto mb-4 shadow-xl animate-bounce">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-emerald-700 mb-1">
                  VICTORY! SUGAR MONSTER DEFEATED! 🎉
                </h3>
                <p className="text-xs font-bold text-stone-700 mb-6">
                  You picked healthy hero foods and earned the <span className="font-black text-amber-800">Food Defender Badge 🏆</span>!
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    to={`/alternatives?product_id=${gameTargetProduct.id}&max_budget_inr=${gameTargetProduct.price || 50}`}
                    onClick={() => setGameTargetProduct(null)}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition"
                  >
                    🚀 Discover Healthy Hero Alternatives Now!
                  </Link>
                  <button
                    onClick={() => setGameTargetProduct(null)}
                    className="w-full py-2.5 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
