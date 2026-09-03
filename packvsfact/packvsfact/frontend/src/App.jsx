import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import FoodBasketTracker from './components/FoodBasketTracker';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import KidsDashboard from './pages/KidsDashboard';
import ScanPage from './pages/ScanPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparePage from './pages/ComparePage';
import AlternativesPage from './pages/AlternativesPage';
import AssistantPage from './pages/AssistantPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import api from './services/api';
import { ShieldCheck, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authRole, setAuthRole] = useState('USER');
  const [authError, setAuthError] = useState('');

  // Food Basket State
  const [basket, setBasket] = useState([]);
  const [showBasket, setShowBasket] = useState(false);

  // Kids Mode State
  const [isKidsMode, setIsKidsMode] = useState(false);

  useEffect(() => {
    const curr = api.getCurrentUser();
    if (curr) setUser(curr);

    const saved = localStorage.getItem('pvf_basket');
    if (saved) {
      try { setBasket(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleAddToBasket = (product) => {
    const updated = [...basket, product];
    setBasket(updated);
    localStorage.setItem('pvf_basket', JSON.stringify(updated));
    setShowBasket(true);
  };

  const handleRemoveFromBasket = (index) => {
    const updated = basket.filter((_, i) => i !== index);
    setBasket(updated);
    localStorage.setItem('pvf_basket', JSON.stringify(updated));
  };

  const handleClearBasket = () => {
    setBasket([]);
    localStorage.removeItem('pvf_basket');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLoginView) {
        const res = await api.login(authEmail, authPassword);
        setUser(res.user);
      } else {
        const res = await api.register(authEmail, authFullName, authPassword, authRole);
        setUser(res.user);
      }
      setShowAuthModal(false);
    } catch (err) {
      setAuthError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'ADMIN') {
      setAuthEmail('admin@packvsfact.in');
      setAuthPassword('Admin@123456');
    } else {
      setAuthEmail('user@packvsfact.in');
      setAuthPassword('User@123456');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-16 md:pb-0">
        <Navbar
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          basketCount={basket.length}
          onOpenBasket={() => setShowBasket(true)}
          isKidsMode={isKidsMode}
          onToggleKidsMode={() => setIsKidsMode(!isKidsMode)}
        />

        <main>
          {isKidsMode ? (
            <KidsDashboard onSwitchToAdult={() => setIsKidsMode(false)} />
          ) : (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/kids" element={<KidsDashboard onSwitchToAdult={() => setIsKidsMode(false)} />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/product/:id" element={<ProductDetailPage onAddToBasket={handleAddToBasket} />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/alternatives" element={<AlternativesPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          )}
        </main>

        {/* Mobile Navigation Bar */}
        <MobileNav basketCount={basket.length} onOpenBasket={() => setShowBasket(true)} />

        {/* Food Basket Drawer */}
        {showBasket && (
          <FoodBasketTracker
            basket={basket}
            onClose={() => setShowBasket(false)}
            onRemoveItem={handleRemoveFromBasket}
            onClearBasket={handleClearBasket}
          />
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-stone-200 shadow-2xl relative">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2.5 mb-1">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-500 flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-extrabold text-stone-900">
                  {isLoginView ? 'Sign In to PackVsFact' : 'Create Account'}
                </h2>
              </div>
              <p className="text-xs text-stone-500 mb-5">
                Access personalized dietary filtering, product comparison, and verification governance features.
              </p>

              {/* Quick Demo Login Preset Buttons */}
              <div className="mb-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
                <span className="text-[11px] font-extrabold text-amber-900 block mb-1.5">Quick Demo Fill Credentials:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('USER')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 font-extrabold text-[11px] shadow-xs"
                  >
                    Consumer User
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('ADMIN')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 font-extrabold text-[11px] shadow-xs"
                  >
                    Senior Admin
                  </button>
                </div>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {!isLoginView && (
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="user@packvsfact.in"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                  />
                </div>

                {!isLoginView && (
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">Account Role</label>
                    <select
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                    >
                      <option value="USER">Consumer / User</option>
                      <option value="ADMIN">Senior Admin Auditor</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition"
                >
                  {isLoginView ? 'Sign In' : 'Register Account'}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-stone-100 text-center">
                <button
                  onClick={() => setIsLoginView(!isLoginView)}
                  className="text-xs text-stone-500 hover:text-emerald-700 font-bold"
                >
                  {isLoginView ? "Don't have an account? Register" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}
