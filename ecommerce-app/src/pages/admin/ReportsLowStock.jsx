import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService';
import { AlertTriangle, Package } from 'lucide-react';

export default function ReportsLowStock() {
  const { data, isLoading } = useQuery({
    queryKey: ['lowStockReport'],
    queryFn: () => getProducts({ limit: 1000 })
  });

  const products = data?.data || [];
  const lowStock = products.filter(p => (p.totalStock ?? 0) <= 5);

  if (isLoading) return <div className="p-6 text-gray-500">Loading low stock report...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Low Stock Report</h1>
        <p className="text-sm text-gray-500 mt-1">Products requiring restock attention</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Low Stock Products</div>
              <div className="text-3xl font-bold text-amber-600 mt-1">{lowStock.length}</div>
            </div>
            <AlertTriangle className="w-10 h-10 text-amber-300" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Out of Stock</div>
              <div className="text-3xl font-bold text-red-600 mt-1">{lowStock.filter(p => p.totalStock === 0).length}</div>
            </div>
            <Package className="w-10 h-10 text-red-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Brand</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lowStock.map(p => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img src={p.images?.[0] || '/assets/VKS_8509.JPG'} alt={p.title} className="w-10 h-10 rounded object-cover mr-3" />
                    <span className="text-sm font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.productCode || '—'}</td>
                <td className="px-6 py-4 text-sm">{p.brand}</td>
                <td className="px-6 py-4 text-sm">{p.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-amber-600">{p.totalStock ?? 0}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${p.totalStock === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {p.totalStock === 0 ? 'Out of Stock' : 'Low Stock'}
                  </span>
                </td>
              </tr>
            ))}
            {lowStock.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">All products are well stocked</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
