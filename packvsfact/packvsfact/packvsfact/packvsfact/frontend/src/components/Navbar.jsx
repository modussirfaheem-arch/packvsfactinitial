import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Camera, Scale, Sparkles, User as UserIcon, LayoutDashboard, Settings, Wifi, ShoppingBag, Smartphone } from 'lucide-react';
import api from '../services/api';

export default function Navbar({ user, onOpenAuth, basketCount = 0, onOpenBasket }) {
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
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/scan', label: 'Scan / OCR', icon: Camera },
    { path: '/compare', label: 'Compare', icon: Scale },
    { path: '/alternatives', label: 'Alternatives', icon: Sparkles },
    { path: '/assistant', label: 'AI Voice Assistant', icon: Sparkles },
    { path: '/profile', label: 'Preferences', icon: UserIcon },
    { path: '/admin', label: 'Admin', icon: Settings, adminOnly: true },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-stone-200/90 text-stone-800 shadow-md shadow-stone-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* New 3D Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-lime-500 to-amber-400 p-0.5 shadow-lg shadow-emerald-600/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <ShieldCheck className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-lime-500 rounded-full border-2 border-white"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-black text-xl tracking-tight text-stone-900">
                  PACK<span className="text-emerald-600">VS</span>FACT
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  3D PWA
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-bold tracking-wider uppercase">
                Know what's inside. Know what's better.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.adminOnly && (!user || user.role !== 'ADMIN')) return null;
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-3">
            {/* Food Basket Button */}
            <button
              onClick={onOpenBasket}
              className="relative p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition shadow-xs flex items-center space-x-1.5"
              title="Daily Snack & Sugar Log"
            >
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-extrabold hidden sm:inline">Basket</span>
              {basketCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {basketCount}
                </span>
              )}
            </button>

            {/* Mobile App Install Button */}
            <button
              onClick={handleInstallPWA}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-extrabold transition shadow-xs"
              title="Install Mobile App PWA"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Get Mobile App</span>
            </button>

            {/* Online Status Badge */}
            <div
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border shadow-xs ${
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
                  className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition hover:scale-105"
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
