import React, { useState } from 'react';
import { Sparkles, Send, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  "NOVA क्या है?",
  "कम चीनी वाले विकल्प दिखाएं",
  "What does INS 621 MSG mean?"
];

export default function AssistantPage() {
  const [lang, setLang] = useState('en');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am PackVsFact\'s Local AI Assistant. I run entirely offline without paid APIs. Ask me questions in English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, or Punjabi!'
    }
  ]);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Local Multilingual AI Assistant (10 Indian Languages)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              Food Intelligence AI Assistant
            </h1>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-cyan-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-950 text-xs font-bold text-slate-200 outline-none rounded px-2 py-1 border border-slate-800"
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
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-semibold rounded-br-none shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                }`}
              >
                {msg.text}
              </div>
              {msg.meta && (
                <span className="text-[9px] text-slate-500 font-semibold mt-1 px-1">
                  [MODE: {msg.meta.execution_mode} | PAID API: NO]
                </span>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
              <span>Processing query locally...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a question in English, Hindi, Tamil, Telugu, Marathi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition flex items-center space-x-1"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
