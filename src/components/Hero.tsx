import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-64 bg-gradient-to-br from-[#111122] to-cyber-black rounded-2xl border border-cyber-neon/20 overflow-hidden flex shadow-2xl">
      <div className="absolute top-4 right-4 bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase z-20">
        AR Preview Active
      </div>
      
      <div className="flex-1 p-8 flex flex-col justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[10px] font-mono text-cyber-neon mb-2 tracking-widest uppercase"
        >
          // FEATURED AUGMENTATION
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-black mb-2 leading-none"
        >
          NEURAL LINK <span className="neon-text">VR-7</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-xs max-w-xs mb-6 italic"
        >
          AI-Generated Description: Immersive haptic feedback with direct neural interfacing for 0ms latency virtuality.
        </motion.p>
        <div className="flex space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-cyber-neon text-black font-black text-[10px] uppercase rounded-md shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          >
            Acquire Now 499 CR
          </motion.button>
          <button className="px-6 py-2 border border-white/20 text-white font-bold text-[10px] uppercase rounded-md hover:bg-white/5 transition-colors">
            Compare Stats
          </button>
        </div>
      </div>

      <div className="w-72 relative flex items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 bg-cyber-neon/10 rounded-full blur-3xl" 
        />
        <motion.div 
          initial={{ skewX: 12, rotate: 12 }}
          animate={{ skewX: [12, 15, 12], rotate: [12, 10, 12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-56 h-40 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-2xl backdrop-blur-sm relative z-10"
        >
           <div className="text-4xl text-white/10 font-black -rotate-45 tracking-widest uppercase">CORE</div>
           <div className="absolute inset-0 bg-gradient-to-tr from-cyber-neon/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
