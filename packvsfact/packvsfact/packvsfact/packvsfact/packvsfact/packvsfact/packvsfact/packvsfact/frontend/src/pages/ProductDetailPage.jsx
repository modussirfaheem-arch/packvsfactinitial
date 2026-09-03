import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, Scale, Sparkles, ArrowLeft, IndianRupee, FileText } from 'lucide-react';
import api from '../services/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await api.getProductDetail(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-300">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The requested product ID could not be loaded.</p>
        <Link to="/" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { scores, nutrition, claims_analysis } = product;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        {/* Product Overview Header */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start space-x-4">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'}
              alt={product.name}
              className="w-24 h-24 rounded-2xl object-cover border border-slate-800 shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-bold text-emerald-400">{product.brand}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-semibold text-slate-400">{product.category}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-black text-lime-400">₹{product.price}</span>
                <span className="text-xs text-slate-400 font-medium">({product.serving_size})</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                  [{product.verification_status}]
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to={`/alternatives?product_id=${product.id}&max_budget_inr=${product.price}`}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 text-center hover:from-emerald-400 hover:to-lime-400 transition"
            >
              Find Healthier Alternatives
            </Link>
            <Link
              to={`/compare?ids=${product.id}`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs text-center border border-slate-700 transition"
            >
              Add to Comparison
            </Link>
          </div>
        </div>

        {/* 3 Core Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Official Nutri-Score */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nutri-Score</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  [CALCULATED]
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <span className={`text-4xl font-black px-4 py-2 rounded-xl text-slate-950 ${
                  scores.nutri_score.grade === 'A' ? 'bg-emerald-500' :
                  scores.nutri_score.grade === 'B' ? 'bg-lime-400' :
                  scores.nutri_score.grade === 'C' ? 'bg-yellow-400' :
                  scores.nutri_score.grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                }`}>
                  {scores.nutri_score.grade}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-200">Score: {scores.nutri_score.score}</p>
                  <p className="text-[10px] text-slate-400">{scores.nutri_score.methodology}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {scores.nutri_score.explanation.positive.map((p, idx) => (
                  <p key={idx} className="text-emerald-400 flex items-start space-x-1.5">
                    <span>+</span>
                    <span>{p}</span>
                  </p>
                ))}
                {scores.nutri_score.explanation.negative.map((n, idx) => (
                  <p key={idx} className="text-amber-400 flex items-start space-x-1.5">
                    <span>-</span>
                    <span>{n}</span>
                  </p>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-semibold mt-4 pt-2 border-t border-slate-800/80">
              Calculated using official Nutri-Score methodology
            </p>
          </div>

          {/* Card 2: NOVA Model */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">NOVA Classification</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-950 text-lime-400 border border-lime-500/30">
                  [MODEL PREDICTION]
                </span>
              </div>

              <div className="mb-4">
                <p className={`text-2xl font-black ${
                  scores.nova_model.nova === 1 ? 'text-emerald-400' :
                  scores.nova_model.nova === 2 ? 'text-lime-400' :
                  scores.nova_model.nova === 3 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  NOVA Group {scores.nova_model.nova}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  Confidence: {int(scores.nova_model.confidence * 100)}%
                </p>
              </div>

              <p className="text-xs text-slate-300 mb-3">{scores.nova_model.explanation}</p>

              <div className="space-y-1 text-[11px] text-slate-400">
                {scores.nova_model.evidence.map((ev, idx) => (
                  <p key={idx} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0"></span>
                    <span>{ev}</span>
                  </p>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-semibold mt-4 pt-2 border-t border-slate-800/80">
              RandomForest + Additive Rules Engine
            </p>
          </div>

          {/* Card 3: PackVsFact Score */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PackVsFact Insight Score</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-500/30">
                  [COMPOSITE]
                </span>
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-4xl font-black text-emerald-400">{scores.packvsfact_insight_score}</span>
                <span className="text-slate-500 text-sm font-bold">/ 100</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Nutrient Quality</span>
                    <span>{int(max(10, min(100, 100 - (nutrition.sugar_g * 1.5) - (nutrition.sodium_mg / 20))))}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${int(max(10, min(100, 100 - (nutrition.sugar_g * 1.5) - (nutrition.sodium_mg / 20))))}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Minimal Processing</span>
                    <span>{scores.nova_model.nova === 1 ? 100 : scores.nova_model.nova === 2 ? 80 : scores.nova_model.nova === 3 ? 55 : 30}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-lime-400 h-full rounded-full" style={{ width: `${scores.nova_model.nova === 1 ? 100 : scores.nova_model.nova === 2 ? 80 : scores.nova_model.nova === 3 ? 55 : 30}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-semibold mt-4 pt-2 border-t border-slate-800/80">
              Transparent multi-attribute ranking formula
            </p>
          </div>
        </div>

        {/* Claim vs Fact Verification Panel */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Packaging Claim vs Fact Analysis</span>
          </h3>

          <div className="space-y-3">
            {claims_analysis.map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-200 mb-1">"{c.claim}"</p>
                  <p className="text-xs text-slate-400">{c.explanation}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border shrink-0 ${
                    c.status === 'SUPPORTED BY AVAILABLE DATA'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      : c.status === 'NEEDS VERIFICATION'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition & Ingredients Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Nutrition Table */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 mb-4">Nutritional Facts (Per 100g)</h3>
            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Energy / Calories</span>
                <span className="font-bold text-slate-200">{nutrition.calories} kcal</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Total Sugars</span>
                <span className="font-bold text-amber-400">{nutrition.sugar_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Added Sugars</span>
                <span className="font-bold text-amber-400">{nutrition.added_sugar_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Protein</span>
                <span className="font-bold text-emerald-400">{nutrition.protein_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Dietary Fibre</span>
                <span className="font-bold text-emerald-400">{nutrition.fibre_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Saturated Fat</span>
                <span className="font-bold text-slate-200">{nutrition.saturated_fat_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Sodium</span>
                <span className="font-bold text-amber-400">{nutrition.sodium_mg}mg</span>
              </div>
            </div>
          </div>

          {/* Ingredients Statement */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 mb-4">Ingredients Statement</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-4">
                {product.ingredients_text}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px] flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>This is a nutritional filtering aid, not medical advice. Verify package labels if you have severe allergies.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function max(a, b) { return a > b ? a : b; }
function min(a, b) { return a < b ? a : b; }
function int(val) { return Math.round(val); }
