import React from 'react';

export default function FooterStatus() {
  return (
    <footer className="h-8 flex items-center justify-between px-4 text-[9px] font-mono text-gray-500 border-t border-white/5 bg-cyber-dark/80 backdrop-blur-md">
      <div className="flex space-x-6">
        <span className="flex items-center">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 shadow-[0_0_5px_rgba(34,197,94,1)]"></span>
          NODE: SEOUL_01_X
        </span>
        <span>LATENCY: 4ms</span>
        <span>ENCRYPTION: QUANTUM-G7</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-cyber-neon/70 font-bold tracking-widest uppercase">V2.04.1-STABLE</span>
        <span className="text-white/20">|</span>
        <span>SYSTEM TIME: {new Date().toISOString().replace('T', ' ').split('.')[0]}</span>
      </div>
    </footer>
  );
}
