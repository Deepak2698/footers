import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Shield, Truck, RefreshCw, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/format';
import { useToast } from '../components/Toast';

const Cart: React.FC = () => {
  const {
    items, updateQuantity, removeItem, clearCart,
    couponCode, setCouponCode, getSubtotal, getItemDiscount,
    getShipping, getCouponDiscount, getTotal
  } = useCart();
  const [inputCoupon, setInputCoupon] = useState(couponCode);
  const { showToast } = useToast();

  const applyCoupon = () => {
    if (inputCoupon.toUpperCase() === 'SAVE10') setCouponCode('SAVE10');
    else showToast('Invalid coupon. Try SAVE10', 'error');
  };

  const subtotal = getSubtotal();
  const itemDiscount = getItemDiscount();
  const couponDiscount = getCouponDiscount();
  const shipping = getShipping();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black-900">
        <div className="container-custom section-padding text-center py-16">
          <ShoppingCart className="w-12 h-12 text-gold-500 mx-auto mb-6" />
          <h1 className="text-3xl font-luxury text-black-100 mb-4">Your Cart is Empty</h1>
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-black-400 mb-6">
          <Link to="/" className="flex items-center hover:text-gold-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span>/</span>
          <span className="text-black-300">Cart</span>
        </nav>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-luxury text-black-100">Cart ({items.length} items)</h1>
          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300">Clear Cart</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="card p-4 sm:p-6">
                <div className="flex gap-4 sm:gap-6">
                  <img src={item.image} alt={item.title} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-black-100 truncate">{item.title}</h3>
                        <p className="text-black-400 text-sm">{item.brand}{item.size ? ` • Size ${item.size}` : ''}</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 flex-shrink-0" aria-label="Remove item">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                          className="p-1 border border-black-600 rounded hover:border-gold-500 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-black-100">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                          className="p-1 border border-black-600 rounded hover:border-gold-500 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gold-500">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[Shield, Truck, RefreshCw].map((Icon, i) => (
                <div key={i} className="flex items-center space-x-2 p-3 bg-black-800 rounded-lg text-sm text-black-300">
                  <Icon className="w-4 h-4 text-gold-500 flex-shrink-0" /><span>{['Secure Payment', 'Fast Delivery', 'Easy Returns'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 sm:p-6 sticky top-4 h-fit order-first lg:order-last">
            <h2 className="text-xl font-semibold text-black-100 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-black-400">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              {itemDiscount > 0 && <div className="flex justify-between"><span className="text-black-400">Product Savings</span><span className="text-green-500">-{formatCurrency(itemDiscount)}</span></div>}
              {couponDiscount > 0 && <div className="flex justify-between"><span className="text-black-400">Coupon</span><span className="text-green-500">-{formatCurrency(couponDiscount)}</span></div>}
              <div className="flex justify-between"><span className="text-black-400">Shipping</span><span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
              <div className="border-t border-black-700 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span><span className="text-gold-500">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <input 
                value={inputCoupon} 
                onChange={e => setInputCoupon(e.target.value)} 
                placeholder="Coupon (SAVE10)" 
                className="flex-1 input-field" 
                disabled={!!couponCode}
                aria-label="Coupon code"
              />
              {couponCode ? (
                <button 
                  onClick={() => { setCouponCode(''); setInputCoupon(''); }} 
                  className="btn-secondary"
                  aria-label="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={applyCoupon} className="btn-secondary">Apply</button>
              )}
            </div>
            <Link to="/checkout" className="w-full btn-primary text-center block">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
