import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  updateDoc, 
  doc,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'framer-motion';
import { Plus, Database, TrendingUp, Package, Users, AlertCircle, Trash2, CheckCircle } from 'lucide-react';
import { Order, Product } from '../types';

export default function AdminDashboard() {
  const { products, profile } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const seedProducts = async () => {
    const initialProducts = [
      {
        name: "Neural Link v4",
        category: "Cyberware",
        price: 12500,
        stock: 50,
        description: "Direct brain-to-matrix interface with 100Tbps throughput. Warning: 0.1% chance of ego-dissolution.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000",
        rating: 5,
        isFlashSale: true,
        discountPrice: 9999
      },
      {
        name: "Neon Katana",
        category: "Weapons",
        price: 2500,
        stock: 20,
        description: "Thermal-edged monomolecular blade. Cuts through reinforced ferro-concrete like synth-butter.",
        image: "https://images.unsplash.com/photo-1517436073-3c66f446059c?q=80&w=1000",
        rating: 4
      },
      {
        name: "Hyper-Drive Sneakers",
        category: "Apparel",
        price: 850,
        stock: 100,
        description: "Anti-grav soles and self-adjusting kinetic dampeners. Perfect for high-speed parkour in the sprawl.",
        image: "https://images.unsplash.com/photo-1552346154-21d32810acc1?q=80&w=1000",
        rating: 5
      },
      {
        name: "Smart Holo-Glasses",
        category: "Optics",
        price: 1500,
        stock: 45,
        description: "Built-in threat detection, real-time translation, and 8K retinal projection overlay.",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000",
        rating: 4
      },
      {
        name: "Quantum Core Laptop",
        category: "Computing",
        price: 45000,
        stock: 5,
        description: "Uses trapped ions for parallel processing. Can decrypt legacy military-grade bank vaults in seconds.",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000",
        rating: 5,
        isFlashSale: true,
        discountPrice: 38000
      }
    ];

    for (const p of initialProducts) {
      // Check if product exists to avoid duplicates
      if (!products.find(existing => existing.name === p.name)) {
        await addDoc(collection(db, 'products'), p);
      }
    }
    alert("DATABASE_SEEDED: Initial high-tech inventory localized.");
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Permanently de-materialize this inventory item?")) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-cyber-pink mx-auto" />
          <h2 className="text-3xl font-display text-cyber-pink tracking-widest">ACCESS_DENIED</h2>
          <p className="text-white/50 font-mono">Unauthorized access detected. Retinal scan failed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-display">System_Control</h2>
          <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Admin Terminal // User: {profile.displayName}</p>
        </div>
        <button 
          onClick={seedProducts}
          className="flex items-center gap-2 px-6 py-3 border border-cyber-neon text-cyber-neon hover:bg-cyber-neon hover:text-black transition-all font-display uppercase tracking-widest"
        >
          <Database className="w-5 h-5" />
          Seed Initial Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: 'Net Sales', val: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, color: 'text-cyber-neon' },
          { icon: Package, label: 'Units Sold', val: orders.reduce((acc, o) => acc + o.items.reduce((a, i) => a + i.quantity, 0), 0), color: 'text-cyber-neon' },
          { icon: Users, label: 'Link Count', val: '1,024', color: 'text-cyber-neon' },
          { icon: AlertCircle, label: 'Active Alerts', val: '2', color: 'text-cyber-pink' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 border border-white/10 space-y-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">{stat.label}</div>
            <div className="text-3xl font-display">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-display flex items-center gap-2">
            <Package className="w-6 h-6 text-cyber-neon" />
            Inventory_Status
          </h3>
          <div className="glass-card border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4">PRODUCT</th>
                  <th className="p-4">STOCK</th>
                  <th className="p-4">PRICE</th>
                  <th className="p-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">{p.name}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4 text-cyber-neon">${p.price}</td>
                    <td className="p-4">
                      <button onClick={() => deleteProduct(p.id)} className="text-white/30 hover:text-cyber-pink transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-display flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyber-neon" />
            Recent_Orders
          </h3>
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="glass-card p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-white/40">ID: {order.id.slice(0, 8)}...</div>
                  <div className="font-display text-sm">{order.items.length} Units // Total: ${order.total}</div>
                  <div className="text-[10px] font-mono text-cyber-neon uppercase mt-1">Status: {order.status}</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'shipped')}
                    className="p-2 border border-white/10 hover:border-cyber-neon transition-colors"
                    title="Mark as Shipped"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-10 text-white/30 font-mono text-xs uppercase">No order transactions detected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
