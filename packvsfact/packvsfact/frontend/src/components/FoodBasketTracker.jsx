import React from 'react';
import { ShoppingBag, X, Trash2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function FoodBasketTracker({ basket = [], onClose, onRemoveItem, onClearBasket }) {
  const totalCalories = basket.reduce((acc, item) => acc + (item.nutrition?.calories || 0), 0);
  const totalSugar = basket.reduce((acc, item) => acc + (item.nutrition?.sugar_g || 0), 0);
  const totalSodium = basket.reduce((acc, item) => acc + (item.nutrition?.sodium_mg || 0), 0);

  const nova4Count = basket.filter((item) => item.nova_group === 4).length;
  const nova4Percentage = basket.length > 0 ? Math.round((nova4Count / basket.length) * 100) : 0;

  // Daily Recommended Limits (ICMR/FSSAI: Sugar <25g/day, Sodium <2000mg/day)
  const sugarPercentage = Math.min(100, Math.round((totalSugar / 25.0) * 100));
  const sodiumPercentage = Math.min(100, Math.round((totalSodium / 2000.0) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md h-full max-h-[90vh] bg-white border border-stone-200 shadow-2xl rounded-3xl p-6 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-stone-900">Daily Food & Sugar Tracker</h2>
                <p className="text-[10px] text-stone-500 font-bold uppercase">ICMR & FSSAI Intake Monitor</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Daily Meter Gauges */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                <span>Daily Sugar Intake</span>
                <span className={totalSugar > 25 ? 'text-rose-600 font-black' : 'text-amber-800'}>
                  {totalSugar.toFixed(1)}g / 25g limit
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    totalSugar > 25 ? 'bg-rose-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${sugarPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                <span>Daily Sodium Intake</span>
                <span className={totalSodium > 2000 ? 'text-rose-600 font-black' : 'text-amber-800'}>
                  {totalSodium.toFixed(0)}mg / 2000mg limit
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    totalSodium > 2000 ? 'bg-rose-600' : 'bg-teal-600'
                  }`}
                  style={{ width: `${sodiumPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-xs font-bold">
              <span className="text-stone-700">NOVA 4 Ultra-Processed Items</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${nova4Percentage > 50 ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800'}`}>
                {nova4Count} items ({nova4Percentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-2.5 pr-1">
          {basket.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold">Your food basket is empty.</p>
              <p className="text-[10px] text-stone-500 mt-1">Add items from product detail pages to track daily intake.</p>
            </div>
          ) : (
            basket.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-stone-500">₹{item.price} • {item.nutrition?.calories} kcal • Sugar: {item.nutrition?.sugar_g}g</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {basket.length > 0 && (
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={onClearBasket}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Clear All Items
            </button>
            <span className="text-xs font-extrabold text-stone-900">Total Calories: {totalCalories} kcal</span>
          </div>
        )}
      </div>
    </div>
  );
}
