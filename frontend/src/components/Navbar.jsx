import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Camera, Scale, Sparkles, User as UserIcon, LayoutDashboard, Settings, Wifi, ShoppingBag, Smartphone, Home, Smile, Sparkle } from 'lucide-react';
import api from '../services/api';

export default function Navbar({ user, onOpenAuth, basketCount = 0, onOpenBasket, isKidsMode = false, onToggleKidsMode }) {
  const location = useLocation();
  const [online, setOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.getHealthStatus();
        setOnline(true);
      } catch (err) {
        setOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => clearInterval(interval);
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    } else {
      alert('PackVsFact is PWA Ready! To install on mobile/desktop, click "Add to Home Screen" in your browser menu.');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Explore Catalog', icon: LayoutDashboard },
    { path: '/scan', label: 'Scan / OCR', icon: Camera },
    { path: '/compare', label: 'Compare', icon: Scale },
    { path: '/alternatives', label: 'Alternatives', icon: Sparkles },
    { path: '/assistant', label: 'AI Assistant', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-stone-200/90 text-stone-800 shadow-sm shadow-stone-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-lime-500 to-amber-400 p-0.5 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg tracking-tight text-stone-900 leading-none">
                  PACK<span className="text-emerald-600">VS</span>FACT
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 leading-none">
                  3D PWA
                </span>
              </div>
              <span className="text-[9px] text-stone-500 font-bold tracking-wider uppercase mt-0.5">
                Food Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {user && user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-100'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* KIDS MODE TOGGLE SWITCH BUTTON */}
            <button
              onClick={onToggleKidsMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition shadow-xs flex items-center space-x-1.5 border ${
                isKidsMode
                  ? 'bg-amber-400 text-stone-900 border-amber-500 shadow-md animate-bounce'
                  : 'bg-gradient-to-r from-sky-50 to-amber-50 text-sky-900 border-sky-200 hover:bg-sky-100'
              }`}
              title="Switch between Adult and Kids Mode"
            >
              <Smile className={`w-4 h-4 ${isKidsMode ? 'text-stone-900' : 'text-amber-500'}`} />
              <span>{isKidsMode ? 'Kids Mode 🎈' : 'Kids Zone 🎈'}</span>
            </button>

            {/* Preferences Link */}
            <Link
              to="/profile"
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-extrabold border border-stone-300 transition"
              title="Dietary Preferences & Allergies"
            >
              <UserIcon className="w-3.5 h-3.5 text-stone-600" />
              <span>Preferences</span>
            </Link>

            {/* Food Basket Button */}
            <button
              onClick={onOpenBasket}
              className="relative p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition shadow-xs flex items-center space-x-1"
              title="Daily Snack & Sugar Log"
            >
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-extrabold hidden sm:inline">Basket</span>
              {basketCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {basketCount}
                </span>
              )}
            </button>

            {/* Mobile App Install Button */}
            <button
              onClick={handleInstallPWA}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-extrabold transition shadow-xs"
              title="Install Mobile App PWA"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>App</span>
            </button>

            {/* Online Status */}
            <div
              className={`hidden sm:flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-extrabold border shadow-xs ${
                online
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <Wifi className="w-3 h-3" />
              <span>{online ? 'ONLINE' : 'LOCAL'}</span>
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-stone-700 font-bold hidden lg:inline">{user.full_name || user.email}</span>
                <button
                  onClick={() => api.logout() || window.location.reload()}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
