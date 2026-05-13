/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';
import AIInsights from './components/AIInsights';
import MarketTrends from './components/MarketTrends';
import FooterStatus from './components/FooterStatus';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { loading, profile } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-cyber-black">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyber-neon border-t-transparent"
        />
        <div className="ml-4 font-display text-cyber-neon tracking-widest uppercase">Initializing Systems...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-cyber-black flex flex-col overflow-hidden cyber-grid text-gray-100">
      <Navbar 
        onCartClick={() => setIsCartOpen(true)} 
        onAdminToggle={() => setIsAdminView(!isAdminView)} 
        isAdminView={isAdminView}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 flex overflow-hidden p-4 space-x-4">
        {/* Left Sidebar */}
        <AIInsights />

        {/* Main Content */}
        <main className="flex-1 flex flex-col space-y-4 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {isAdminView && profile?.role === 'admin' ? (
              <motion.div 
                key="admin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <AdminDashboard />
              </motion.div>
            ) : (
              <motion.div 
                key="store"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-4"
              >
                <Hero />
                <ProductGrid />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar */}
        <MarketTrends />
      </div>

      <FooterStatus />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AIAssistant />

      {/* Decorative Scanline */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,243,238,0.02)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] z-50 bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
