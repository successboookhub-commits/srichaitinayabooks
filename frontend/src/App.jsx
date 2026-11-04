import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingActions from './components/FloatingActions';
import ScrollToTop from './components/ScrollToTop';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import Publications from './pages/Publications';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPublications from './pages/admin/AdminPublications';
import AdminBanners from './pages/admin/AdminBanners';
import AdminUsers from './pages/admin/AdminUsers';

// Auth Guard
import useAuthStore from './store/useAuthStore';

// Protected Admin Route
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

// Customer Layout Wrapper
function CustomerLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.search]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public Storefront Routes */}
      <Route
        path="/"
        element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        }
      />
      <Route
        path="/shop"
        element={
          <CustomerLayout>
            <Shop />
          </CustomerLayout>
        }
      />
      <Route
        path="/publications"
        element={
          <CustomerLayout>
            <Publications />
          </CustomerLayout>
        }
      />
      <Route
        path="/about"
        element={
          <CustomerLayout>
            <About />
          </CustomerLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <CustomerLayout>
            <Contact />
          </CustomerLayout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <CustomerLayout>
            <ProductDetail />
          </CustomerLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <CustomerLayout>
            <Checkout />
          </CustomerLayout>
        }
      />
      <Route
        path="/order-success"
        element={
          <CustomerLayout>
            <OrderSuccess />
          </CustomerLayout>
        }
      />
      <Route
        path="/tracking"
        element={
          <CustomerLayout>
            <OrderTracking />
          </CustomerLayout>
        }
      />
      <Route
        path="/track"
        element={
          <CustomerLayout>
            <OrderTracking />
          </CustomerLayout>
        }
      />
      <Route
        path="/track-order"
        element={
          <CustomerLayout>
            <OrderTracking />
          </CustomerLayout>
        }
      />
      <Route
        path="/order-history"
        element={
          <CustomerLayout>
            <OrderTracking />
          </CustomerLayout>
        }
      />

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="publications" element={<AdminPublications />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="admins" element={<AdminUsers />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
