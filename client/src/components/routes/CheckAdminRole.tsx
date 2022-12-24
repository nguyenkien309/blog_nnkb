import React from 'react';
import { useAppSelector, useAuth } from '../../hooks';
import { Navigate, Outlet } from 'react-router-dom';

const CheckAdminRole = () => {
  const { role, token } = useAuth();
  if (token && role === 'ADMIN') {
    return <Outlet />;
  }
  return <Navigate to={'/'} />;
};

export default CheckAdminRole;
