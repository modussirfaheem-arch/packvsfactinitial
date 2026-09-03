import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Camera, Scale, Sparkles, User as UserIcon, LayoutDashboard, Settings, Wifi } from 'lucide-react';
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-stone-200 text-stone-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-500 p-0.5 shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-emerald-950">
                PACK<span className="text-emerald-600">VS</span>FACT
              </span>
              <p className="text-[10px] text-stone-500 font-medium tracking-wide">
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
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-100'
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
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <Wifi className="w-3 h-3" />
              <span>{online ? 'ONLINE' : 'LOCAL MODE'}</span>
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-stone-700 font-medium hidden lg:inline">{user.full_name || user.email}</span>
                <button
                  onClick={() => api.logout() || window.location.reload()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs font-bold transition"
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
