import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { SESSION_EXPIRED_MESSAGE, SESSION_EXPIRED_TOAST_ID } from "./lib/auth";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import { AdminRoute, UserRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import SessionExpiredModal from "./components/SessionExpiredModal";
import PageSuspense from "./components/PageSuspense";

// Pages are code-split: each route downloads only its own JS (and heavy
// libs like TinyMCE, Recharts, three.js stay out of the public pages).
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const GuidesPage = lazy(() => import("./pages/GuidesPage"));
const GuideDetailPage = lazy(() => import("./pages/GuideDetailPage"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const VotePage = lazy(() => import("./pages/VotePage"));
const GalleryPagePublic = lazy(() => import("./pages/GalleryPage"));
const DigitalProductsPage = lazy(() => import("./pages/DigitalProductsPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const ServerTypesPage = lazy(() => import("./pages/admin/ServerTypesPage"));
const ProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
const GuidesPageAdmin = lazy(() => import("./pages/admin/GuidesPage"));
const GalleryPage = lazy(() => import("./pages/admin/GalleryPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const AdminLinktreePage = lazy(() => import("./pages/admin/LinktreePage"));
const RconPage = lazy(() => import("./pages/admin/RconPage"));
const VouchersPage = lazy(() => import("./pages/admin/VouchersPage"));
const AdminLeaderboardPage = lazy(() => import("./pages/admin/LeaderboardPage"));
const DigitalProductsPageAdmin = lazy(() => import("./pages/admin/DigitalProductsPage"));
const LinktreePage = lazy(() => import("./pages/LinktreePage"));
const SkinPage = lazy(() => import("./pages/SkinPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));

// Public Pages

// User Protected Pages

// Admin Pages

// Public standalone pages

function App() {
  const [sessionExpired, setSessionExpired] = useState({
    open: false,
    isAdmin: false,
  });

  useEffect(() => {
    const handler = (e) =>
      setSessionExpired({ open: true, isAdmin: e.detail?.isAdmin ?? false });
    window.addEventListener("session:expired", handler);
    return () => window.removeEventListener("session:expired", handler);
  }, []);

  // Clear a stale player login (persisted flag but expired/missing JWT).
  // Silent on app load; when the user comes back to the tab, tell them why they were logged out.
  useEffect(() => {
    useAuthStore.getState().checkPlayerSession();

    const recheck = () => {
      if (document.visibilityState === "hidden") return;
      const wasLoggedIn = useAuthStore.getState().isUserLoggedIn;
      if (!useAuthStore.getState().checkPlayerSession() && wasLoggedIn) {
        toast(SESSION_EXPIRED_MESSAGE, { id: SESSION_EXPIRED_TOAST_ID });
      }
    };

    window.addEventListener("focus", recheck);
    document.addEventListener("visibilitychange", recheck);
    return () => {
      window.removeEventListener("focus", recheck);
      document.removeEventListener("visibilitychange", recheck);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <SessionExpiredModal
        isOpen={sessionExpired.open}
        onClose={() => setSessionExpired((s) => ({ ...s, open: false }))}
        isAdmin={sessionExpired.isAdmin}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        {/* Standalone pages (no Layout wrapper) */}
        <Route path="/link" element={<PageSuspense><LinktreePage /></PageSuspense>} />

        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="vote" element={<VotePage />} />
          <Route path="gallery" element={<GalleryPagePublic />} /> {/* Add this */}
          <Route path="digital-products" element={<DigitalProductsPage />} />
          <Route path="guides" element={<GuidesPage />} />
          <Route path="guides/:slug" element={<GuideDetailPage />} />
          <Route path="track" element={<TrackOrderPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          
          {/* User Protected Routes */}
          <Route path="shop" element={<UserRoute><ShopPage /></UserRoute>} />
          <Route path="cart" element={<UserRoute><CartPage /></UserRoute>} />
          <Route path="checkout" element={<UserRoute><CheckoutPage /></UserRoute>} />
          <Route path="my-orders" element={<UserRoute><MyOrdersPage /></UserRoute>} />
          <Route path="skin" element={<SkinPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<PageSuspense><AdminLoginPage /></PageSuspense>} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="server-types" element={<ServerTypesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="digital-products" element={<DigitalProductsPageAdmin />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="guides" element={<GuidesPageAdmin />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="linktree" element={<AdminLinktreePage />} />
          <Route path="rcon" element={<RconPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="leaderboard" element={<AdminLeaderboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
