import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// For Admin Routes
export const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuthStore();
  const location = useLocation();

  if (!isAdmin()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

// For User Routes (Shop, Checkout, etc)
export const UserRoute = ({ children }) => {
  const { isUserLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isUserLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};