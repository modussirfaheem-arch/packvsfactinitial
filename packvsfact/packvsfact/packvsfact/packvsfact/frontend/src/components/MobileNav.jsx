import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Camera, Scale, Sparkles, User as UserIcon, ShoppingBag } from 'lucide-react';

export default function MobileNav({ basketCount = 0, onOpenBasket }) {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/scan', label: 'Scan', icon: Camera },
    { path: '/compare', label: 'Compare', icon: Scale },
    { path: '/assistant', label: 'AI Voice', icon: Sparkles },
    { path: '/profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-200 shadow-2xl px-2 py-1.5 flex items-center justify-around">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-emerald-700 font-extrabold scale-110' : 'text-stone-500 font-medium'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{link.label}</span>
          </Link>
        );
      })}
      <button
        onClick={onOpenBasket}
        className="flex flex-col items-center py-1 px-3 text-amber-800 font-bold relative"
      >
        <ShoppingBag className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Basket</span>
        {basketCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
            {basketCount}
          </span>
        )}
      </button>
    </div>
  );
}
