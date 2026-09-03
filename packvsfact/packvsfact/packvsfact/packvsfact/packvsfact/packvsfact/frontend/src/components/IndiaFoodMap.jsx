import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ShieldAlert, Filter, CheckCircle2 } from 'lucide-react';

// Custom marker pin icons
const createCustomIcon = (severity) => {
  let color = '#22c55e';
  if (severity === 'HIGH') color = '#ef4444';
  if (severity === 'MEDIUM') color = '#f59e0b';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid #070a12;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; background-color: #ffffff; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const CITY_COORDINATES = {
  Mumbai: [19.0760, 72.8777],
  Pune: [18.5204, 73.8567],
  Delhi: [28.6139, 77.2090],
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
  Kolkata: [22.5726, 88.3639],
  Chennai: [13.0827, 80.2707],
  Lucknow: [26.8467, 80.9462],
  Jaipur: [26.9124, 75.7873],
  Ahmedabad: [23.0225, 72.5714]
};

export default function IndiaFoodMap({ alerts = [] }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
      
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-electric-lime/10 text-electric-lime font-mono text-[11px] font-bold border border-electric-lime/30">
              NATIONAL SURVEILLANCE
            </span>
            <span className="text-xs text-slate-400 font-mono">LIVE FSSAI & STATE ALERTS</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-electric-lime" />
            <span>INDIA FOOD SAFETY MAP</span>
          </h2>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-electric-lime text-black shadow-glow-lime'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {filteredAlerts.map((alert) => {
            const coords = CITY_COORDINATES[alert.location] || [20.5937, 78.9629];
            const icon = createCustomIcon(alert.severity);

            return (
              <Marker key={alert.id} position={coords} icon={icon}>
                <Popup className="custom-map-popup">
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans max-w-xs space-y-2">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-white text-xs tracking-tight">
                        {alert.location} — {alert.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        alert.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : alert.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs leading-snug">
                      {alert.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {alert.details}
                    </p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Source: {alert.source}</span>
                      <span>{alert.alert_date}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
}
