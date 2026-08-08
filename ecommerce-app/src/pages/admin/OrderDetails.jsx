import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orderService from '../../services/orderService';
import { ArrowLeft, User, Phone, Package, Calendar, DollarSign, CheckCircle, XCircle, Package as PackageIcon, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: Package,
  confirmed: CheckCircle,
  packed: PackageIcon,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
};

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id
  });
  const order = data?.order;

  const mutation = useMutation({
    mutationFn: (status) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    }
  });

  const handleStatus = (status) => {
    mutation.mutate(status);
  };

  if (isLoading) return <div className="p-6">Loading order details...</div>;
  if (!order) return <div className="p-6">Order not found</div>;

  const StatusIcon = statusIcons[order.status] || Package;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/admin/orders')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <div className="text-sm text-gray-500">{order._id}</div>
        </div>
      </div>

      {/* Order Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {order.status}
              </span>
            </div>
            <StatusIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</div>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Order Date</div>
              <div className="text-sm font-medium text-gray-900">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</div>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Items</div>
              <div className="text-xl font-bold text-gray-900">{order.items?.length || 0}</div>
            </div>
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-medium text-gray-900">{order.customerName}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium text-gray-900">{order.customerPhone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-gray-900">{it.title || it.productId}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{it.size || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{it.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(it.price)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency((it.price * it.quantity))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-200">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-900">Subtotal</td>
                <td colSpan={2} className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(order.subtotal)}</td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-gray-500">Discount</td>
                  <td colSpan={2} className="px-4 py-3 text-right text-red-600">-{formatCurrency(order.discount)}</td>
                </tr>
              )}
              {order.tax > 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-gray-500">Tax</td>
                  <td colSpan={2} className="px-4 py-3 text-right text-gray-900">{formatCurrency(order.tax)}</td>
                </tr>
              )}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">Total</td>
                <td colSpan={2} className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Status Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleStatus('confirmed')}
            disabled={order.status === 'cancelled' || order.status === 'delivered'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => handleStatus('packed')}
            disabled={order.status === 'cancelled' || order.status === 'delivered' || order.status === 'pending'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Packed
          </button>
          <button
            onClick={() => handleStatus('shipped')}
            disabled={order.status === 'cancelled' || order.status === 'delivered' || order.status === 'pending' || order.status === 'confirmed'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Shipped
          </button>
          <button
            onClick={() => handleStatus('delivered')}
            disabled={order.status === 'cancelled' || order.status === 'delivered' || order.status === 'pending' || order.status === 'confirmed'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Delivered
          </button>
          <button
            onClick={() => handleStatus('cancelled')}
            disabled={order.status === 'cancelled' || order.status === 'delivered'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
