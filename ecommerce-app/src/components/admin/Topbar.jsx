import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Bell, ChevronRight } from 'lucide-react';

export default function Topbar({ onMenuClick, sidebarOpen }) {
  const location = useLocation();
  const { user } = useAuth();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path) => {
    const nameMap = {
      admin: 'Admin', dashboard: 'Dashboard', products: 'Products', new: 'New Product',
      view: 'View', edit: 'Edit', categories: 'Categories', brands: 'Brands',
      inventory: 'Inventory', orders: 'Orders', invoices: 'Invoices', invoice: 'Invoice',
      reports: 'Reports', revenue: 'Revenue', sales: 'Sales', 'low-stock': 'Low Stock',
      staff: 'Staff Management', settings: 'Settings'
    };
    return nameMap[path] || path;
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 flex-shrink-0">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="p-2 mr-3 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <button onClick={onMenuClick} className="p-2 mr-3 text-gray-600 hover:bg-gray-100 rounded-lg hidden lg:block">
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex-1 flex items-center text-sm overflow-x-auto">
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <React.Fragment key={`${name}-${index}`}>
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />}
                {isLast ? (
                  <span className="text-gray-900 font-medium whitespace-nowrap">{getBreadcrumbName(name)}</span>
                ) : (
                  <Link to={routeTo} className="text-gray-500 hover:text-gray-700 whitespace-nowrap">{getBreadcrumbName(name)}</Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3 ml-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-gray-900">{user?.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
