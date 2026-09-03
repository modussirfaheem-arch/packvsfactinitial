import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparePage from './pages/ComparePage';
import AlternativesPage from './pages/AlternativesPage';
import AssistantPage from './pages/AssistantPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import api from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authRole, setAuthRole] = useState('USER');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const curr = api.getCurrentUser();
    if (curr) setUser(curr);
  }, []);

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
      setAuthError(err.response?.data?.detail || 'Authentication failed.');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        <Navbar user={user} onOpenAuth={() => setShowAuthModal(true)} />

        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/alternatives" element={<AlternativesPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>

              <h2 className="text-xl font-extrabold text-slate-100 mb-1">
                {isLoginView ? 'Sign In to PackVsFact' : 'Create PackVsFact Account'}
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Access personalized dietary filtering and product verification features.
              </p>

              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {!isLoginView && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="user@packvsfact.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                {!isLoginView && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Account Role</label>
                    <select
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                    >
                      <option value="USER">Consumer / User</option>
                      <option value="ADMIN">Senior Admin Auditor</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition"
                >
                  {isLoginView ? 'Sign In' : 'Register Account'}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                <button
                  onClick={() => setIsLoginView(!isLoginView)}
                  className="text-xs text-slate-400 hover:text-emerald-400 font-semibold"
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
