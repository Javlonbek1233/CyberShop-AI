import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { Filters, Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductGrid() {
  const { products } = useStore();
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesCat = category === 'ALL' || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, category, search]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all whitespace-nowrap ${
                category === cat 
                ? 'bg-cyber-neon text-black font-bold' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              // {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-1 border border-white/10">
            <button onClick={() => setView('grid')} className={`p-1 ${view === 'grid' ? 'text-cyber-neon' : 'text-white/30'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-1 ${view === 'list' ? 'text-cyber-neon' : 'text-white/30'}`}><List className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 border border-white/10 group focus-within:border-cyber-neon transition-colors">
            <Search className="w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="FILTER CATALOG..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-mono uppercase tracking-widest placeholder:text-white/20 w-32 focus:w-48 transition-all"
            />
          </div>
        </div>
      </div>

      <motion.div 
        layout
        className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}
      >
        <AnimatePresence>
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20 border border-dashed border-white/10">
          <div className="text-4xl neon-text mb-4 font-display opacity-50">NO MATCHES FOUND</div>
          <p className="text-white/30 font-mono text-xs uppercase tracking-widest">Query returned zero results in current sector.</p>
        </div>
      )}
    </section>
  );
}
