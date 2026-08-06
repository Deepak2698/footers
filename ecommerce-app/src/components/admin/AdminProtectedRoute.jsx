import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProtectedRoute({ requiredRole = null, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: { pathname: '/admin/dashboard' } }} />;

  if (requiredRole && user.role !== requiredRole && user.role !== 'owner') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
