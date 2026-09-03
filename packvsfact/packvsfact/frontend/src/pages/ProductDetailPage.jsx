import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, Scale, Sparkles, ArrowLeft, Volume2, VolumeX, ShoppingBag, Printer, Award, Activity, Heart, Flame } from 'lucide-react';
import api from '../services/api';

export default function ProductDetailPage({ onAddToBasket }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [userAllergies, setUserAllergies] = useState(['Peanuts', 'Milk', 'Soy', 'Gluten']);
  const [detectedAllergens, setDetectedAllergens] = useState([]);
  const [fssaiCompliance, setFssaiCompliance] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await api.getProductDetail(id);
        setProduct(data);

        // Feature 1: Check Allergens
        const ingredientsLower = (data.ingredients_text || '').toLowerCase();
        const found = [];
        if (ingredientsLower.includes('peanut') || ingredientsLower.includes('groundnut')) found.push('Peanuts');
        if (ingredientsLower.includes('milk') || ingredientsLower.includes('butter') || ingredientsLower.includes('ghee') || ingredientsLower.includes('curd')) found.push('Milk Solids');
        if (ingredientsLower.includes('wheat') || ingredientsLower.includes('gluten') || ingredientsLower.includes('maida')) found.push('Wheat / Gluten');
        if (ingredientsLower.includes('soy') || ingredientsLower.includes('lecithin')) found.push('Soy');
        if (ingredientsLower.includes('almond') || ingredientsLower.includes('cashew') || ingredientsLower.includes('pistachio')) found.push('Tree Nuts');
        if (ingredientsLower.includes('sesame')) found.push('Sesame');
        setDetectedAllergens(found);

        // Feature 2: FSSAI Compliance Assessment
        const nut = data.nutrition;
        const checks = [
          { name: 'Added Sugar (< 10g/100g)', pass: nut.added_sugar_g <= 10.0, value: `${nut.added_sugar_g}g` },
          { name: 'Sodium Limit (< 500mg/100g)', pass: nut.sodium_mg <= 500.0, value: `${nut.sodium_mg}mg` },
          { name: 'Saturated Fat Limit (< 5g/100g)', pass: nut.saturated_fat_g <= 5.0, value: `${nut.saturated_fat_g}g` },
          { name: 'Trans Fat Free Standard (0g)', pass: (nut.trans_fat_g || 0.0) <= 0.2, value: `${nut.trans_fat_g || 0}g` }
        ];
        setFssaiCompliance(checks);

      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [id]);

  const handleSpeakSummary = () => {
    if (!product || !window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const textToSpeak = `${product.name} by ${product.brand}. Price: ${product.price} Rupees. Nutri-Score Grade: ${product.scores.nutri_score.grade}. NOVA Group: ${product.scores.nova_model.nova}. PackVsFact Score: ${product.scores.packvsfact_insight_score} out of 100. ${product.scores.nova_model.explanation}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center text-stone-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center p-6 text-center text-stone-700">
        <AlertTriangle className="w-12 h-12 text-amber-600 mb-3" />
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <p className="text-xs text-stone-500 mt-1 mb-6">The requested product ID could not be loaded.</p>
        <Link to="/" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { scores, nutrition, claims_analysis } = product;

  // Macro calculation percentages
  const totalMacros = (nutrition.protein_g * 4) + (nutrition.sugar_g * 4) + (nutrition.total_fat_g * 9);
  const proteinPct = totalMacros > 0 ? Math.round(((nutrition.protein_g * 4) / totalMacros) * 100) : 15;
  const carbPct = totalMacros > 0 ? Math.round(((nutrition.sugar_g * 4) / totalMacros) * 100) : 50;
  const fatPct = Math.max(5, 100 - proteinPct - carbPct);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto print:max-w-none print:p-0">
        {/* Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-stone-600 hover:text-emerald-700 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>

          <div className="flex items-center space-x-3">
            {/* Feature 5: Print Certificate */}
            <button
              onClick={handlePrintCertificate}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>Print Safety Pass</span>
            </button>

            {/* Feature 3: Add to Food Basket */}
            <button
              onClick={() => onAddToBasket && onAddToBasket(product)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span>Add to Daily Basket</span>
            </button>

            {/* AI Voice Speaker */}
            <button
              onClick={handleSpeakSummary}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 border shadow-xs ${
                speaking
                  ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              {speaking ? <VolumeX className="w-4 h-4 text-amber-700" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              <span>{speaking ? 'Stop AI Audio' : 'Listen AI Voice'}</span>
            </button>
          </div>
        </div>

        {/* FEATURE 1: ALLERGEN WARNING BANNER */}
        {detectedAllergens.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 shadow-md flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-extrabold text-rose-950 uppercase tracking-wider">
                ⚠️ ALLERGY SENSITIVITY ALERT DETECTED
              </h3>
              <p className="text-xs text-rose-900 mt-1">
                Ingredients contain active allergen markers: <span className="font-black text-rose-950">{detectedAllergens.join(', ')}</span>. Exercise caution if you have severe dietary sensitivities.
              </p>
            </div>
          </div>
        )}

        {/* Product Overview Header */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md mb-8 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start space-x-4">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'}
              alt={product.name}
              className="w-24 h-24 rounded-2xl object-cover border border-stone-200 shrink-0 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-bold text-emerald-700">{product.brand}</span>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-semibold text-stone-500">{product.category}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-black text-amber-800">₹{product.price}</span>
                <span className="text-xs text-stone-500 font-medium">({product.serving_size})</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-stone-100 text-stone-700 border border-stone-200">
                  [{product.verification_status}]
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto print:hidden">
            <Link
              to={`/alternatives?product_id=${product.id}&max_budget_inr=${product.price}`}
              className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-500 transition text-center"
            >
              Find Healthier Alternatives
            </Link>
            <Link
              to={`/compare?ids=${product.id}`}
              className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 transition text-center"
            >
              Add to Comparison
            </Link>
          </div>
        </div>

        {/* 3 Core Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Official Nutri-Score */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nutri-Score</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  [CALCULATED]
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <span className={`text-4xl font-black px-4 py-2 rounded-2xl text-white shadow-md ${
                  scores.nutri_score.grade === 'A' ? 'bg-emerald-600' :
                  scores.nutri_score.grade === 'B' ? 'bg-lime-600' :
                  scores.nutri_score.grade === 'C' ? 'bg-amber-500' :
                  scores.nutri_score.grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                }`}>
                  {scores.nutri_score.grade}
                </span>
                <div>
                  <p className="text-xs font-bold text-stone-800">Score: {scores.nutri_score.score}</p>
                  <p className="text-[10px] text-stone-500">{scores.nutri_score.methodology}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {scores.nutri_score.explanation.positive.map((p, idx) => (
                  <p key={idx} className="text-emerald-700 flex items-start space-x-1.5 font-medium">
                    <span>+</span>
                    <span>{p}</span>
                  </p>
                ))}
                {scores.nutri_score.explanation.negative.map((n, idx) => (
                  <p key={idx} className="text-amber-800 flex items-start space-x-1.5 font-medium">
                    <span>-</span>
                    <span>{n}</span>
                  </p>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-stone-400 font-bold mt-4 pt-2 border-t border-stone-100">
              Official EU 2024 Nutri-Score Update Engine
            </p>
          </div>

          {/* Card 2: NOVA Model */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">NOVA Group</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-50 text-lime-800 border border-lime-200">
                  [MODEL]
                </span>
              </div>

              <div className="mb-4">
                <p className={`text-2xl font-black ${
                  scores.nova_model.nova === 1 ? 'text-emerald-700' :
                  scores.nova_model.nova === 2 ? 'text-lime-700' :
                  scores.nova_model.nova === 3 ? 'text-amber-700' : 'text-rose-600'
                }`}>
                  NOVA Group {scores.nova_model.nova}
                </p>
                <p className="text-[11px] text-stone-500 font-bold mt-1">
                  Confidence: {Math.round(scores.nova_model.confidence * 100)}%
                </p>
              </div>

              <p className="text-xs text-stone-700 mb-3 leading-relaxed font-medium">{scores.nova_model.explanation}</p>

              <div className="space-y-1 text-[11px] text-stone-600">
                {scores.nova_model.evidence.map((ev, idx) => (
                  <p key={idx} className="flex items-center space-x-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0"></span>
                    <span>{ev}</span>
                  </p>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-stone-400 font-bold mt-4 pt-2 border-t border-stone-100">
              Scikit-Learn RandomForest Additive Classifier
            </p>
          </div>

          {/* Card 3: FEATURE 4 - MACRONUTRIENT & QUALITY VISUALIZER */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Macro & Quality Spectrum</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  [VISUALIZER]
                </span>
              </div>

              {/* Macro Energy Distribution Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] font-bold text-stone-700 mb-1">
                  <span>Macro Energy Split</span>
                  <span>{nutrition.calories} kcal</span>
                </div>
                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                  <div className="bg-emerald-600 h-full" style={{ width: `${proteinPct}%` }} title={`Protein ${proteinPct}%`}></div>
                  <div className="bg-amber-500 h-full" style={{ width: `${carbPct}%` }} title={`Carbs/Sugar ${carbPct}%`}></div>
                  <div className="bg-rose-500 h-full" style={{ width: `${fatPct}%` }} title={`Fats ${fatPct}%`}></div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-extrabold mt-1 text-stone-500">
                  <span className="text-emerald-700">Protein {proteinPct}%</span>
                  <span className="text-amber-700">Carbs {carbPct}%</span>
                  <span className="text-rose-700">Fats {fatPct}%</span>
                </div>
              </div>

              {/* Quality Score Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-stone-700 mb-1">
                  <span>PackVsFact Insight Score</span>
                  <span className="text-emerald-700 font-black">{scores.packvsfact_insight_score}/100</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-lime-500 to-emerald-600 h-full rounded-full" style={{ width: `${scores.packvsfact_insight_score}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-stone-400 font-bold mt-4 pt-2 border-t border-stone-100">
              Interactive Energy & Nutrient Distribution
            </p>
          </div>
        </div>

        {/* FEATURE 2: FSSAI REGULATORY COMPLIANCE PANEL */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md mb-8">
          <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>FSSAI & ICMR Regulatory Compliance Inspector</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {fssaiCompliance.map((chk, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                  chk.pass
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/50 border-amber-200 text-amber-950'
                }`}
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-70">
                    {chk.pass ? 'PASSED STANDARD' : 'EXCEEDS LIMIT'}
                  </span>
                  <p className="text-xs font-bold mt-1">{chk.name}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-200/50">
                  <span className="text-xs font-black">{chk.value}</span>
                  {chk.pass ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packaging Claim vs Fact Verification Panel */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md mb-8">
          <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Packaging Claim vs Fact Analysis</span>
          </h3>

          <div className="space-y-3">
            {claims_analysis.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between">
                <div>
                  <p className="text-xs font-extrabold text-stone-900 mb-1">"{c.claim}"</p>
                  <p className="text-xs text-stone-600 font-medium">{c.explanation}</p>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full border shrink-0 ${
                    c.status === 'SUPPORTED BY AVAILABLE DATA'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : c.status === 'NEEDS VERIFICATION'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
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
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md">
            <h3 className="text-sm font-bold text-stone-900 mb-4">Nutritional Facts (Per 100g)</h3>
            <div className="divide-y divide-stone-100 text-xs">
              <div className="py-2.5 flex justify-between font-bold">
                <span className="text-stone-600">Energy / Calories</span>
                <span className="text-stone-900">{nutrition.calories} kcal</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold">
                <span className="text-stone-600">Total Sugars</span>
                <span className="text-amber-800">{nutrition.sugar_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold">
                <span className="text-stone-600">Added Sugars</span>
                <span className="text-amber-800">{nutrition.added_sugar_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold">
                <span className="text-stone-600">Protein</span>
                <span className="text-emerald-700">{nutrition.protein_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold">
                <span className="text-stone-600">Dietary Fibre</span>
                <span className="text-emerald-700">{nutrition.fibre_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold">
                <span className="text-stone-600">Saturated Fat</span>
                <span className="text-stone-900">{nutrition.saturated_fat_g}g</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold">
                <span className="text-stone-600">Sodium</span>
                <span className="text-amber-800">{nutrition.sodium_mg}mg</span>
              </div>
            </div>
          </div>

          {/* Ingredients Statement */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-4">Ingredients Statement</h3>
              <p className="text-xs text-stone-700 leading-relaxed font-medium bg-stone-50 p-4 rounded-2xl border border-stone-200 mb-4">
                {product.ingredients_text}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>This is a nutritional filtering aid, not medical advice. Verify package labels if you have severe allergies.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
