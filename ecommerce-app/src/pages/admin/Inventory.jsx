import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService';
import { Search, AlertTriangle, Package, Layers } from 'lucide-react';

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['inventory', search, category, brand],
    queryFn: () => getProducts({ search, category, brand, limit: 1000 }),
    retry: false
  });

  const products = data?.data || [];

  // Flatten inventory data
  const rows = [];
  for (const p of products) {
    for (const s of (p.sizes || [])) {
      rows.push({
        _id: p._id,
        productCode: p.productCode,
        title: p.title,
        image: p.images?.[0],
        brand: p.brand,
        category: p.category,
        size: s.size,
        qty: s.stock,
        isActive: p.isActive
      });
    }
  }

  // Filter rows based on stock filter
  const filteredRows = rows.filter(r => {
    if (stockFilter === 'low') return r.qty <= 5;
    if (stockFilter === 'out') return r.qty === 0;
    return true;
  });

  const lowStockCount = rows.filter(r => r.qty <= 5).length;
  const outOfStockCount = rows.filter(r => r.qty === 0).length;
  const totalStock = rows.reduce((sum, r) => sum + r.qty, 0);

  if (isLoading) return <div className="p-6">Loading inventory...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading inventory</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total SKUs</div>
              <div className="text-2xl font-bold text-gray-900">{rows.length}</div>
            </div>
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Stock</div>
              <div className="text-2xl font-bold text-gray-900">{totalStock}</div>
            </div>
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Low Stock</div>
              <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Out of Stock</div>
              <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock (≤5)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRows.map((r, i) => (
                <tr key={`${r._id}-${r.size}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={r.image || '/assets/VKS_8509.JPG'} alt={r.title} className="w-10 h-10 object-cover rounded" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{r.title}</div>
                        {!r.isActive && <div className="text-xs text-red-500">Inactive</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.productCode || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{r.size}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">{r.qty}</td>
                  <td className="px-6 py-4">
                    {r.qty === 0 ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Out of Stock</span>
                    ) : r.qty <= 5 ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">Low Stock</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No inventory items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
