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
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Scale className="w-4 h-4 text-teal-600" />
            <span>Side-by-Side Product Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Compare Food Products Side-by-Side
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Evaluate price, calories, sugar, protein, fibre, saturated fat, sodium, Nutri-Score, and NOVA group across 2 to 5 products.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-white rounded-2xl border border-stone-200"></div>
          </div>
        ) : compareData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Info className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <p className="text-stone-700 font-semibold text-sm">Select at least 2 products to compare.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="p-4 text-stone-500 font-bold uppercase tracking-wider w-44">Attribute</th>
                  {compareData.map((p) => (
                    <th key={p.id} className="p-4 min-w-[200px]">
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-emerald-700 font-bold">{p.brand}</span>
                        <h4 className="font-bold text-sm text-stone-900 line-clamp-2">{p.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-extrabold text-amber-800 text-xs">₹{p.price}</span>
                          {p.highlights.map((h, i) => (
                            <span key={i} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="p-4 font-semibold text-stone-600">Nutri-Score</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 font-black">
                      <span className={`px-2.5 py-1 rounded text-white text-xs ${
                        p.nutri_score_grade === 'A' ? 'bg-emerald-600' :
                        p.nutri_score_grade === 'B' ? 'bg-lime-600' :
                        p.nutri_score_grade === 'C' ? 'bg-amber-500' :
                        p.nutri_score_grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        Grade {p.nutri_score_grade}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-stone-600">NOVA Group</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 font-bold text-stone-900">
                      NOVA {p.nova_group}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-stone-600">PackVsFact Score</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 font-black text-emerald-700 text-sm">
                      {p.insight_score}/100
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-stone-600">Calories (kcal)</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 text-stone-700">{p.nutrition.calories} kcal</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-stone-600">Total Sugar (g)</td>
                  {compareData.map((p) => (
                    <td key={p.id} className={`p-4 font-bold ${p.highlights.includes('Lowest Sugar') ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {p.nutrition.sugar_g}g
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-stone-600">Protein (g)</td>
                  {compareData.map((p) => (
                    <td key={p.id} className={`p-4 font-bold ${p.highlights.includes('Highest Protein') ? 'text-emerald-700' : 'text-stone-700'}`}>
                      {p.nutrition.protein_g}g
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-stone-600">Sodium (mg)</td>
                  {compareData.map((p) => (
                    <td key={p.id} className="p-4 text-stone-700">{p.nutrition.sodium_mg}mg</td>
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
