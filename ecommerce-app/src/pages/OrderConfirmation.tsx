import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Truck, Home, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const order = (location.state as any)?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-black-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black-400 mb-4">No order details found</p>
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const addr = order.shippingAddress || {};

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-black-900" />
        </div>
        <h1 className="text-4xl font-luxury text-black-100 mb-4">Order Confirmed!</h1>
        <p className="text-black-400 mb-8">Thank you for shopping with Footers. {order.customerEmail ? 'Invoice sent to your email.' : ''}</p>

        <div className="card p-8 mb-8 text-left space-y-4">
          <div><h3 className="text-sm text-black-400">Order Number</h3><p className="text-2xl font-bold text-gold-500">{order.orderNumber}</p></div>
          {order.invoiceNumber && <div><h3 className="text-sm text-black-400">Invoice</h3><p className="text-lg text-black-100">{order.invoiceNumber}</p></div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-black-400 mb-1">Shipping To</h3>
              <p className="text-black-300">{order.customerName}<br />{addr.line1}<br />{addr.city}, {addr.state} — {addr.pincode}<br />{order.customerPhone}</p>
            </div>
            <div>
              <h3 className="text-sm text-black-400 mb-1">Payment</h3>
              <p className="text-black-300 capitalize">{order.paymentMethod}<br />{formatCurrency(order.total)}</p>
            </div>
          </div>
          {order.trackingNumber && (
            <div className="p-4 bg-black-800 rounded-lg">
              <h3 className="text-sm text-black-400 mb-1">Tracking Number</h3>
              <p className="font-mono text-gold-500">{order.trackingNumber}</p>
              <p className="text-xs text-black-500 mt-1">{order.courierPartner}</p>
              <Link to={`/track-order?order=${order.orderNumber}&phone=${encodeURIComponent(order.customerPhone)}`} className="text-sm text-gold-500 hover:underline mt-2 inline-block">Track Shipment →</Link>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-secondary flex items-center gap-2"><Home className="w-4 h-4" /> Home</Link>
          <Link to="/products" className="btn-primary flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Continue Shopping</Link>
          <Link to={`/track-order?order=${order.orderNumber}&phone=${encodeURIComponent(order.customerPhone)}`} className="btn-secondary flex items-center gap-2"><Truck className="w-4 h-4" /> Track Order</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
