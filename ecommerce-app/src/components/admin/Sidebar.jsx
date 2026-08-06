import React from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDown, ChevronRight, LayoutGrid, Package, ShoppingCart, FileText, BarChart3, Users, Settings, LogOut } from 'lucide-react';

export default function OwnerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [openSections, setOpenSections] = React.useState({ catalog: true, reports: false });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  React.useEffect(() => {
    if (location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories') || location.pathname.includes('/admin/brands') || location.pathname.includes('/admin/inventory')) {
      setOpenSections(prev => ({ ...prev, catalog: true }));
    }
    if (location.pathname.includes('/admin/reports')) {
      setOpenSections(prev => ({ ...prev, reports: true }));
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); } catch (e) { /* ignore */ }
  };

  const menuItems = [
    { to: '/admin/dashboard', text: 'Dashboard', icon: LayoutGrid },
    {
      section: 'catalog',
      text: 'Catalog',
      icon: Package,
      children: [
        { to: '/admin/products', text: 'Products' },
        { to: '/admin/categories', text: 'Categories' },
        { to: '/admin/brands', text: 'Brands' },
        { to: '/admin/inventory', text: 'Inventory' }
      ]
    },
    { to: '/admin/orders', text: 'Orders', icon: ShoppingCart },
    { to: '/admin/invoices', text: 'Invoices', icon: FileText },
    {
      section: 'reports',
      text: 'Reports',
      icon: BarChart3,
      children: [
        { to: '/admin/reports/revenue', text: 'Revenue' },
        { to: '/admin/reports/sales', text: 'Sales' },
        { to: '/admin/reports/low-stock', text: 'Low Stock' }
      ]
    },
    { to: '/admin/staff', text: 'Staff Management', icon: Users },
    { to: '/admin/settings', text: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-gray-900 h-full flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <img 
            src="/assets/logo.png" 
            alt="Footers" 
            className="h-10 w-auto object-contain"
          />
          <div>
            <div className="text-lg font-semibold text-white">FOOTERS</div>
            <div className="text-xs text-gray-400">ERP Admin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.children) {
              const isOpen = openSections[item.section];
              return (
                <li key={item.section}>
                  <button
                    onClick={() => toggleSection(item.section)}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.text}</span>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {isOpen && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            className={({ isActive }) => `block px-3 py-2 text-sm rounded transition-colors ${isActive ? 'bg-amber-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                          >
                            {child.text}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-amber-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.text}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400 mb-1">Logged in as</div>
        <div className="font-medium text-white mb-3 truncate">{user?.name || user?.email}</div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
