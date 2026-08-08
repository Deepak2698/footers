import React from 'react';
import { useQuery } from '@tanstack/react-query';
import orderService from '../../services/orderService';
import { ShoppingCart, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function ReportsSales() {
  const { data, isLoading } = useQuery({
    queryKey: ['salesReport'],
    queryFn: () => orderService.getOrders({ limit: 100 })
  });

  const orders = data?.orders || [];
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalItems = orders.reduce((sum, o) => sum + (o.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0), 0);

  if (isLoading) return <div className="p-6 text-gray-500">Loading sales report...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
        <p className="text-sm text-gray-500 mt-1">Sales performance and order analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Sales</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(totalSales)}</div>
            </div>
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Orders</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</div>
            </div>
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Items Sold</div>
              <div className="text-3xl font-bold text-blue-600 mt-1">{totalItems}</div>
            </div>
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(o => (
              <tr key={o._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{o.orderNumber}</td>
                <td className="px-6 py-4 text-sm">{o.customerName}</td>
                <td className="px-6 py-4 text-sm">{o.items?.length || 0}</td>
                <td className="px-6 py-4 text-sm font-medium">{formatCurrency(o.total)}</td>
                <td className="px-6 py-4 text-sm capitalize">{o.status}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No sales data</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
