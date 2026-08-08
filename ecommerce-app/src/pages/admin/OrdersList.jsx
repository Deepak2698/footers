import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orderService from '../../services/orderService';
import { Search, Filter, Eye, Package, Phone, User } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function OrdersList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['adminOrders', search, status, page, limit],
    queryFn: () => orderService.getOrders({ search, status, page, limit }),
    retry: false
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => orderService.updateOrderStatus(id, newStatus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminOrders'] })
  });

  const orders = data?.orders || [];
  const count = data?.count || 0;
  const pages = Math.ceil(count / limit);

  const handleSearch = () => { setPage(1); refetch(); };
  const handleReset = () => { setSearch(''); setStatus(''); setPage(1); };

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Change order status to "${newStatus}"?`)) {
      statusMutation.mutate({ id: orderId, newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer orders and fulfillment</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search order #, customer, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={handleSearch} className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            <Filter className="w-4 h-4" /><span>Filter</span>
          </button>
          <button onClick={handleReset} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading && <div className="p-8 text-center text-gray-500">Loading orders...</div>}
        {error && <div className="p-8 text-center text-red-500">Error loading orders</div>}
        {!isLoading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((o) => {
                    const totalQty = o.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0;
                    return (
                      <tr key={o._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{o.orderNumber}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{o.customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{o.customerPhone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{o.items?.length || 0} items</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{totalQty}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(o.total)}</td>
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            disabled={statusMutation.isPending}
                            className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${statusColors[o.status] || 'bg-gray-100'}`}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/admin/orders/${o._id}`} className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4" /><span>View</span>
                          </Link>
                          <Link to={`/admin/invoice/${o._id}`} className="inline-flex items-center ml-2 px-3 py-1 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded">
                            Invoice
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, count)} of {count}</div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                  <span className="text-sm text-gray-600">Page {page} of {pages}</span>
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
