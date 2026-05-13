import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';

export default function MarketTrends() {
  return (
    <aside className="w-72 flex flex-col space-y-4 p-4 h-full bg-cyber-dark/40 border-l border-white/5">
       {/* Order Tracking */}
       <div className="bg-cyber-dark/60 border border-white/5 rounded-xl p-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyber-pink mb-4">In-Flight Delivery</h4>
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-[7px] top-1 bottom-1 w-[1px] bg-white/10"></div>
            
            <div className="relative">
              <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-cyber-neon shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
              <p className="text-[11px] font-bold">Cyber-Hub [LDN-4]</p>
              <p className="text-[9px] text-gray-500">Out for drone dispatch • 14:02</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-white/20"></div>
              <p className="text-[11px] font-bold text-gray-400">Arrival at Sector 7</p>
              <p className="text-[9px] text-gray-500">Estimated • 14:45</p>
            </div>
          </div>
       </div>

       {/* Trends */}
       <div className="flex-1 bg-cyber-dark/60 border border-white/5 rounded-xl p-4 flex flex-col">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyber-neon mb-4">Market Volatility</h4>
          <div className="flex-1 flex items-end space-x-1 min-h-[100px] mb-4 bg-black/20 p-2 rounded">
            {[30, 55, 90, 40, 65, 50].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className={`w-full rounded-t-sm border-t ${h > 80 ? 'bg-cyber-pink/40 border-cyber-pink' : 'bg-cyber-neon/20 border-cyber-neon/50'}`}
              />
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Active Users</span>
              <span className="text-xs font-mono text-cyber-neon tracking-tighter">124,092.31</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Global Trade Vol</span>
              <span className="text-xs font-mono text-cyber-pink tracking-tighter">4.2M CR</span>
            </div>
          </div>
          
          <div className="mt-auto pt-4">
            <div className="p-3 bg-cyber-pink/10 border border-cyber-pink/20 rounded-lg">
              <div className="flex items-center text-cyber-pink font-bold text-[10px] mb-1">
                <TrendingUp className="mr-1" size={12} />
                FLASH SALE ALERT
              </div>
              <p className="text-[9px] text-gray-400">Titanium Mesh Suit: -45% for next <span className="text-white font-bold">04:12</span></p>
            </div>
          </div>
       </div>
    </aside>
  );
}
