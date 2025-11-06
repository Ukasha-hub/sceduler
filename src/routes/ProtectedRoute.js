import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./index";

const useAuth = () => {
  // ✅ Real authentication check
  const token = localStorage.getItem("token"); 
  return !!token; // true if token exists, false otherwise
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    // ✅ redirect to login when user is not authenticated
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
