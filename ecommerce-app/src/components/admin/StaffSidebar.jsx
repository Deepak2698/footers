import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutGrid, Package, ShoppingCart, FileText, LogOut, Layers } from 'lucide-react';

export default function StaffSidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      // ignore
    }
  };

  const menuItems = [
    { to: '/admin/dashboard', text: 'Dashboard', icon: LayoutGrid },
    { to: '/admin/products', text: 'Products', icon: Package },
    { to: '/admin/inventory', text: 'Inventory', icon: Layers },
    { to: '/admin/orders', text: 'Orders', icon: ShoppingCart },
    { to: '/admin/invoices', text: 'Invoices', icon: FileText }
  ];

  return (
    <aside className="w-64 bg-gray-900 h-full flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <img 
            src="/assets/logo.png" 
            alt="Footers" 
            className="h-10 w-auto object-contain"
          />
          <div>
            <div className="text-lg font-semibold text-white">FOOTERS</div>
            <div className="text-xs text-gray-400">ERP Staff</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-amber-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400 mb-1">Logged in as</div>
        <div className="font-medium text-white mb-3">{user?.name || user?.email}</div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
