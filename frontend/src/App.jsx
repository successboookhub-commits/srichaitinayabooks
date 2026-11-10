import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import FloatingActions from './components/FloatingActions';
import ScrollToTop from './components/ScrollToTop';

// Critical Customer Home Page (Eager for instant 0ms mount)
import Home from './pages/Home';

// Secondary Customer Pages (Lazy Loaded on Demand)
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Publications = lazy(() => import('./pages/Publications'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Pages (100% Lazy Loaded - 0 KB impact on customer site)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminPublications = lazy(() => import('./pages/admin/AdminPublications'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

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

// Fallback skeleton loader
function PageLoadingFallback() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-slate-400 font-bold tracking-wide">Loading Sri Chaitanya Books...</span>
    </div>
  );
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
      <WishlistDrawer />
      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          {children}
        </Suspense>
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
      <Suspense fallback={<PageLoadingFallback />}>
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
      </Suspense>
    </>
  );
}
