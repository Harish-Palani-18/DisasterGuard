import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  PhoneCall,
  ShieldAlert,
  MapPin,
  HelpCircle,
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { queryAssistant } from '../services/agentService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  onNavigateTab: (tab: string) => void;
  onOpenReportModal: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onNavigateTab,
  onOpenReportModal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello, I am the DisasterGuard Emergency Preparedness & Safety Assistant.

I can guide you on:
• Immediate survival steps for Floods, Fires, Earthquakes, and Cyclones
• Finding designated relief shelters and drinking water distribution camps
• Understanding safety advisories and risk levels
• Pre-evacuation checklists and family disaster planning

⚠️ **Critical Warning:** If you or anyone with you is in immediate physical peril, call the national emergency helpline **112** immediately. DisasterGuard AI is an automated decision-support system and does not replace official emergency services.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Urban Flash Flood Survival',
        'Find Nearest Safe Shelter',
        'Purify Emergency Water',
        'Chemical Smoke Safety'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [locationContext, setLocationContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await queryAssistant(text, locationContext);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
        sources: [res.source || 'gemini-3.8-flash']
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: 'For immediate life-threatening assistance, call 112 immediately. Move to higher ground or follow official disaster sirens.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.includes('Shelter') || action.includes('Relief Centers') || action.includes('Map')) {
      onNavigateTab('map');
    } else if (action.includes('Report')) {
      onOpenReportModal();
    } else {
      handleSend(action);
    }
  };

  const samplePrompts = [
    'What should I do during an urban flash flood?',
    'What are the nearest relief camps in Bangalore?',
    'How do I purify emergency flood water?',
    'What precautions should I take for chemical fumes?'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Assistant Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/40">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Disaster Preparedness & Response Assistant</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                Gemini 3.8 Flash
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded in official NDMA / Disaster Management guidelines.
            </p>
          </div>
        </div>

        {/* Location context field */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={locationContext}
              onChange={(e) => setLocationContext(e.target.value)}
              placeholder="Your area (e.g. Bellandur)"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[560px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                      : 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                  }`}
                >
                  {isUser ? 'You' : <Sparkles className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-red-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-3'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Suggested action chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white rounded-lg text-[11px] font-medium border border-slate-800 transition-colors"
                        >
                          {action} →
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{msg.timestamp}</span>
                    {msg.sources && (
                      <span className="text-indigo-400">Grounded: {msg.sources.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-indigo-300 flex items-center gap-2">
                <span>Gemini is synthesizing safety guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Prompts */}
        <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">Quick Ask:</span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] whitespace-nowrap border border-slate-800 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask disaster safety question, flood precautions, shelter info..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-md shadow-indigo-900/40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
