import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function InventorySummary({ items = [] }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Low Stock Products</h3>
        </div>
        <Link to="/admin/inventory" className="text-sm text-amber-600 hover:text-amber-700">View all</Link>
      </div>
      <ul className="space-y-3">
        {items.length === 0 && <li className="text-gray-500 text-sm">No low stock items</li>}
        {items.map((it) => (
          <li key={it._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-900">{it.title || it.name}</span>
            <span className="text-sm font-medium text-amber-600">{it.totalStock ?? it.stock ?? 0} units</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
