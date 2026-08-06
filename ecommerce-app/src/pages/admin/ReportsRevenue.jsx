import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { IndianRupee, TrendingUp } from 'lucide-react';

export default function ReportsRevenue() {
  const { data, isLoading } = useQuery({
    queryKey: ['revenueReport'],
    queryFn: async () => {
      const res = await api.get('/dashboard/owner');
      return res.data?.data;
    }
  });

  if (isLoading) return <div className="p-6 text-gray-500">Loading revenue report...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue Report</h1>
        <p className="text-sm text-gray-500 mt-1">Financial overview and revenue metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Revenue</div>
              <div className="text-3xl font-bold text-emerald-600 mt-1">₹{(data?.totalRevenue ?? 0).toLocaleString()}</div>
            </div>
            <IndianRupee className="w-10 h-10 text-gray-300" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{data?.totalOrders ?? 0}</div>
            </div>
            <TrendingUp className="w-10 h-10 text-gray-300" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Today's Orders</div>
              <div className="text-3xl font-bold text-blue-600 mt-1">{data?.todaysOrders ?? 0}</div>
            </div>
            <TrendingUp className="w-10 h-10 text-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Revenue Orders</h2>
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Order #</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-2 text-right text-xs text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(data?.recentOrders || []).map(o => (
              <tr key={o._id}>
                <td className="px-4 py-3 text-sm">{o.orderNumber}</td>
                <td className="px-4 py-3 text-sm">{o.customerName}</td>
                <td className="px-4 py-3 text-sm text-right font-medium">₹{o.total?.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
