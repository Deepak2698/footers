import React from 'react';
// Using lightweight layout to avoid MUI dependency
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';
import DashboardCards from '../components/admin/DashboardCards';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import InventorySummary from '../components/admin/InventorySummary';
import { useQuery } from '@tanstack/react-query';
import { getOwnerDashboard } from '../services/dashboardService';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery('ownerDashboard', getOwnerDashboard, { retry: false });

  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 min-h-screen">
        <Topbar />
        <main className="p-6">
          {isLoading ? (
            <div className="py-20 text-center">Loading dashboard...</div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <DashboardCards data={data} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-2">
                  <RecentOrdersTable orders={data?.recentOrders || []} />
                </div>
                <div>
                  <InventorySummary items={data?.lowStock || []} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
