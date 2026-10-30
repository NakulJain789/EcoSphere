import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Skeleton from './common/Skeleton';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Skeleton className="h-40 max-w-md mx-auto rounded-2xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
