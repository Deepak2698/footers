import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  category: string;
  size?: string;
  quantity: number;
  maxStock: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  getSubtotal: () => number;
  getItemDiscount: () => number;
  getShipping: () => number;
  getCouponDiscount: () => number;
  getTax: () => number;
  getTotal: () => number;
};

const CART_KEY = 'footers_cart';
const COUPON_KEY = 'footers_coupon';
const SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;
const GST_RATE = 0;

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [couponCode, setCouponCodeState] = useState(() => localStorage.getItem(COUPON_KEY) || '');

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(COUPON_KEY, couponCode); }, [couponCode]);

  const setCouponCode = (code: string) => setCouponCodeState(code);

  const addItem = useCallback((item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    const key = `${item.productId}-${item.size || 'default'}`;
    const qty = item.quantity || 1;
    setItems(prev => {
      const existing = prev.find(i => i.id === key);
      if (existing) {
        return prev.map(i => i.id === key
          ? { ...i, quantity: Math.min(i.quantity + qty, i.maxStock) }
          : i);
      }
      return [...prev, { ...item, id: key, quantity: Math.min(qty, item.maxStock) }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCodeState('');
  }, []);

  const getSubtotal = () => items.reduce((s, i) => s + i.price * i.quantity, 0);
  const getItemDiscount = () => items.reduce((s, i) => {
    if (i.originalPrice && i.originalPrice > i.price) return s + (i.originalPrice - i.price) * i.quantity;
    return s;
  }, 0);
  const getCouponDiscount = () => couponCode.toUpperCase() === 'SAVE10' ? Math.floor(getSubtotal() * 0.1) : 0;
  const getShipping = () => {
    const afterCoupon = getSubtotal() - getCouponDiscount();
    return afterCoupon >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  };
  const getTax = () => {
    const base = getSubtotal() - getCouponDiscount();
    return Math.round(base * GST_RATE * 100) / 100;
  };
  const getTotal = () => getSubtotal() - getCouponDiscount() + getShipping() + getTax();

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, itemCount, addItem, updateQuantity, removeItem, clearCart,
      couponCode, setCouponCode, getSubtotal, getItemDiscount, getShipping,
      getCouponDiscount, getTax, getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
