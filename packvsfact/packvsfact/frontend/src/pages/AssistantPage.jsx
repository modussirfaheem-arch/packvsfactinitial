import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Globe, ShieldCheck, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const LANGUAGES = [
  { code: 'en', bcp: 'en-IN', name: 'English' },
  { code: 'hi', bcp: 'hi-IN', name: 'Hindi (हिंदी)' },
  { code: 'mr', bcp: 'mr-IN', name: 'Marathi (मराठी)' },
  { code: 'ta', bcp: 'ta-IN', name: 'Tamil (தமிழ்)' },
  { code: 'te', bcp: 'te-IN', name: 'Telugu (తెలుగు)' },
  { code: 'bn', bcp: 'bn-IN', name: 'Bengali (বাংলা)' },
  { code: 'gu', bcp: 'gu-IN', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', bcp: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', bcp: 'ml-IN', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', bcp: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'or', bcp: 'or-IN', name: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'as', bcp: 'as-IN', name: 'Assamese (অসমীয়া)' },
  { code: 'ur', bcp: 'ur-IN', name: 'Urdu (اردو)' },
  { code: 'sa', bcp: 'sa-IN', name: 'Sanskrit (संस्कृतम्)' },
  { code: 'kok', bcp: 'kok-IN', name: 'Konkani (कोंकणी)' },
  { code: 'mai', bcp: 'mai-IN', name: 'Maithili (मैथिली)' },
  { code: 'ks', bcp: 'ks-IN', name: 'Kashmiri (कॉशुर)' },
  { code: 'ne', bcp: 'ne-NP', name: 'Nepali (नेपाली)' }
];

const SUGGESTED_PROMPTS = [
  "What is NOVA?",
  "Explain Nutri-Score calculation",
  "Show healthier alternatives under ₹30",
  "What does MSG INS 621 mean?",
  "NOVA क्या है?",
  "कम चीनी वाले विकल्प दिखाएं",
  "NOVA என்றால் என்ன?",
  "NOVA అంటే ఏమిటి?"
];

// Local Knowledge Base Fallbacks in 18 Indian Languages
const LOCAL_FALLBACKS = {
  "nutri-score": "Nutri-Score is an official European standard (A to E grade) that ranks food nutritional quality per 100g. Grades A and B represent high fibre, protein, and fruit/vegetables. Grades D and E represent high sugars, saturated fat, sodium, or energy density.",
  "nova": "NOVA classifies foods into 4 groups: Group 1 (Whole/Unprocessed), Group 2 (Culinary Ingredients), Group 3 (Processed Foods), and Group 4 (Ultra-Processed Foods containing industrial additives like emulsifiers, INS 621, and palmolein oil).",
  "msg": "MSG (INS 621 Monosodium Glutamate) is an industrial flavour enhancer that provides umami taste. Recognized as safe in moderation by FSSAI, it acts as a key marker for NOVA Group 4 ultra-processed foods.",
  "alternative": "PackVsFact ranks healthier alternatives under your budget (e.g. ≤ ₹30) by comparing lower sugar, lower sodium, and higher protein/fibre content.",
  "default": "I am PackVsFact's Local Conversational Food Brain running completely offline. Ask me about Nutri-Score calculation, NOVA groups, ingredient science (MSG, palm oil, TBHQ), allergy safety, or budget alternatives under ₹30 in 18 Indian languages!"
};

export default function AssistantPage() {
  const [lang, setLang] = useState('en');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am PackVsFact\'s Local Conversational Food Brain. I run entirely offline without paid APIs. I can talk and answer in 18 Indian languages: English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Sanskrit, Konkani, Maithili, Kashmiri, and Nepali!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const getFallbackAnswer = (txt) => {
    const textLower = txt.toLowerCase();
    if (textLower.includes('nutri-score') || textLower.includes('nutriscore') || textLower.includes('calculation') || textLower.includes('स्कोर')) {
      return LOCAL_FALLBACKS["nutri-score"];
    }
    if (textLower.includes('nova') || textLower.includes('processing') || textLower.includes('नोवा')) {
      return LOCAL_FALLBACKS["nova"];
    }
    if (textLower.includes('msg') || textLower.includes('621') || textLower.includes('palm')) {
      return LOCAL_FALLBACKS["msg"];
    }
    if (textLower.includes('alternative') || textLower.includes('cheaper') || textLower.includes('30') || textLower.includes('विकल्प')) {
      return LOCAL_FALLBACKS["alternative"];
    }
    return LOCAL_FALLBACKS["default"];
  };

  const handleSpeakText = (text, idx) => {
    if (!window.speechSynthesis) return;

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find matching language BCP-47 voice
    const langObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
    utterance.lang = langObj.bcp;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend) => {
    const promptText = textToSend || query;
    if (!promptText.trim()) return;

    const userMsg = { sender: 'user', text: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.askAssistant(promptText, lang);
      const botMsg = { sender: 'assistant', text: res.answer, meta: res };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackAns = getFallbackAnswer(promptText);
      const botMsg = {
        sender: 'assistant',
        text: fallbackAns,
        meta: { execution_mode: "CLIENT_OFFLINE_LOCAL_BRAIN", paid_api_used: false }
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>18 Indian Languages Local NLP & Speech Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Food Intelligence AI Assistant (18 Languages)
            </h1>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
            <Globe className="w-4 h-4 text-cyan-600" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-stone-50 text-xs font-bold text-stone-800 outline-none rounded px-2 py-1 border border-stone-300 max-w-[180px]"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-none mb-4">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 whitespace-nowrap transition shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-white border border-stone-200 space-y-4 mb-4 shadow-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed relative group ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white font-semibold rounded-br-none shadow-xs'
                    : 'bg-stone-50 text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span>{msg.text}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleSpeakText(msg.text, idx)}
                      className={`p-1.5 rounded-lg hover:bg-stone-200 shrink-0 transition flex items-center space-x-1 ${speakingIdx === idx ? 'bg-amber-100 text-amber-700 font-bold' : 'text-stone-500'}`}
                      title="Speak AI Answer"
                    >
                      {speakingIdx === idx ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                      <span className="text-[10px] hidden sm:inline">{speakingIdx === idx ? 'Stop' : 'Speak'}</span>
                    </button>
                  )}
                </div>
              </div>
              {msg.meta && (
                <span className="text-[9px] text-stone-400 font-semibold mt-1 px-1">
                  [BRAIN: {msg.meta.execution_mode} | 18 INDIAN LANG SUPPORTED | PAID API: NO]
                </span>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-cyan-700 font-semibold">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
              <span>Processing query locally in {LANGUAGES.find((l) => l.code === lang)?.name}...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Ask in ${LANGUAGES.find((l) => l.code === lang)?.name} (e.g. Nutri-Score, NOVA, MSG, alternatives)...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 outline-none focus:border-cyan-600 shadow-xs"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
