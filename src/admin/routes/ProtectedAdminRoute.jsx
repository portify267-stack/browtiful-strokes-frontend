import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, clearAdminSession } from '../utils/adminAuth';
import { useToast } from '../../context/ToastContext';

const ProtectedAdminRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAdminAuthenticated();
      setIsAuthenticated(auth);
      if (!auth) {
        showToast('Session expired or unauthorized. Please log in.', 'error');
      }
    };

    const handleUnauthorized = () => {
      clearAdminSession();
      setIsAuthenticated(false);
      showToast('Session expired. Please log in again.', 'error');
      navigate('/admin/login', { replace: true });
    };

    window.addEventListener('admin:unauthorized', handleUnauthorized);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('admin:unauthorized', handleUnauthorized);
      window.removeEventListener('storage', checkAuth);
    };
  }, [navigate, showToast]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
