import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, IndianRupee, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import api from '../services/api';

export default function AlternativesPage() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product_id') || '1';
  const initialBudget = searchParams.get('max_budget_inr') || '30';

  const [budget, setBudget] = useState(initialBudget);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlternatives();
  }, [productId]);

  const fetchAlternatives = async () => {
    setLoading(true);
    try {
      const res = await api.getAlternatives(productId, parseFloat(budget) || 100.0);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetFilter = (e) => {
    e.preventDefault();
    fetchAlternatives();
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-lime-50 border border-lime-200 text-lime-800 text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-lime-600" />
            <span>Healthier Alternative Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Healthier & Affordable Alternatives
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Ranked by transparent formula: Nutrient Improvement + Processing Improvement + Price Advantage + Category Similarity.
          </p>
        </div>

        {/* Budget Filter Control */}
        <form onSubmit={handleBudgetFilter} className="mb-8 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center border border-emerald-200">
              <IndianRupee className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Set Maximum Consumer Budget</h3>
              <p className="text-xs text-stone-500">Prioritize healthy alternatives under your specified budget limit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">₹</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-24 bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600 font-bold"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Update Alternatives
            </button>
          </div>
        </form>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-white rounded-2xl border border-stone-200"></div>
          </div>
        ) : !data || data.alternatives.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Info className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <p className="text-stone-700 font-semibold text-sm">No strong alternative found within ₹{budget}.</p>
            <p className="text-stone-500 text-xs mt-1">Try increasing your budget or exploring adjacent food categories.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.alternatives.map((alt) => (
              <div
                key={alt.product_id}
                className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={alt.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                    alt={alt.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700">{alt.brand}</span>
                    <h3 className="text-sm font-bold text-stone-900">{alt.name}</h3>
                    <p className="text-xs text-stone-600 font-semibold mt-0.5">{alt.explanation}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                        alt.nutri_score_grade === 'A' ? 'bg-emerald-600' :
                        alt.nutri_score_grade === 'B' ? 'bg-lime-600' : 'bg-amber-500'
                      }`}>
                        Nutri-Score {alt.nutri_score_grade}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        NOVA Group {alt.nova_group}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        Score: {alt.insight_score}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  <div className="text-left md:text-right">
                    <p className="text-base font-black text-amber-800">₹{alt.price}</p>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {alt.price_difference_inr > 0 ? `₹${alt.price_difference_inr} Cheaper` : 'Great Value'}
                    </span>
                  </div>
                  <Link
                    to={`/product/${alt.product_id}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1"
                  >
                    <span>View Product</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
