import React, { useState } from 'react';
import { ShoppingCart, User, Shield, LogOut, Bell, Search, Mic } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';

interface NavbarProps {
  onCartClick: () => void;
  onAdminToggle: () => void;
  isAdminView: boolean;
  onSearchChange: (val: string) => void;
}

export default function Navbar({ onCartClick, onAdminToggle, isAdminView, onSearchChange }: NavbarProps) {
  const { user, profile, cart, login, logout, notifications } = useStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("UPGRADE_REQUIRED: Web Speech API not supported in current neural link.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSearchChange(transcript);
    };
    recognition.start();
  };

  return (
    <header className="h-16 bg-cyber-dark/80 border border-cyber-neon/30 rounded-xl px-6 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)] flex items-center justify-between mx-4 mt-4 relative z-40">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cyber-neon to-cyber-pink rounded-lg flex items-center justify-center border border-white/20">
          <span className="font-black text-white text-xl tracking-tighter">CS</span>
        </div>
        <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-white">CYBERSHOP<span className="text-cyber-pink font-bold">AI</span></span>
      </div>
      
      <div className="flex-1 max-w-md mx-8 relative flex items-center group">
        <div className="absolute left-4 text-cyber-neon">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text" 
          placeholder="Analyze market for best deals..." 
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-black/40 border border-cyber-neon/20 rounded-full py-2 pl-12 pr-12 focus:outline-none focus:ring-1 focus:ring-cyber-neon transition-all text-sm outline-none font-mono"
        />
        <div 
          onClick={startVoiceSearch}
          className={`absolute right-4 cursor-pointer hover:text-cyber-neon transition-colors ${isListening ? 'text-cyber-pink animate-pulse' : 'text-cyber-pink/70'}`}
        >
          <Mic className="w-[18px] h-[18px]" />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex space-x-4 border-r border-white/10 pr-6">
          <div className="relative cursor-pointer group" onClick={onCartClick}>
            <span className="absolute -top-1 -right-1 bg-cyber-pink text-[10px] px-1 rounded-full border border-white/20 z-10">
              {cart.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
            <ShoppingCart className="w-5 h-5 group-hover:text-cyber-neon transition-colors" />
          </div>
          <div className="relative cursor-pointer group">
            <Bell className="w-5 h-5 group-hover:text-cyber-neon transition-colors" />
            {unreadCount > 0 && <div className="absolute top-0 right-0 w-2 h-2 bg-cyber-neon rounded-full" />}
          </div>
          {profile?.role === 'admin' && (
            <div className={`cursor-pointer transition-colors ${isAdminView ? 'text-cyber-neon' : 'text-white/50 hover:text-white'}`} onClick={onAdminToggle}>
              <Shield className="w-5 h-5" />
            </div>
          )}
        </div>

        {!user ? (
          <button 
            onClick={login}
            className="px-4 py-2 bg-cyber-neon/10 border border-cyber-neon/30 text-cyber-neon font-black text-[10px] uppercase rounded hover:bg-cyber-neon hover:text-black transition-all"
          >
            Authenticate
          </button>
        ) : (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-2 border-cyber-neon p-0.5 overflow-hidden group relative cursor-pointer" onClick={logout}>
                <div className="w-full h-full bg-cyber-neon/20 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                  {profile?.displayName?.slice(0, 2) || 'JD'}
                </div>
                <div className="absolute inset-0 bg-cyber-pink/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-white" />
                </div>
              </div>
          </div>
        )}
      </div>
    </header>
  );
}
