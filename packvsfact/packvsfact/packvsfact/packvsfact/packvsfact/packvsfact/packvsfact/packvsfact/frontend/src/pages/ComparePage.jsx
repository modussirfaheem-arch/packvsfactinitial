import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Scale, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import api from '../services/api';

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') || '1,2,3';
  const [compareData, setCompareData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, [idsParam]);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await api.compareProducts(idsParam);
      setCompareData(res.comparison || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-2">
            <Scale className="w-4 h-4" />
            <span>Side-by-Side Product Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Compare Food Products Side-by-Side
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluate price, calories, sugar, protein, fibre, saturated fat, sodium, Nutri-Score, and NOVA group across 2 to 5 products.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-slate-900/60 rounded-2xl border border-slate-800"></div>
          </div>
        ) : compareData.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Info className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold text-sm">Select at least 2 products to compare.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  <th className="p-4 text-slate-400 font-bold uppercase tracking-wider w-44">Attribute</th>
                  {compareData.map((p) => (
                    <th key={p.id} className="p-4 min-w-[200px]">
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-emerald-400 font-bold">{p.brand}</span>
                        <h4 className="font-bold text-sm text-slate-100 line-clamp-2">{p.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-extrabold text-lime-400 text-xs">₹{p.price}</span>
                          {p.highlights.map((h, i) => (
                            <span key={i} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Nutri-Score</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 font-black">
                      <span className={`px-2.5 py-1 rounded text-slate-950 text-xs ${
                        p.nutri_score_grade === 'A' ? 'bg-emerald-500' :
                        p.nutri_score_grade === 'B' ? 'bg-lime-400' :
                        p.nutri_score_grade === 'C' ? 'bg-yellow-400' :
                        p.nutri_score_grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        Grade {p.nutri_score_grade}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-400">NOVA Group</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 font-bold text-slate-200">
                      NOVA {p.nova_group}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-400">PackVsFact Score</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 font-black text-emerald-400 text-sm">
                      {p.insight_score}/100
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-400">Calories (kcal)</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 text-slate-300">{p.nutrition.calories} kcal</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-400">Total Sugar (g)</td>
                  {compareData.map((p) => (
                    <td key={p.id} className={`p-4 font-bold ${p.highlights.includes('Lowest Sugar') ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {p.nutrition.sugar_g}g
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-400">Protein (g)</td>
                  {compareData.map((p) => (
                    <td key={p.id} className={`p-4 font-bold ${p.highlights.includes('Highest Protein') ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {p.nutrition.protein_g}g
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-400">Sodium (mg)</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 text-slate-300">{p.nutrition.sodium_mg}mg</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
