import React, { useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function UploadCard({ label, subtitle, imageFile, imagePreview, onUpload, onRemove, side }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file, side);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUpload(file, side);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative rounded-2xl glass-panel p-6 border-2 border-dashed transition-all ${
        imagePreview
          ? 'border-electric-lime/60 bg-dark-card/90 shadow-glow-lime'
          : 'border-slate-700/80 hover:border-electric-lime/40 bg-dark-card/50'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {imagePreview ? (
        <div className="relative group rounded-xl overflow-hidden aspect-video bg-black/60 flex items-center justify-center">
          <img
            src={imagePreview}
            alt={`${label} Preview`}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Replace
            </button>
            <button
              onClick={() => onRemove(side)}
              className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-electric-lime/90 text-black text-[10px] font-mono font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{side.toUpperCase()} READY</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-electric-lime/10 border border-electric-lime/30 flex items-center justify-center text-electric-lime shadow-glow-lime mb-1">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide">{label}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">{subtitle}</p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-electric-lime/15 text-electric-lime border border-electric-lime/40 text-xs font-semibold hover:bg-electric-lime/25 transition-all"
            >
              Choose File
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors flex items-center space-x-1"
              title="Camera Capture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] font-mono text-slate-500 pt-1">
            JPG, PNG, WEBP supported
          </p>
        </div>
      )}
    </div>
  );
}
