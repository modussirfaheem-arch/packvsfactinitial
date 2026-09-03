import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Globe, ShieldCheck, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (કન્નડ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' }
];

const SUGGESTED_PROMPTS = [
  "What is NOVA?",
  "Explain Nutri-Score calculation",
  "Show healthier alternatives under ₹30",
  "What does MSG INS 621 mean?",
  "NOVA क्या है?",
  "कम चीनी वाले विकल्प दिखाएं"
];

export default function AssistantPage() {
  const [lang, setLang] = useState('en');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am PackVsFact\'s Local Conversational Food Brain. I run entirely offline without paid APIs. Ask me questions in English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, or Punjabi!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeakText = (text, idx) => {
    if (!window.speechSynthesis) return;

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
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
      setMessages((prev) => [...prev, { sender: 'assistant', text: 'Local NLP engine error. Please try another query.' }]);
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
              <span>Local Conversational NLP Brain & Speech Synthesis</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Food Intelligence AI Assistant
            </h1>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
            <Globe className="w-4 h-4 text-cyan-600" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-stone-50 text-xs font-bold text-stone-800 outline-none rounded px-2 py-1 border border-stone-300"
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
                      className={`p-1 rounded hover:bg-stone-200 shrink-0 transition ${speakingIdx === idx ? 'text-amber-600' : 'text-stone-400'}`}
                      title="Speak AI Answer"
                    >
                      {speakingIdx === idx ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
              {msg.meta && (
                <span className="text-[9px] text-stone-400 font-semibold mt-1 px-1">
                  [BRAIN: {msg.meta.execution_mode} | PAID API: NO]
                </span>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-cyan-700 font-semibold">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
              <span>Processing query locally...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a food science or ingredient query in English, Hindi, Tamil, Telugu..."
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
