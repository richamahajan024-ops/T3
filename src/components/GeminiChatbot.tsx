/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Globe,
  Loader2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Brain,
  HelpCircle,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
  modelUsed?: string;
  isFallback?: boolean;
}

interface GeminiChatbotProps {
  initialPrompt?: string;
  routeContext?: {
    fromStation: string;
    toStation: string;
    date?: string;
  } | null;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  initialPrompt,
  routeContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Namaste! I am **RailConnect Sahayak**, your Indian Railways travel and timetable AI assistant powered by **Gemini**.\n\nI can help you with direct train routes, station codes, train types (Vande Bharat, Rajdhani, Shatabdi), operating days, overnight arrival rules, or retrieve real-time transit information using **Google Search Grounding**.\n\nHow may I assist your journey today?`,
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [modelChoice, setModelChoice] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Sync initialPrompt if provided
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      inputRef.current?.focus();
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Send conversation to server-side endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          modelChoice,
          useSearchGrounding,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text || 'No response returned from the assistant.',
        timestamp: Date.now(),
        sources: data.groundingSources || [],
        modelUsed: data.modelUsed || modelChoice,
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: unknown) {
      console.error('Chat Error:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: `Unable to get a response from Gemini AI. ${(err as Error)?.message || 'Please check your connection and try again.'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: `Conversation cleared. How can I help you with Indian Railways direct trains or timetables?`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick suggestion prompts
  const suggestions = [
    'What is the fastest direct train between Delhi (NDLS) and Mumbai (MMCT)?',
    'Explain the key differences between Vande Bharat and Rajdhani Express.',
    'Search latest Indian Railways winter fog schedule advisories.',
    'Does the 12951 Mumbai Rajdhani operate on Sundays?',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md flex flex-col h-[700px] max-w-4xl mx-auto overflow-hidden">
      {/* Chat Top Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">RailConnect Sahayak</h2>
              <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-800 text-sky-200 border border-sky-700">
                Gemini AI
              </span>
              {useSearchGrounding && (
                <span className="flex items-center gap-1 font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  Google Search Grounded
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Indian Railways Timetable, Direct Routes & Transit Specialist
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Model selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setModelChoice('gemini-3.8-flash')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                modelChoice === 'gemini-3.8-flash'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="gemini-3.8-flash (Recommended for general tasks & Search Grounding)"
            >
              3.8 Flash
            </button>
            <button
              type="button"
              onClick={() => setModelChoice('gemini-3.1-flash-lite')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                modelChoice === 'gemini-3.1-flash-lite'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="gemini-3.1-flash-lite (Fast lightweight responses)"
            >
              3.1 Lite
            </button>
            <button
              type="button"
              onClick={() => setModelChoice('gemini-4-argon')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                modelChoice === 'gemini-4-argon'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="gemini-4-argon (Complex reasoning)"
            >
              4 Argon
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearHistory}
            title="Clear chat thread"
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grounding & Route Context Banner */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useSearchGrounding}
            onChange={(e) => setUseSearchGrounding(e.target.checked)}
            className="w-3.5 h-3.5 text-amber-600 rounded border-slate-300 accent-amber-600 cursor-pointer"
          />
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-sky-700" />
            Enable Google Search Grounding for live railway data
          </span>
        </label>

        {routeContext && (
          <span className="text-[11px] text-slate-500 font-mono">
            Active Context: {routeContext.fromStation} → {routeContext.toStation}
          </span>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-sky-900 text-white'
                    : 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-slate-950" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-sky-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.text.split('\n').map((line, i) => {
                    // Simple bold handling
                    if (line.startsWith('• ')) {
                      return (
                        <p key={i} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-amber-600 font-normal">
                          {renderFormattedText(line.slice(2))}
                        </p>
                      );
                    }
                    return <p key={i}>{renderFormattedText(line)}</p>;
                  })}
                </div>

                {/* Google Search Grounding Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-sky-700" />
                      Google Search Grounding Sources ({msg.sources.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-sky-50 text-sky-800 text-[10px] font-medium border border-slate-200 transition-colors"
                        >
                          <span className="max-w-[180px] truncate">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Metadata */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {msg.modelUsed && ` · ${msg.modelUsed}`}
                  </span>
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-700 transition-colors flex items-center gap-0.5 cursor-pointer"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Bot className="w-4 h-4 text-slate-950" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
              <span>
                {useSearchGrounding
                  ? 'Grounding query with Google Search & Gemini reasoning...'
                  : 'Analyzing Indian Railways timetables...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(s)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors text-[11px] whitespace-nowrap cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Box Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            useSearchGrounding
              ? "Ask RailConnect Sahayak (grounded with Google Search)..."
              : "Ask about direct train routes, station codes, or timetables..."
          }
          className="flex-1 px-4 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:border-sky-700 focus:ring-1 focus:ring-sky-700"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

// Simple helper to parse bold text **like this**
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
