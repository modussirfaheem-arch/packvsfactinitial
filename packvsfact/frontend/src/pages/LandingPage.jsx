import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Camera, Scale, Sparkles, Search, ArrowRight, Zap, Award, CheckCircle2, Globe, ShoppingBag, ChevronRight, Play, Star, Smartphone, Activity, Lock } from 'lucide-react';

export default function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState('nutriscore');

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 overflow-x-hidden selection:bg-emerald-200">
      {/* 3D HERO SECTION */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80 overflow-hidden bg-gradient-to-b from-amber-100/60 via-[#faf7f2] to-[#faf7f2]">
        {/* Floating 3D Ambient Light Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-400/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-amber-400/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-lime-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-left">
              {/* 3D Status Pill */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-white/90 border border-stone-200 shadow-md text-stone-800 text-xs font-extrabold mb-6 backdrop-blur-md hover:scale-105 transition-transform cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>India-First Food Intelligence & Consumer Transparency Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 leading-[1.1] mb-6">
                Uncover what's hidden on the label. <br />
                <span className="bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-600 bg-clip-text text-transparent">
                  Choose healthier, smarter foods.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 font-medium leading-relaxed mb-8 max-w-2xl">
                PACKVSFACT evaluates official EU Nutri-Scores, NOVA ultra-processing levels, ingredient risks, and packaging claim evidence for Indian packaged foods — running 100% locally with zero paid APIs.
              </p>

              {/* Hero Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  to="/dashboard"
                  className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Explore Product Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/scan"
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-extrabold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Scan Label OCR</span>
                </Link>

                <Link
                  to="/assistant"
                  className="px-6 py-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-sm shadow-md transition flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>18-Lang Voice AI</span>
                </Link>
              </div>

              {/* SIH Key Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80">
                <div>
                  <span className="text-2xl font-black text-emerald-700 block">100+</span>
                  <span className="text-xs font-bold text-stone-500">Seeded Indian Items</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-lime-700 block">18</span>
                  <span className="text-xs font-bold text-stone-500">Indian Languages AI</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-amber-700 block">100%</span>
                  <span className="text-xs font-bold text-stone-500">Self-Hosted Offline</span>
                </div>
              </div>
            </div>

            {/* Right 3D Interactive Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-2xl shadow-stone-900/10 hover:shadow-3xl transition-all duration-500 group">
                {/* Header Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200"
                      alt="Maggi Noodles"
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Nestlé</span>
                      <h4 className="text-sm font-black text-stone-900">Maggi Masala Noodles</h4>
                      <p className="text-xs font-bold text-amber-800">₹14 (70g)</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                    VERIFIED
                  </span>
                </div>

                {/* 3D Grade Badges */}
                <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-300/60 shadow-inner">
                    <span className="text-[9px] font-black text-amber-800 uppercase block">Nutri-Score</span>
                    <span className="text-xl font-black px-2.5 py-0.5 rounded-lg bg-amber-500 text-white inline-block mt-1 shadow-sm">C</span>
                    <span className="text-[8px] font-bold text-stone-500 block mt-1">[CALCULATED]</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-300/60 shadow-inner">
                    <span className="text-[9px] font-black text-rose-800 uppercase block">NOVA Group</span>
                    <span className="text-sm font-black text-rose-700 block mt-1">Group 4</span>
                    <span className="text-[8px] font-bold text-stone-500 block mt-1">[ULTRA-PROCESSED]</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-300/60 shadow-inner">
                    <span className="text-[9px] font-black text-emerald-800 uppercase block">Insight Score</span>
                    <span className="text-sm font-black text-emerald-700 block mt-1">62/100</span>
                    <span className="text-[8px] font-bold text-stone-500 block mt-1">[PACKVSFACT]</span>
                  </div>
                </div>

                {/* Interactive Demo Tabs */}
                <div className="mb-4">
                  <div className="flex rounded-xl bg-stone-100 p-1 text-[11px] font-bold text-stone-600">
                    <button
                      onClick={() => setActiveDemoTab('nutriscore')}
                      className={`flex-1 py-1.5 rounded-lg transition ${activeDemoTab === 'nutriscore' ? 'bg-white text-stone-900 shadow-xs' : ''}`}
                    >
                      Nutri-Score
                    </button>
                    <button
                      onClick={() => setActiveDemoTab('nova')}
                      className={`flex-1 py-1.5 rounded-lg transition ${activeDemoTab === 'nova' ? 'bg-white text-stone-900 shadow-xs' : ''}`}
                    >
                      NOVA Model
                    </button>
                    <button
                      onClick={() => setActiveDemoTab('claims')}
                      className={`flex-1 py-1.5 rounded-lg transition ${activeDemoTab === 'claims' ? 'bg-white text-stone-900 shadow-xs' : ''}`}
                    >
                      FSSAI Claims
                    </button>
                  </div>
                </div>

                {/* Tab Dynamic Content */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  {activeDemoTab === 'nutriscore' && (
                    <>
                      <p className="font-bold text-stone-900">Official EU 2024 Nutri-Score Methodology:</p>
                      <p className="text-amber-800 flex items-center space-x-1 font-semibold">
                        <span>- High Sodium (1020mg/100g)</span>
                      </p>
                      <p className="text-emerald-700 flex items-center space-x-1 font-semibold">
                        <span>+ Protein (8g/100g)</span>
                      </p>
                    </>
                  )}
                  {activeDemoTab === 'nova' && (
                    <>
                      <p className="font-bold text-stone-900">RandomForest Additive Classifier Result:</p>
                      <p className="text-rose-700 font-semibold">Detected Industrial Additives: INS 621 MSG, INS 508, INS 451(i), Palmolein Oil.</p>
                    </>
                  )}
                  {activeDemoTab === 'claims' && (
                    <>
                      <p className="font-bold text-stone-900">FSSAI Claim vs Fact Verification:</p>
                      <p className="text-emerald-700 font-bold">"Good Source of Protein" → SUPPORTED BY AVAILABLE DATA</p>
                    </>
                  )}
                </div>

                <Link
                  to="/product/1"
                  className="mt-4 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-1"
                >
                  <span>Interactive Full Product Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D FEATURE SHOWCASE SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Self-Hosted Food Intelligence Engine
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 mt-3">
            Built for Transparency & Accuracy
          </h2>
          <p className="text-sm text-stone-600 font-medium max-w-2xl mx-auto mt-2">
            No fake buttons, no fake AI responses, no paid API keys. Everything runs locally on verified mathematical standards and Scikit-Learn models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-lg shadow-stone-900/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-stone-900 mb-2">Official Nutri-Score Engine</h3>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              Calculates grades A to E based on official EU 2024 standards. Evaluates energy, sugars, saturated fats, sodium, fibre, and protein per 100g.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-lg shadow-stone-900/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-stone-900 mb-2">NOVA Ultra-Processing Model</h3>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              Hybrid rule engine + Scikit-Learn Random Forest Classifier trained on industrial additive markers (INS 621 MSG, INS 319 TBHQ, palmolein oil).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-lg shadow-stone-900/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-200 text-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-stone-900 mb-2">18 Indian Languages Voice AI</h3>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              Conversational food NLP brain with Web Speech API audio synthesis supporting English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, and 11 more.
            </p>
          </div>
        </div>
      </section>

      {/* 3D HOW IT WORKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-[#faf7f2] via-amber-50/40 to-[#faf7f2] rounded-3xl border border-stone-200/80 mb-20 shadow-md">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900">How PackVsFact Works</h2>
          <p className="text-xs text-stone-600 font-bold mt-1">3 Simple Steps to Food Intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md text-center">
            <span className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-base flex items-center justify-center mx-auto mb-4">1</span>
            <h4 className="text-sm font-black text-stone-900 mb-1">Scan or Search Product</h4>
            <p className="text-xs text-stone-600 font-medium">Use local image OCR or enter a real Indian barcode (890...).</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md text-center">
            <span className="w-10 h-10 rounded-full bg-lime-600 text-white font-black text-base flex items-center justify-center mx-auto mb-4">2</span>
            <h4 className="text-sm font-black text-stone-900 mb-1">Algorithmic ML Analysis</h4>
            <p className="text-xs text-stone-600 font-medium">Computes Nutri-Score, NOVA Group 1-4, and FSSAI claim evidence.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md text-center">
            <span className="w-10 h-10 rounded-full bg-amber-600 text-white font-black text-base flex items-center justify-center mx-auto mb-4">3</span>
            <h4 className="text-sm font-black text-stone-900 mb-1">Get Healthier Alternatives</h4>
            <p className="text-xs text-stone-600 font-medium">Find cheaper, better options under your consumer budget limit (≤ ₹30).</p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-lime-600 text-white shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">Ready to know what's inside?</h2>
          <p className="text-xs sm:text-sm font-semibold opacity-90 mb-8 max-w-xl mx-auto">
            Start exploring 100+ real Indian packaged food products with verified ML scores.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white text-emerald-900 font-black text-sm shadow-xl hover:bg-stone-100 hover:scale-105 transition-all"
          >
            <span>Launch Dashboard Now</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </Link>
        </div>
      </section>
    </div>
  );
}
