import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Command, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useStore } from '../context/StoreContext';
import ReactMarkdown from 'react-markdown';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Welcome to CyberShop AI Core. I am your neural shopping assistant. How can I augment your reality today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { products } = useStore();

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are the CyberShop AI Assistant. You help users find futuristic products in our store. 
        Current available products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price })))}. 
        Respond in a cyberpunk style, using tech slang but remaining helpful. 
        User query: ${userMsg}`,
      });
      
      setMessages(prev => [...prev, { role: 'ai', content: response.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "CRITICAL_ERROR: Connection to AI Core lost. Please retry link." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] glass-card neon-border flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyber-neon" />
                <span className="font-display text-sm tracking-widest uppercase">Assistant_Core</span>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4 hover:text-cyber-pink transition-colors" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-xs font-sans ${
                    m.role === 'user' 
                    ? 'bg-cyber-neon text-black rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                    : 'bg-white/5 text-white/90 border border-white/10 rounded-tr-lg rounded-br-lg rounded-bl-lg'
                  }`}>
                    <div className="markdown-body">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-cyber-neon" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query systems..."
                className="flex-1 bg-white/5 border border-white/10 p-2 text-xs font-mono focus:border-cyber-neon outline-none"
              />
              <button 
                onClick={handleSend}
                className="bg-cyber-neon text-black p-2 hover:bg-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-cyber-neon text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)] group"
      >
        <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
}
