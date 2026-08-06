import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';
import About from './pages/About';
import Contact from './pages/Contact';
import Featured from './pages/Featured';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import DashboardOwner from './pages/DashboardOwner';
import DashboardStaff from './pages/DashboardStaff';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import ProductsList from './pages/admin/ProductsList';
import ProductForm from './pages/admin/ProductForm';
import AdminProductView from './pages/admin/AdminProductView';
import OrdersList from './pages/admin/OrdersList';
import OrderDetails from './pages/admin/OrderDetails';
import Inventory from './pages/admin/Inventory';
import Invoice from './pages/admin/Invoice';
import Register from './pages/Register';
import Categories from './pages/admin/Categories';
import Brands from './pages/admin/Brands';
import ReportsRevenue from './pages/admin/ReportsRevenue';
import ReportsSales from './pages/admin/ReportsSales';
import ReportsLowStock from './pages/admin/ReportsLowStock';
import StaffManagement from './pages/admin/StaffManagement';
import Settings from './pages/admin/Settings';

function ShopLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminDashboardRoute() {
  const { user } = useAuth();
  return user?.role === 'owner' ? <DashboardOwner /> : <DashboardStaff />;
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
            <Routes>
          {/* Admin ERP — no shop header/footer */}
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboardRoute />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/view/:id" element={<AdminProductView />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="invoices" element={<Invoice />} />
            <Route path="invoice/:orderId" element={<Invoice />} />
            <Route path="reports/revenue" element={<ProtectedRoute roles={['owner']}><ReportsRevenue /></ProtectedRoute>} />
            <Route path="reports/sales" element={<ProtectedRoute roles={['owner']}><ReportsSales /></ProtectedRoute>} />
            <Route path="reports/low-stock" element={<ProtectedRoute roles={['owner']}><ReportsLowStock /></ProtectedRoute>} />
            <Route path="staff" element={<ProtectedRoute roles={['owner']}><StaffManagement /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute roles={['owner']}><Settings /></ProtectedRoute>} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Auth pages — standalone */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/dashboard/owner" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard/staff" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Public storefront */}
          <Route element={<ShopLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/featured" element={<Featured />} />
          </Route>
        </Routes>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
