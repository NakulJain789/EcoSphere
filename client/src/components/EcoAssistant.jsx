import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, ShieldCheck } from 'lucide-react';

const cannedResponses = {
  ecoscore:
    "EcoScore is our transparent 0–100 circular design index. It weights 5 key lifecycle factors: Material Integrity (25%), Reusability (25%), Packaging Circularity (20%), Durability (15%), and Recyclability (15%). It is an internal comparative framework, not a third-party certificate.",
  plastic:
    "Our products eliminate single-use plastics by substituting them with infinite-cycle materials: 304 food-grade stainless steel, French flax linen, raw golden jute, salvaged teak timber, and home-compostable bamboo or loofah.",
  shipping:
    "All EcoSphere orders are dispatched in 100% plastic-free packaging: FSC-certified unbleached corrugated kraft boxes, molded paper pulp cushions, water-activated kraft tape, and natural soy printing inks.",
  compost:
    "Plant-fiber items like our bamboo charcoal toothbrushes, loofah sponges, and beeswax wraps naturally biodegrade in home compost within 6 months. Wheat straw bioplastics are industrial-compost certified.",
  default:
    "I am your EcoSphere Sustainability Assistant. I can help answer questions about our EcoScore formula, material circularity, plastic-free shipping standards, and zero-waste home swaps! What would you like to explore?",
};

const EcoAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your EcoSphere Assistant. Ask me anything about our circular materials, plastic avoidance estimates, or EcoScore methodology.",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (textToSend) => {
    const query = (textToSend || input).toLowerCase();
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: textToSend || input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Rule-based factual answering
    let botReply = cannedResponses.default;
    if (query.includes('score') || query.includes('ecoscore') || query.includes('algorithm')) {
      botReply = cannedResponses.ecoscore;
    } else if (query.includes('plastic') || query.includes('bottle') || query.includes('avoid')) {
      botReply = cannedResponses.plastic;
    } else if (query.includes('shipping') || query.includes('package') || query.includes('box')) {
      botReply = cannedResponses.shipping;
    } else if (query.includes('compost') || query.includes('dispose') || query.includes('recycle')) {
      botReply = cannedResponses.compost;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-forest-900 hover:bg-forest-950 text-cream-50 shadow-xl border border-forest-800 transition transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-accent" />
          <span className="text-xs font-semibold">EcoSphere Assistant</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white dark:bg-charcoal-900 rounded-3xl border border-sage-200 dark:border-charcoal-800 shadow-2xl flex flex-col h-[480px] overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-forest-900 text-cream-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-forest-800 flex items-center justify-center text-amber-accent">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm">EcoSphere Guide</h4>
                <span className="text-[10px] text-sage-300 block">Factual Circular Advice</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sage-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-forest-800 text-cream-50 rounded-br-sm'
                      : 'bg-sage-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-cream-50 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-sage-50 dark:bg-charcoal-800/50 border-t border-sage-100 dark:border-charcoal-700 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('How is EcoScore calculated?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-700 whitespace-nowrap text-charcoal-700 dark:text-cream-100 hover:bg-sage-100"
            >
              EcoScore Formula
            </button>
            <button
              onClick={() => handleSend('How is packaging handled?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-700 whitespace-nowrap text-charcoal-700 dark:text-cream-100 hover:bg-sage-100"
            >
              Packaging
            </button>
            <button
              onClick={() => handleSend('How do materials eliminate plastic?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-charcoal-900 border border-sage-200 dark:border-charcoal-700 whitespace-nowrap text-charcoal-700 dark:text-cream-100 hover:bg-sage-100"
            >
              Plastic Avoidance
            </button>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-sage-200 dark:border-charcoal-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an eco question..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-sage-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-forest-800 text-cream-50 hover:bg-forest-900 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EcoAssistant;
