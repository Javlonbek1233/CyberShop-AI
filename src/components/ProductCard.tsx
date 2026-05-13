import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Info, Star, Zap } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, profile } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = profile?.wishlist.includes(product.id);

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col transition-all h-full ${isHovered ? 'border-cyber-neon/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : ''}`}
    >
      {product.isFlashSale && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-cyber-pink text-[8px] text-white font-bold rounded z-20 flex items-center gap-1 shadow-[0_0_10px_rgba(255,0,255,0.3)] uppercase">
          <Zap className="w-2 h-2 fill-white" />
          Flash
        </div>
      )}

      <div className="aspect-square bg-black/40 rounded-lg mb-3 border border-white/5 flex items-center justify-center relative overflow-hidden">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-lighten grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-xs font-bold uppercase truncate group-hover:text-cyber-neon transition-colors">{product.name}</h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{product.category}</p>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs font-bold text-cyber-neon">${product.isFlashSale ? product.discountPrice : product.price}</span>
           {product.isFlashSale && (
             <span className="text-[8px] text-white/30 line-through">${product.price}</span>
           )}
        </div>
      </div>

      <p className="text-[10px] text-white/40 font-sans line-clamp-2 mb-4 h-8 leading-tight">
        {product.description}
      </p>

      <div className="mt-auto flex gap-2">
        <button 
          onClick={() => addToCart(product)}
          className="flex-1 py-2 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase transition-all hover:bg-cyber-neon hover:text-black group-hover:border-cyber-neon/30"
        >
          Quick Add
        </button>
        <button 
          onClick={() => toggleWishlist(product.id)}
          className={`p-2 border border-white/10 rounded transition-colors ${isWishlisted ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink' : 'hover:border-cyber-pink hover:text-cyber-pink'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-cyber-pink' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
}
