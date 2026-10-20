import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, allowedRole, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/my-leaves';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
