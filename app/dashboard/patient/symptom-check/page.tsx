"use client";
import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Send, Bot, RefreshCw, ArrowRight, Activity, Sparkles, Calendar } from 'lucide-react';

const QUICK_SYMPTOMS = [
  "Fever & Body Chills",
  "Chest Pain & Shortness of Breath",
  "Skin Rash & Itching",
  "Stomach Ache & Acidity",
  "Severe Headache & Migraine",
  "Joint & Knee Pain"
];

function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  // Split by line breaks to render headings, lists, rules, and bold text cleanly
  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed text-gray-200">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Header 3 (###)
        if (trimmed.startsWith('### ')) {
          return <h3 key={i} className="text-base font-bold text-cyan-300 mt-2 mb-1">{trimmed.replace('### ', '')}</h3>;
        }

        // Header 2 (##)
        if (trimmed.startsWith('## ')) {
          return <h2 key={i} className="text-lg font-extrabold text-white mt-3 mb-1">{trimmed.replace('## ', '')}</h2>;
        }

        // Horizontal rule (---)
        if (trimmed === '---') {
          return <hr key={i} className="border-white/10 my-3" />;
        }

        // Bullet point (- or *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.substring(2);
          return (
            <div key={i} className="flex items-start gap-2 pl-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{renderBold(content)}</span>
            </div>
          );
        }

        // Numbered list (1. 2.)
        const matchNumber = trimmed.match(/^(\d+\.)\s+(.*)/);
        if (matchNumber) {
          return (
            <div key={i} className="flex items-start gap-2 pl-2">
              <span className="text-cyan-400 font-bold">{matchNumber[1]}</span>
              <span>{renderBold(matchNumber[2])}</span>
            </div>
          );
        }

        return <p key={i}>{renderBold(trimmed)}</p>;
      })}
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function SymptomChecker() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content: `### 🏥 Hello! I am your AI Medical Triage Assistant.

Please describe the symptoms you are currently experiencing (e.g. fever, headache, stomach pain, chest discomfort, skin rash, joint stiffness).

I will analyze your symptoms, evaluate the urgency level, and recommend the best medical specialist for a consultation.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMessage = { role: 'user', content: queryText };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || 'Analysis complete.' }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '### ⚠️ Connection Notice\n\nI encountered a network response error. If your symptoms are severe, please consult a General Physician or visit an emergency healthcare clinic immediately.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: `### 🏥 AI Medical Triage Assistant

Chat cleared. Describe your symptoms to start a fresh assessment.`
      }
    ]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white/[0.02] rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden relative">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Medical Symptom Checker
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Active
                </span>
              </h2>
              <p className="text-xs text-gray-400">Powered by MediConnect Clinical Triage Engine</p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Chat
          </button>
        </div>

        {/* Quick Symptoms Chip Bar */}
        <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-gray-400 whitespace-nowrap flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Quick Symptoms:
          </span>
          {QUICK_SYMPTOMS.map((symptom, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(symptom)}
              disabled={loading}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 border border-white/10 transition-all whitespace-nowrap disabled:opacity-50"
            >
              + {symptom}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-5 rounded-3xl ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-white/[0.04] text-gray-200 rounded-tl-none border border-white/10 shadow-xl backdrop-blur-md'
                }`}
              >
                <FormattedText text={m.content} />

                {m.role === 'assistant' && i > 0 && (() => {
                  const specMatch = m.content.match(/\*\*(Cardiologist|Dermatologist|Orthopedic|Gynecologist|General Physician|Neurologist|Gastroenterologist|ENT Specialist|Dentist|Ophthalmologist|Psychiatrist|Pediatrician)\*\*/i);
                  const foundSpec = specMatch ? specMatch[1] : '';
                  const bookingUrl = foundSpec ? `/doctors?specialization=${encodeURIComponent(foundSpec)}` : '/doctors';

                  return (
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-gray-400">
                        {foundSpec ? `Recommended: ${foundSpec}` : 'Need a medical consultation?'}
                      </span>
                      <a
                        href={bookingUrl}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Book {foundSpec || 'Specialist'} <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-2 items-center">
                <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-xs text-gray-400 font-medium">Analyzing symptoms & evaluating urgency...</span>
                <div className="flex gap-1 items-center ml-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your symptoms (e.g. I have a throbbing headache and mild fever since morning...)"
              className="flex-1 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:bg-white/10 transition-all text-sm text-white placeholder-gray-500 outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <span>Analyze</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2.5 text-center tracking-wide">
            ⚠️ <span className="font-semibold text-gray-400">Medical Disclaimer:</span> This AI assistant provides triage information only. Always consult a certified physician for medical diagnosis.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
