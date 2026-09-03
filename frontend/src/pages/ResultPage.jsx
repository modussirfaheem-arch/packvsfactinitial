import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScoreRing from '../components/ScoreRing';
import ScoreBreakdown from '../components/ScoreBreakdown';
import MarketingVsFactCard from '../components/MarketingVsFactCard';
import HealthHaloBanner from '../components/HealthHaloBanner';
import NutritionPanel from '../components/NutritionPanel';
import IngredientPanel from '../components/IngredientPanel';
import AlternativesCard from '../components/AlternativesCard';
import { Sparkles, CheckCircle2, AlertTriangle, Scale, ArrowLeft, Share2, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function ResultPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const prodId = id || 1;
        const data = await api.getProductById(prodId);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-electric-lime/10 border border-electric-lime/40 animate-spin mx-auto flex items-center justify-center text-electric-lime shadow-glow-lime">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-mono text-slate-400">LOADING PACKVSFACT ANALYSIS...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Top Navigation & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/scan"
          className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-electric-lime transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SCAN ANOTHER PRODUCT</span>
        </Link>

        <button
          onClick={() => alert("Analysis link copied to clipboard!")}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-electric-lime" />
          <span>Share Analysis</span>
        </button>
      </div>

      {/* Product Summary & Score Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Product Identity & Highlights */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-electric-lime/10 text-electric-lime font-mono text-xs font-bold border border-electric-lime/30">
                {product.category || 'PACKAGED FOOD'}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Size: {product.package_size || '250g'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm font-mono text-electric-lime font-semibold">
              Brand: {product.brand || 'Scanned Brand'}
            </p>
          </div>

          {/* What's Good vs Attention Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* What's Good */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <h4 className="font-extrabold text-emerald-400 text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>WHAT'S GOOD</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-200/90 font-sans">
                {product.positive_attributes?.map((attr, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{attr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Attention Points */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <h4 className="font-extrabold text-amber-400 text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>ATTENTION POINTS</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-200/90 font-sans">
                {product.attention_points?.map((pt, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Compare Action Callout */}
          <div className="pt-2">
            <Link
              to="/compare"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              <Scale className="w-4 h-4 text-electric-lime" />
              <span>Compare with 2-4 Other Products</span>
            </Link>
          </div>
        </div>

        {/* Right Col: Big PackVsFact Score Ring */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-center space-y-4">
          <ScoreRing score={product.score} grade={product.grade} />
          <ScoreBreakdown breakdown={product.score_breakdown} />
        </div>

      </div>

      {/* Health Halo Alert Banner */}
      <HealthHaloBanner
        detected={product.health_halo_detected}
        reason={product.health_halo_reason}
      />

      {/* Signature UI: What the Pack Says vs What the Facts Show */}
      <MarketingVsFactCard
        claims={product.claims}
        marketingScore={product.marketing_reality_score}
      />

      {/* Nutrition Facts Dashboard */}
      <NutritionPanel nutrition={product.nutrition} />

      {/* Ingredient Intelligence List */}
      <IngredientPanel ingredients={product.ingredients} />

      {/* Healthier Alternatives Recommendations */}
      <AlternativesCard alternatives={product.alternatives} />

    </div>
  );
}
