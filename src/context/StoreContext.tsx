import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  getDocs,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Product, CartItem, UserProfile, Notification } from '../types';

interface StoreContextType {
  user: User | null;
  profile: UserProfile | null;
  products: Product[];
  cart: CartItem[];
  notifications: Notification[];
  loading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  placeOrder: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Sync Profile
        const userRef = doc(db, 'users', u.uid);
        onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // Create profile
            const newProfile: UserProfile = {
              uid: u.uid,
              email: u.email || '',
              displayName: u.displayName || 'CyberUser',
              role: 'customer',
              wishlist: []
            };
            setDoc(userRef, newProfile);
          }
        });

        // Notifications Listener
        const q = query(collection(db, 'notifications'), where('userId', '==', u.uid));
        onSnapshot(q, (snap) => {
          setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification)));
        });
      } else {
        setProfile(null);
        setNotifications([]);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Products Listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    });
    return unsub;
  }, []);

  // Local Cart Persistence (could move to Firestore if needed)
  useEffect(() => {
    const saved = localStorage.getItem('cyber_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cyber_cart', JSON.stringify(cart));
  }, [cart]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === productId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const toggleWishlist = async (productId: string) => {
    if (!profile) return;
    const userRef = doc(db, 'users', profile.uid);
    const newWishlist = profile.wishlist.includes(productId)
      ? profile.wishlist.filter(id => id !== productId)
      : [...profile.wishlist, productId];
    await updateDoc(userRef, { wishlist: newWishlist });
  };

  const placeOrder = async () => {
    if (!profile || cart.length === 0) return;
    
    const orderData = {
      userId: profile.uid,
      items: cart.map(i => ({
        productId: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.isFlashSale ? i.discountPrice || i.price : i.price
      })),
      total: cart.reduce((acc, i) => acc + (i.isFlashSale ? i.discountPrice || i.price : i.price) * i.quantity, 0),
      status: 'pending',
      createdAt: serverTimestamp(),
      trackingNumber: `CYB-${Math.floor(Math.random() * 1000000)}`
    };

    await addDoc(collection(db, 'orders'), orderData);
    setCart([]);
  };

  return (
    <StoreContext.Provider value={{
      user, profile, products, cart, notifications, loading,
      addToCart, removeFromCart, updateCartQuantity, login, logout, toggleWishlist, placeOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
