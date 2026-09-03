import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, AlertCircle, Edit3, ArrowRight, FileText } from 'lucide-react';
import api from '../services/api';

export default function ScanPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ocrData, setOcrData] = useState(null);

  const [productName, setProductName] = useState('Scanned Packaged Food');
  const [brandName, setBrandName] = useState('Generic Brand');
  const [categoryName, setCategoryName] = useState('General Food');
  const [priceInr, setPriceInr] = useState('30');
  const [calories, setCalories] = useState('420');
  const [sugarG, setSugarG] = useState('12.5');
  const [proteinG, setProteinG] = useState('6.0');
  const [fibreG, setFibreG] = useState('2.5');
  const [satFatG, setSatFatG] = useState('7.0');
  const [sodiumMg, setSodiumMg] = useState('650');
  const [ingredientsText, setIngredientsText] = useState('Refined wheat flour, Palm oil, Sugar, Salt, INS 330, INS 621 MSG.');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAndRunOcr = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const res = await api.scanLabelImage(selectedFile);
      setOcrData(res.ocr_result);
      if (res.ocr_result && res.ocr_result.extracted_nutrition) {
        const ext = res.ocr_result.extracted_nutrition;
        if (ext.calories) setCalories(ext.calories.toString());
        if (ext.sugar_g) setSugarG(ext.sugar_g.toString());
        if (ext.protein_g) setProteinG(ext.protein_g.toString());
        if (ext.fibre_g) setFibreG(ext.fibre_g.toString());
        if (ext.saturated_fat_g) setSatFatG(ext.saturated_fat_g.toString());
        if (ext.sodium_mg) setSodiumMg(ext.sodium_mg.toString());
      }
      if (res.ocr_result && res.ocr_result.ingredients_text) {
        setIngredientsText(res.ocr_result.ingredients_text);
      }
    } catch (err) {
      alert('OCR Failed. You can still manually enter the label values below.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitConfirmedData = async () => {
    try {
      const payload = {
        name: productName,
        brand: brandName,
        category: categoryName,
        price: parseFloat(priceInr) || 30.0,
        serving_size: '100g',
        ingredients_text: ingredientsText,
        calories: parseFloat(calories) || 0.0,
        sugar_g: parseFloat(sugarG) || 0.0,
        saturated_fat_g: parseFloat(satFatG) || 0.0,
        sodium_mg: parseFloat(sodiumMg) || 0.0,
        fibre_g: parseFloat(fibreG) || 0.0,
        protein_g: parseFloat(proteinG) || 0.0
      };

      const res = await api.submitProduct(payload);
      if (res.product_id) {
        navigate(`/product/${res.product_id}`);
      }
    } catch (err) {
      alert('Error submitting product data.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Local Image OCR & Label Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Upload Nutrition & Ingredient Label
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Our local OCR engine extracts calories, sugar, sodium, protein, fibre, and industrial additives. Review and edit all extracted values before running final analysis.
          </p>
        </div>

        {/* Upload Card */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-xl bg-stone-50 transition group cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Label Preview" className="max-h-48 rounded-lg object-contain" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-stone-800">Click or Drag Nutrition / Ingredient Label Image</span>
                  <span className="text-[10px] text-stone-500 mt-1">Supports PNG, JPG, JPEG, WEBP (Max 10MB)</span>
                </>
              )}
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-stone-900 mb-2">OCR Processing Pipeline</h3>
              <ul className="space-y-2 text-xs text-stone-600 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Grayscale & Contrast Thresholding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Local Tesseract Text Extraction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Regex Nutrition & Ingredient Parsing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>User Editable Confirmation Step</span>
                </li>
              </ul>

              <button
                onClick={handleUploadAndRunOcr}
                disabled={!selectedFile || uploading}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center space-x-2 ${
                  !selectedFile || uploading
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{uploading ? 'Running OCR Engine...' : 'Run Local OCR Scan'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Confirmation & Editing Table */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-4 border-b border-stone-100 pb-3">
            <Edit3 className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900">User Confirmation & Value Verification</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Category</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Price (₹ INR)</label>
              <input
                type="number"
                value={priceInr}
                onChange={(e) => setPriceInr(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Energy / Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Total Sugar (g)</label>
              <input
                type="number"
                value={sugarG}
                onChange={(e) => setSugarG(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Protein (g)</label>
              <input
                type="number"
                value={proteinG}
                onChange={(e) => setProteinG(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Dietary Fibre (g)</label>
              <input
                type="number"
                value={fibreG}
                onChange={(e) => setFibreG(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">Sodium (mg)</label>
              <input
                type="number"
                value={sodiumMg}
                onChange={(e) => setSodiumMg(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[11px] font-semibold text-stone-600 block mb-1">Ingredients Statement</label>
            <textarea
              rows={3}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 text-xs text-stone-900 outline-none focus:border-emerald-600"
            />
          </div>

          <button
            onClick={handleSubmitConfirmedData}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition flex items-center justify-center space-x-2"
          >
            <span>Confirm Values & Execute PackVsFact Intelligence Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
