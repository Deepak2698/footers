import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Truck, CreditCard, Smartphone, Building, Wallet, DollarSign, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { checkoutOrder } from '../services/orderService';
import { formatCurrency } from '../utils/format';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, PayTM' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'All major banks' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'PayTM, PhonePe, Amazon Pay' },
  { id: 'cod', name: 'Cash on Delivery', icon: DollarSign, description: 'Pay on delivery' },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, couponCode, getSubtotal, getShipping, getCouponDiscount, getTax, getTotal, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '',
    line1: '', city: '', state: '', pincode: '', orderNotes: '', paymentMethod: 'cod'
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (items.length === 0 && !processing) {
    return (
      <div className="min-h-screen bg-black-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black-400 mb-4">Your cart is empty</p>
          <Link to="/products" className="btn-primary">Shop Products</Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!form.customerName || !form.customerPhone || !form.line1 || !form.city || !form.state || !form.pincode) {
      setError('Please fill all required fields');
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const res = await checkoutOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        shippingAddress: { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode },
        orderNotes: form.orderNotes || undefined,
        paymentMethod: form.paymentMethod,
        couponCode: couponCode || undefined,
        items: items.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity }))
      });
      clearCart();
      navigate('/order-confirmation', { state: { order: res.order } });
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Order failed');
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-black-900 flex items-center justify-center">
        <div className="text-center">
          <Check className="w-12 h-12 text-gold-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl text-black-100">Processing Order...</h1>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const total = getTotal();

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/cart" className="text-black-400 hover:text-gold-500"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-3xl font-luxury text-black-100">Checkout</h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-black-100 mb-4">Customer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="input-field" placeholder="Full Name *" value={form.customerName} onChange={e => set('customerName', e.target.value)} />
                <input className="input-field" placeholder="Phone *" value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} />
                <input className="input-field md:col-span-2" placeholder="Email (for invoice)" type="email" value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-black-100 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="input-field md:col-span-2" placeholder="Address *" value={form.line1} onChange={e => set('line1', e.target.value)} />
                <input className="input-field" placeholder="City *" value={form.city} onChange={e => set('city', e.target.value)} />
                <input className="input-field" placeholder="State *" value={form.state} onChange={e => set('state', e.target.value)} />
                <input className="input-field" placeholder="Pincode *" value={form.pincode} onChange={e => set('pincode', e.target.value)} />
                <textarea className="input-field md:col-span-2" placeholder="Order Notes" rows={2} value={form.orderNotes} onChange={e => set('orderNotes', e.target.value)} />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-black-100 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map(m => (
                  <label key={m.id} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${form.paymentMethod === m.id ? 'border-gold-500' : 'border-black-700'}`}>
                    <input type="radio" name="payment" checked={form.paymentMethod === m.id} onChange={() => set('paymentMethod', m.id)} />
                    <m.icon className="w-5 h-5 text-gold-500" />
                    <div><div className="text-black-100">{m.name}</div><div className="text-xs text-black-400">{m.description}</div></div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 sticky top-4 h-fit">
            <h2 className="text-xl font-semibold text-black-100 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map(i => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-black-400">{i.title} × {i.quantity}</span>
                  <span>{formatCurrency(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-black-700 pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              {getCouponDiscount() > 0 && <div className="flex justify-between text-green-500"><span>Coupon</span><span>-{formatCurrency(getCouponDiscount())}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span>{getShipping() === 0 ? 'FREE' : formatCurrency(getShipping())}</span></div>
              {getTax() > 0 && <div className="flex justify-between"><span>GST</span><span>{formatCurrency(getTax())}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span className="text-gold-500">{formatCurrency(total)}</span></div>
            </div>
            <div className="flex items-center space-x-2 mt-4 p-3 bg-black-800 rounded text-xs text-black-400">
              <Shield className="w-4 h-4 text-gold-500" /><span>Secure checkout</span>
              <Truck className="w-4 h-4 text-gold-500 ml-2" /><span>2-3 days delivery</span>
            </div>
            <button onClick={handlePlaceOrder} className="w-full btn-primary mt-4">Place Order • {formatCurrency(total)}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
