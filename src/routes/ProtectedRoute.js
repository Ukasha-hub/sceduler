import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './index';

// This is a placeholder for authentication logic
// Replace this with your actual authentication check
const useAuth = () => {
  // For demonstration purposes, return true
  // In a real app, this would check your authentication state
  return true; // or false if not authenticated
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    // You would typically redirect to a login route
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
