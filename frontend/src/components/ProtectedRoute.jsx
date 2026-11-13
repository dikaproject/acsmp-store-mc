import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { isTokenExpired, SESSION_EXPIRED_MESSAGE, SESSION_EXPIRED_TOAST_ID } from "../lib/auth";

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
  const { isUserLoggedIn, checkPlayerSession } = useAuthStore();
  const location = useLocation();

  // The persisted login flag outlives the JWT, so check the token too
  const hasValidSession = isUserLoggedIn && !isTokenExpired(localStorage.getItem("token"));

  useEffect(() => {
    // Logged in on paper but the token is gone/expired: clear it and explain why
    if (isUserLoggedIn && !hasValidSession) {
      checkPlayerSession();
      toast(SESSION_EXPIRED_MESSAGE, { id: SESSION_EXPIRED_TOAST_ID });
    }
  }, [isUserLoggedIn, hasValidSession, checkPlayerSession]);

  if (!hasValidSession) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};