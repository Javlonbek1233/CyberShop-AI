import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShieldCheck, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity, placeOrder } = useStore();
  
  const subtotal = cart.reduce((acc, i) => {
    const price = i.isFlashSale ? i.discountPrice || i.price : i.price;
    return acc + price * i.quantity;
  }, 0);

  const handleCheckout = async () => {
    await placeOrder();
    onClose();
    alert("ORDER_SYNCHRONIZED: Quantum request sent to delivery grid.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-cyber-black border-l border-cyber-neon z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-cyber-dark">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-cyber-neon" />
                <h2 className="text-2xl font-display uppercase tracking-widest">Cargo_Hold</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
                  <div className="w-20 h-20 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center">
                    <X className="w-10 h-10" />
                  </div>
                  <p className="font-mono text-sm uppercase tracking-tighter">Inventory Empty_</p>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 p-4 border border-white/10 bg-white/5 relative overflow-hidden group"
                  >
                    <div className="w-20 h-20 bg-black p-2 border border-white/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-[10px] font-mono text-cyber-neon uppercase">{item.category}</div>
                      <h4 className="font-display uppercase text-sm truncate">{item.name}</h4>
                      <div className="text-lg font-display text-white">
                        ${(item.isFlashSale ? item.discountPrice || item.price : item.price) * item.quantity}
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center bg-black border border-white/10 px-2 py-1 gap-4">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="hover:text-cyber-neon transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-mono">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="hover:text-cyber-neon transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-cyber-pink transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[linear-gradient(45deg,transparent_50%,rgba(0,243,255,0.1)_50%)]" />
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-6 bg-cyber-dark border-t border-cyber-neon space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-white/50">
                  <span>SUBTOTAL_VAL</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-white/50">
                  <span>TRANSIT_TAX</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-xl font-display border-t border-white/10 pt-2 text-white">
                  <span>TOTAL_CREDITS</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyber-neon uppercase tracking-widest bg-cyber-neon/10 p-2 border border-cyber-neon/30">
                  <ShieldCheck className="w-4 h-4" />
                  Quantum Encrypted Transaction Authorized
                </div>
                
                <button 
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="w-full h-16 bg-cyber-neon text-black font-display font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 group"
                >
                  <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Initialize Buy_Link
                </button>

                <p className="text-[9px] text-center text-white/30 font-mono italic">
                  By confirming, you agree to the CyberShop Neural Service Agreement v2.077
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
