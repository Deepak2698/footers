import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function RecentOrdersTable({ orders = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((o) => (
            <tr key={o._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{o.orderNumber || o._id?.slice(-6)}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{o.customerName || o.user?.name || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
              <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">₹{(o.total ?? o.totalPrice ?? 0).toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[o.status] || 'bg-gray-100 text-gray-800'}`}>
                  {o.status || '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link to={`/admin/orders/${o._id}`} className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700">
                  <Eye className="w-4 h-4 mr-1" /> View
                </Link>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No recent orders</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
