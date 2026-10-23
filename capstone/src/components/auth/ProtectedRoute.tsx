import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ApiService } from '../../services/api';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: 'CAREGIVER' | 'PATIENT';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const isAuth = ApiService.isAuthenticated();
  const user = ApiService.getCurrentUser();
  const userRole = user?.role;

  if (!isAuth) {
    if (requiredRole === 'PATIENT') {
      return <Navigate to="/patient/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/caregiver/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'CAREGIVER' && userRole === 'PATIENT') {
    // Patient cannot access caregiver area
    return <Navigate to="/player" state={{ forbiddenNotice: 'Caregiver management hub is restricted to authorized caregivers.' }} replace />;
  }

  return children;
};

export default ProtectedRoute;
