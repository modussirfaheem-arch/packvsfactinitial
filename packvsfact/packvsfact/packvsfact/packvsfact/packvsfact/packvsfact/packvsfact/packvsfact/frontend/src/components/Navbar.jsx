import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Search, Camera, Scale, Sparkles, User as UserIcon, LayoutDashboard, Settings, Wifi, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export default function Navbar({ user, onOpenAuth }) {
  const location = useLocation();
  const [online, setOnline] = useState(true);

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
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/scan', label: 'Scan / OCR', icon: Camera },
    { path: '/compare', label: 'Compare', icon: Scale },
    { path: '/alternatives', label: 'Alternatives', icon: Sparkles },
    { path: '/assistant', label: 'AI Assistant', icon: Sparkles },
    { path: '/profile', label: 'Preferences', icon: UserIcon },
    { path: '/admin', label: 'Admin', icon: Settings, adminOnly: true },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-emerald-900/40 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-200 bg-clip-text text-transparent">
                PACKVSFACT
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Know what's inside. Know what's better.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.adminOnly && (!user || user.role !== 'ADMIN')) return null;
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-emerald-300 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Status & Auth */}
          <div className="flex items-center space-x-3">
            {/* Online / Local Mode Badge */}
            <div
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                online
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
              }`}
            >
              <Wifi className="w-3 h-3" />
              <span>{online ? 'ONLINE' : 'LOCAL MODE'}</span>
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300 font-medium hidden lg:inline">{user.full_name || user.email}</span>
                <button
                  onClick={() => api.logout() || window.location.reload()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 shadow-md shadow-emerald-500/20 font-bold transition"
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
