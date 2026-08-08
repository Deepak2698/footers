import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import orderService from '../../services/orderService';
import { Search, FileText, Printer, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

function InvoiceDetail({ orderId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId
  });
  const order = data?.order;

  if (isLoading) return <div className="p-6 text-gray-500">Loading invoice...</div>;
  if (!order) return <div className="p-6 text-red-500">Invoice not found</div>;

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-4">
          <Link to="/admin/invoices" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice {order.orderNumber}</h1>
            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
          <Printer className="w-4 h-4" /><span>Print</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-3xl mx-auto">
        <div className="flex justify-between mb-8">
          <div>
            <div className="text-xl font-bold text-gray-900">FOOTERS</div>
            <div className="text-sm text-gray-500">Footwear Management</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">INVOICE</div>
            <div className="text-sm text-gray-500">#{order.orderNumber}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-xs text-gray-500 uppercase mb-1">Bill To</div>
            <div className="font-medium">{order.customerName}</div>
            <div className="text-sm text-gray-500">{order.customerPhone}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase mb-1">Status</div>
            <div className="font-medium capitalize">{order.status}</div>
          </div>
        </div>
        <table className="w-full mb-6">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="py-2 text-left text-xs text-gray-500 uppercase">Product</th>
              <th className="py-2 text-left text-xs text-gray-500 uppercase">Size</th>
              <th className="py-2 text-right text-xs text-gray-500 uppercase">Qty</th>
              <th className="py-2 text-right text-xs text-gray-500 uppercase">Price</th>
              <th className="py-2 text-right text-xs text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((it, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 text-sm">{it.title}</td>
                <td className="py-3 text-sm text-gray-500">{it.size || '—'}</td>
                <td className="py-3 text-sm text-right">{it.quantity}</td>
                <td className="py-3 text-sm text-right">{formatCurrency(it.price)}</td>
                <td className="py-3 text-sm text-right font-medium">{formatCurrency((it.price * it.quantity))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <div className="w-48 space-y-2">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-sm text-red-600"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>}
            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Invoice() {
  const { orderId } = useParams();
  const [search, setSearch] = React.useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['invoiceOrders', search],
    queryFn: () => orderService.getOrders({ search, limit: 50 }),
    enabled: !orderId
  });

  if (orderId) return <InvoiceDetail orderId={orderId} />;

  const orders = data?.orders || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-500 mt-1">View and print order invoices</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? <div className="p-8 text-center text-gray-500">Loading invoices...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{o.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">{o.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-sm font-medium">{formatCurrency(o.total)}</td>
                  <td className="px-6 py-4 text-sm capitalize">{o.status}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/invoice/${o._id}`} className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700">
                      <FileText className="w-4 h-4 mr-1" /> View Invoice
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No invoices found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
