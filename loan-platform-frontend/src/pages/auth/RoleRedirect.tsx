import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RoleRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  /*
   * This component should only be reached by
   * authenticated users because /app is protected.
   */

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  switch (user?.role) {

    case 'CUSTOMER':
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );

    case 'ADMIN':
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );

    case 'SUPER_ADMIN':
      return (
        <Navigate
          to="/super-admin/dashboard"
          replace
        />
      );

    default:
      return (
        <Navigate
          to="/unauthorized"
          replace
        />
      );
  }
};