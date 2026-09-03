import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Smile, Zap, ShieldCheck, Heart, Star, AlertTriangle, ArrowRight, Volume2, Search, Award } from 'lucide-react';
import api from '../services/api';

export default function KidsDashboard({ onSwitchToAdult }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeAvatar, setActiveAvatar] = useState('brocco');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.searchProducts(query);
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

  // Compute Kid-Friendly Stars (5 Stars = Best)
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
    return { title: '⚠️ Ultra-Processed Monster!', color: 'bg-rose-500 text-white', icon: '👾' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-[#faf7f2] to-amber-50 text-stone-900 pb-20 selection:bg-pink-200">
      {/* KIDS MODE 3D HERO BANNER */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-sky-200/80 overflow-hidden">
        <div className="absolute -top-10 left-10 w-72 h-72 bg-yellow-300/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-pink-300/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Kids Mode Pill Header */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border-2 border-sky-300 shadow-lg text-sky-800 text-xs font-black mb-4 hover:scale-105 transition-transform">
            <Smile className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>WELCOME TO PACKVSFACT KIDS ZONE 🎈</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 mb-4">
            Become a <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-500 bg-clip-text text-transparent">Super Food Hero!</span> 🚀
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-stone-700 font-bold mb-8">
            Scan your favorite snacks to defeat the Sugar Monsters 👾 and collect 5-Star Super Hero Snacks! ⭐⭐⭐⭐⭐
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

          {/* Search Bar for Kids */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Type your snack name (e.g. Maggi, Parle-G, Oats, Juices)..."
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

      {/* KIDS PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center space-x-2">
            <span>Choose Your Snack Adventure</span>
            <span className="text-2xl">🍿</span>
          </h2>

          <button
            onClick={onSwitchToAdult}
            className="px-4 py-2 rounded-2xl bg-white border-2 border-stone-300 text-stone-800 text-xs font-black shadow-md hover:bg-stone-100 transition"
          >
            👨‍👩‍👧 Switch to Adult View
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-white rounded-3xl border-2 border-sky-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const stars = getKidStars(p.nutri_score_grade, p.nova_group);
              const badge = getKidBadge(stars, p.nova_group);

              return (
                <div
                  key={p.id}
                  className="rounded-3xl bg-white border-4 border-sky-200 hover:border-emerald-400 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between"
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
                        <span className="text-stone-500 block text-[9px]">Sugar Content</span>
                        <span className={p.nutrition?.sugar_g > 15 ? 'text-rose-600 font-black' : 'text-emerald-700'}>
                          {p.nutrition?.sugar_g || 0}g {p.nutrition?.sugar_g > 15 ? '👿 High Sugar' : '😊 Low Sugar'}
                        </span>
                      </div>

                      <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                        <span className="text-stone-500 block text-[9px]">Energy Level</span>
                        <span className="text-emerald-800 font-black">
                          {p.nutrition?.calories || 0} kcal 🚀
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Kid Action Footer */}
                  <div className="p-4 bg-stone-50 border-t-2 border-stone-100 flex items-center justify-between">
                    <span className="text-sm font-black text-amber-800">₹{p.price}</span>
                    <Link
                      to={`/product/${p.id}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center space-x-1"
                    >
                      <span>Check Magic Lab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
