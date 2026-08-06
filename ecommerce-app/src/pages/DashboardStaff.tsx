import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import DashboardCards from '../components/admin/DashboardCards';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import InventorySummary from '../components/admin/InventorySummary';
import api from '../services/api';

const DashboardStaff: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['staffDashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/staff');
      return res.data;
    },
    retry: false
  });

  const dashboardData = data?.data;

  if (isLoading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 rounded-lg">Error loading dashboard. Please try again.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Staff operations overview</p>
        </div>
        <div className="text-sm text-gray-500">Welcome, {user?.name}</div>
      </div>

      <DashboardCards data={dashboardData} showRevenue={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h2>
          <RecentOrdersTable orders={dashboardData?.recentOrders} />
        </div>
        <div>
          <InventorySummary items={dashboardData?.lowStock} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStaff;
