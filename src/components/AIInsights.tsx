import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { LayoutGrid, BookOpen, Send } from 'lucide-react';

export default function AIInsights() {
  const { profile } = useStore();

  return (
    <aside className="w-64 flex flex-col p-4 space-y-4 h-full bg-cyber-dark/40 border-r border-white/5">
      <div className="p-3 bg-cyber-neon/10 border border-cyber-neon/30 rounded-lg">
        <p className="text-[10px] text-cyber-neon uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyber-neon rounded-full animate-pulse" />
          Neural AI Active
        </p>
        <p className="text-xs leading-relaxed text-gray-300">
          "Analyze pattern confirmed. The <span className="text-cyber-pink">Quantum Core</span> systems are currently optimized for your sector. Shall I highlight top performers?"
        </p>
      </div>
      
      <nav className="flex-1 flex flex-col space-y-1">
        <div className="px-3 py-2 bg-white/5 border-l-2 border-cyber-neon text-cyber-neon text-sm flex items-center gap-3 cursor-pointer">
          <LayoutGrid size={18} />
          Neural Feed
        </div>
        <div className="px-3 py-2 hover:bg-white/5 transition-colors text-gray-400 text-sm flex items-center gap-3 cursor-pointer">
          <BookOpen size={18} />
          Categories
        </div>
        <div className="px-3 py-2 hover:bg-white/5 transition-colors text-gray-400 text-sm flex items-center gap-3 cursor-pointer">
          <Send size={18} />
          Order Status
        </div>
      </nav>

      <div className="border-t border-white/5 pt-4">
        <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-tighter mb-2">
          <span>Session Rewards</span>
          <span className="text-cyber-neon">1,240 CR</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            className="h-full bg-gradient-to-r from-cyber-neon to-cyber-pink" 
          />
        </div>
      </div>
    </aside>
  );
}
