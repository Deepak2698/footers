import React from 'react';
import { Package, ShoppingCart, IndianRupee, Layers, AlertTriangle, CalendarDays } from 'lucide-react';

function StatCard({ title, value, icon: Icon, color = 'text-gray-900', bg = 'bg-white' }) {
  return (
    <div className={`${bg} p-5 rounded-lg shadow-sm border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardCards({ data, showRevenue = true }) {
  const totalInventory = data?.inventorySummary?.totalStock ?? data?.totalInventory ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard title="Total Products" value={data?.totalProducts ?? 0} icon={Package} />
      <StatCard title="Total Orders" value={data?.totalOrders ?? 0} icon={ShoppingCart} />
      {showRevenue && (
        <StatCard title="Revenue" value={`₹${(data?.totalRevenue ?? 0).toLocaleString()}`} icon={IndianRupee} color="text-emerald-600" />
      )}
      <StatCard title="Total Inventory" value={totalInventory.toLocaleString()} icon={Layers} />
      <StatCard title="Low Stock" value={data?.lowStock?.length ?? 0} icon={AlertTriangle} color="text-amber-600" />
      <StatCard title="Today's Orders" value={data?.todaysOrders ?? 0} icon={CalendarDays} color="text-blue-600" />
    </div>
  );
}
