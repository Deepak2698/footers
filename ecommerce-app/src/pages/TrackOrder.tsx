import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import { trackOrder } from '../services/orderService';
import { formatCurrency } from '../utils/format';

const TrackOrder: React.FC = () => {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get('order') || '');
  const [phone, setPhone] = useState(params.get('phone') || '');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!orderNumber || !phone) { setError('Enter order number and phone'); return; }
    setLoading(true); setError(null);
    try {
      const res = await trackOrder(orderNumber, phone);
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Order not found');
      setResult(null);
    } finally { setLoading(false); }
  };

  React.useEffect(() => {
    if (params.get('order') && params.get('phone')) handleTrack();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const order = result?.order;
  const tracking = result?.tracking;

  return (
    <div className="min-h-screen bg-black-900">
      <div className="container-custom section-padding max-w-2xl mx-auto">
        <h1 className="text-3xl font-luxury text-black-100 mb-2">Track Your Order</h1>
        <p className="text-black-400 mb-8">Enter your order number and phone to track shipment</p>

        <form onSubmit={handleTrack} className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="input-field" placeholder="Order Number (ORD-...)" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} />
            <input className="input-field" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />{loading ? 'Tracking...' : 'Track Order'}
          </button>
          {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
        </form>

        {order && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-black-100">{order.orderNumber}</h2>
                  <p className="text-black-400 capitalize">Status: {order.status}</p>
                </div>
                <span className="text-gold-500 font-bold">{formatCurrency(order.total)}</span>
              </div>
              {order.trackingNumber && (
                <div className="p-4 bg-black-800 rounded-lg">
                  <div className="flex items-center gap-2 text-black-300"><Truck className="w-4 h-4 text-gold-500" />
                    <span className="font-mono">{order.trackingNumber}</span>
                    <span className="text-black-500">• {order.courierPartner}</span>
                  </div>
                  {order.trackingUrl && <a href={order.trackingUrl} className="text-sm text-gold-500 hover:underline mt-1 inline-block">View tracking page</a>}
                </div>
              )}
              <div className="mt-4 space-y-2">
                {order.items?.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm text-black-400">
                    <span>{it.title} {it.size ? `(Size ${it.size})` : ''} × {it.quantity}</span>
                    <span>{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {tracking?.events && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-black-100 mb-4">Shipment Timeline</h3>
                <div className="space-y-4">
                  {tracking.events.map((ev: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold-500 mt-0.5" />
                      <div>
                        <p className="text-black-100">{ev.description}</p>
                        <p className="text-xs text-black-500">{ev.location} • {new Date(ev.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/products" className="text-gold-500 hover:underline flex items-center justify-center gap-2">
            <Package className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
