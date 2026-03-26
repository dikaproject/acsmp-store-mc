import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import { AdminRoute, UserRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import SessionExpiredModal from "./components/SessionExpiredModal";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import GuidesPage from "./pages/GuidesPage";
import GuideDetailPage from "./pages/GuideDetailPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import VotePage from "./pages/VotePage"; 
import GalleryPagePublic from "./pages/GalleryPage";

// User Protected Pages
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ServerTypesPage from "./pages/admin/ServerTypesPage";
import ProductsPage from "./pages/admin/ProductsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import GuidesPageAdmin from "./pages/admin/GuidesPage";
import GalleryPage from "./pages/admin/GalleryPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminLinktreePage from "./pages/admin/LinktreePage";
import RconPage from "./pages/admin/RconPage";

// Public standalone pages
import LinktreePage from "./pages/LinktreePage";
import SkinPage from "./pages/SkinPage";
import LeaderboardPage from "./pages/LeaderboardPage";

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
        <Route path="/link" element={<LinktreePage />} />

        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="vote" element={<VotePage />} />
          <Route path="gallery" element={<GalleryPagePublic />} /> {/* Add this */}
          <Route path="guides" element={<GuidesPage />} />
          <Route path="guides/:slug" element={<GuideDetailPage />} />
          <Route path="track" element={<TrackOrderPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          
          {/* User Protected Routes */}
          <Route path="shop" element={<UserRoute><ShopPage /></UserRoute>} />
          <Route path="cart" element={<UserRoute><CartPage /></UserRoute>} />
          <Route path="checkout" element={<UserRoute><CheckoutPage /></UserRoute>} />
          <Route path="skin" element={<SkinPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="server-types" element={<ServerTypesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="guides" element={<GuidesPageAdmin />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="linktree" element={<AdminLinktreePage />} />
          <Route path="rcon" element={<RconPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
