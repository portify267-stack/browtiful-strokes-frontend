import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import Shop from './pages/Shop';

// Policy pages (Lazy loaded to reduce initial customer bundle)
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const ShippingDeliveryPolicy = lazy(() => import('./pages/ShippingDeliveryPolicy'));
const CancellationRefundPolicy = lazy(() => import('./pages/CancellationRefundPolicy'));

// Admin Imports (Lazy Loaded to optimize bundle size for customers)
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'));
const AdminProductForm = lazy(() => import('./admin/pages/AdminProductForm'));
const AdminCategories = lazy(() => import('./admin/pages/AdminCategories'));
const AdminOrders = lazy(() => import('./admin/pages/AdminOrders'));
const AdminOrderDetails = lazy(() => import('./admin/pages/AdminOrderDetails'));
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
import ProtectedAdminRoute from './admin/routes/ProtectedAdminRoute';

import './App.css';

/**
 * Customer Layout Wrapper: Renders Customer Header & Footer ONLY for customer routes.
 */
function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-cream text-charcoal">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

// Loading indicator for code-split admin chunks
const AdminLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-forest bg-cream">
    <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-forest"></div>
  </div>
);

// Auto-open cart drawer when hitting /cart directly
const CartRoute = () => {
  const { openCart } = useCart();
  React.useEffect(() => {
    openCart();
  }, [openCart]);
  return <Home />;
};

function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Website Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/products" element={<Navigate to="/shop" replace />} />
              <Route path="/cart" element={<CartRoute />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/shipping-delivery-policy" element={<ShippingDeliveryPolicy />} />
              <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={
              <Suspense fallback={<AdminLoading />}>
                <AdminLogin />
              </Suspense>
            } />

            {/* Protected Admin Panel Routes */}
            <Route element={<ProtectedAdminRoute />}>
              <Route element={
                <Suspense fallback={<AdminLoading />}>
                  <AdminLayout />
                </Suspense>
              }>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/new" element={<AdminProductForm />} />
                <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
              </Route>
            </Route>

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;
