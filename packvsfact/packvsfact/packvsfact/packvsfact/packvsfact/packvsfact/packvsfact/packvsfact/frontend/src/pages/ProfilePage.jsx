import React, { useState } from 'react';
import { User as UserIcon, ShieldCheck, Download, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function ProfilePage() {
  const currentUser = api.getCurrentUser() || { email: 'user@packvsfact.in', full_name: 'Rahul Sharma', role: 'USER' };

  const [dietaryPref, setDietaryPref] = useState('LOW_SUGAR');
  const [maxBudget, setMaxBudget] = useState('30');
  const [allergies, setAllergies] = useState(['Peanuts', 'Milk']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleAllergy = (allergen) => {
    setAllergies((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = async () => {
    try {
      const data = await api.exportUserData(currentUser.id || 1);
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `packvsfact_export_user_${currentUser.id || 1}.json`;
      a.click();
    } catch (err) {
      alert('Data export error.');
    }
  };

  const handleDeleteData = async () => {
    if (window.confirm('Are you sure you want to permanently delete your scan history and account preferences?')) {
      try {
        await api.deleteUserData(currentUser.id || 1);
        alert('Your data has been permanently deleted.');
        api.logout();
        window.location.href = '/';
      } catch (err) {
        alert('Delete data error.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <UserIcon className="w-4 h-4" />
            <span>User Profile & Health Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Personal Health & Privacy Controls
          </h1>
        </div>

        {/* User Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">{currentUser.full_name}</h3>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              Role: {currentUser.role}
            </span>
          </div>
        </div>

        {/* Preferences Form */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Nutritional Goal & Budget Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Primary Nutritional Priority</label>
              <select
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="LOW_SUGAR">Low Sugar Focus</option>
                <option value="LOW_SODIUM">Low Sodium Focus</option>
                <option value="HIGH_PROTEIN">High Protein Focus</option>
                <option value="HIGH_FIBRE">High Fibre Focus</option>
                <option value="VEGETARIAN">100% Vegetarian</option>
                <option value="VEGAN">Vegan</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Max Budget Filter (₹ INR)</label>
              <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-bold"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-400 block mb-2">Allergy Sensitivity Warning List</label>
            <div className="flex flex-wrap gap-2">
              {['Peanuts', 'Milk', 'Soy', 'Gluten', 'Tree Nuts', 'Egg', 'Sesame', 'Mustard'].map((allergen) => {
                const active = allergies.includes(allergen);
                return (
                  <button
                    key={allergen}
                    onClick={() => toggleAllergy(allergen)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      active
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    {allergen}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSavePreferences}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition"
            >
              Save Preferences
            </button>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences Saved!</span>
              </span>
            )}
          </div>
        </div>

        {/* Non-Medical Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs mb-8 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5">Responsible Health Communication Disclaimer</p>
            <p className="text-[11px] text-amber-300/80">
              PackVsFact acts as a nutritional filtering aid to inform your consumer choices. It does not diagnose, treat, or prevent medical conditions. Consult a registered dietitian or healthcare professional for clinical advice.
            </p>
          </div>
        </div>

        {/* Privacy Data Controls */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Data Privacy & Sovereignty Rights</h3>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleExportData}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export My Data (JSON)</span>
            </button>

            <button
              onClick={handleDeleteData}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs border border-rose-500/40 transition flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Permanently Delete My Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
