import React, { Suspense, lazy } from 'react';
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
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Register from './pages/Register';

// The admin ERP (dashboards, reports, invoices, staff management, product forms) is
// only ever needed by logged-in staff/owners, not the public storefront visitors who
// make up the vast majority of traffic. Lazy-load it as its own chunk so a customer
// browsing products never downloads admin-only code.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const DashboardOwner = lazy(() => import('./pages/DashboardOwner'));
const DashboardStaff = lazy(() => import('./pages/DashboardStaff'));
const ProductsList = lazy(() => import('./pages/admin/ProductsList'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));
const AdminProductView = lazy(() => import('./pages/admin/AdminProductView'));
const OrdersList = lazy(() => import('./pages/admin/OrdersList'));
const OrderDetails = lazy(() => import('./pages/admin/OrderDetails'));
const Inventory = lazy(() => import('./pages/admin/Inventory'));
const Invoice = lazy(() => import('./pages/admin/Invoice'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const ReportsRevenue = lazy(() => import('./pages/admin/ReportsRevenue'));
const ReportsSales = lazy(() => import('./pages/admin/ReportsSales'));
const ReportsLowStock = lazy(() => import('./pages/admin/ReportsLowStock'));
const StaffManagement = lazy(() => import('./pages/admin/StaffManagement'));
const Settings = lazy(() => import('./pages/admin/Settings'));

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

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen bg-black-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
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
          {/* Admin ERP — no shop header/footer. Lazy-loaded as its own bundle chunk. */}
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              <Suspense fallback={<AdminLoadingFallback />}>
                <AdminLayout />
              </Suspense>
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
            <Route path="*" element={<NotFound />} />
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
