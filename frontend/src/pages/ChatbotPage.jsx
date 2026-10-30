import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Zap,
  Info,
  Flame,
  Dumbbell,
  Apple,
} from 'lucide-react';
import { chatApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function ChatbotPage() {
  const { user } = useAuth();
  const profile = user?.profile || {};
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.name ? user.name.split(' ')[0] : 'friend'}! ⚡ I am your personal **FitBuddy AI Coach**.\n\nI have analyzed your fitness profile (Target: **${profile.goal || 'maintain'}**, Daily Calories: **${profile.dailyCalorieGoal || 2100} kcal**).\n\nFeel free to ask me for custom Indian meal ideas, exercise form cues, macro breakdowns, or tailored workout schedules! What are we working on today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'What should I eat today?',
    'How much protein do I need?',
    'Suggest a healthy Indian diet',
    'How many calories are in paneer?',
    'Suggest a beginner home workout',
    'How do I overcome a weight loss plateau?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(text, 'current_session', {
        name: user?.name,
        ...profile,
      });

      const aiMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response?.content || response?.response || "I'm here to support your fitness journey! Let me know if you need specific diet or workout advice.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Graceful fallback response
      let fallbackText = "I'm your FitBuddy AI Coach. For optimal results, aim for 1.6-2g of protein per kg of body weight, drink 2.5-3L of water daily, and combine progressive overload with wholesome nutrition.";
      const lower = text.toLowerCase();
      if (lower.includes('protein')) {
        fallbackText = `Based on your weight (${profile.weight || 70}kg), you should consume roughly **${Math.round((profile.weight || 70) * 1.8)}g to ${Math.round((profile.weight || 70) * 2.2)}g of protein daily**.\n\nGreat sources:\n• Paneer (18g/100g)\n• Chicken Breast (31g/100g)\n• Dal Tadka (7g/100g)\n• Eggs (6g/egg)\n• Greek Yogurt / Curd (10g/100g)`;
      } else if (lower.includes('paneer')) {
        fallbackText = `**100g of Standard Paneer** contains approximately:\n• **Calories:** 265 kcal\n• **Protein:** 18.3g\n• **Fats:** 20.8g\n• **Carbs:** 2.2g\n\nPaneer is rich in casein protein and calcium, making it an exceptional recovery food!`;
      } else if (lower.includes('diet') || lower.includes('eat')) {
        fallbackText = `Here is a balanced Indian high-protein plan tailored for you:\n\n**Breakfast:** Oats cooked with milk, sliced almonds & 2 boiled eggs (or paneer bhurji)\n**Lunch:** 2 multigrain rotis, 1 bowl dal, 100g paneer sabzi, cucumber salad & fresh curd\n**Snack:** 30g roasted chana + Green tea\n**Dinner:** Grilled chicken/tofu with vegetable stir fry & half cup brown rice.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: `Chat session refreshed! How can I assist your health and training goals today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col animate-fade-in">
      {/* ── Top Header ── */}
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 md:p-5 flex items-center justify-between mb-4 shadow-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#39ff1415] border border-[#39ff1440] flex items-center justify-center text-[#39ff14]">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-white">FitBuddy AI Coach</h2>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#39ff14] bg-[#39ff1415] px-2 py-0.5 rounded-full border border-[#39ff1430]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" /> Online
              </span>
            </div>
            <p className="text-xs text-[#9ca3af]">
              Personalized nutritionist & fitness expert
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="text-xs text-[#9ca3af] hover:text-white"
          >
            <RotateCcw size={14} className="mr-1" /> Clear Session
          </Button>
        </div>
      </div>

      {/* ── Chat Messages Container ── */}
      <div className="flex-1 overflow-y-auto bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 md:p-6 space-y-4 shadow-inner">
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
                    ? 'bg-[#39ff14] text-black font-bold text-xs'
                    : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#39ff14]'
                }`}
              >
                {isUser ? user?.name ? user.name[0].toUpperCase() : 'U' : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#39ff14] text-black font-medium shadow-neon'
                    : 'bg-[#141414] border border-[#1f1f1f] text-white shadow-card'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.content.split('\n').map((line, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                      {line.startsWith('•') || line.startsWith('-') ? (
                        <span className="block ml-2">{line}</span>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>

                <div
                  className={`text-[10px] mt-2 text-right ${
                    isUser ? 'text-black/60' : 'text-[#6b7280]'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#39ff14] flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Prompt Chips ── */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 px-1 shrink-0 no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            className="whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-full bg-[#161616] hover:bg-[#202020] border border-[#222222] text-[#9ca3af] hover:text-[#39ff14] hover:border-[#39ff1440] transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* ── Input Box ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center gap-2 mt-1 shrink-0"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask FitBuddy AI Coach anything about food, calories, or training..."
          className="flex-1 bg-[#111111] border border-[#1f1f1f] focus:border-[#39ff14] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#6b7280] focus:outline-none transition-all shadow-card"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!inputValue.trim() || loading}
          className="px-5 py-3.5 rounded-xl h-auto"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
