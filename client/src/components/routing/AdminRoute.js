import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';

const AdminRoute = ({ component: Component }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user, getUser } = authContext;

  useEffect(() => {
    // Try to load user if not already authenticated
    if (!isAuthenticated && !loading) {
      console.log('AdminRoute: Not authenticated, attempting to load user');
      getUser();
    }
  }, [isAuthenticated, loading, getUser]);

  // Debug states
  console.log('AdminRoute - Authentication state:', { isAuthenticated, loading, user });

  if (loading || !user) {
    console.log('AdminRoute: Loading or user not loaded...');
    return <Spinner />;
  }

  if (isAuthenticated && user && user.role === 'admin') {
    console.log('AdminRoute: User is admin, rendering component');
    return <Component />;
  } else {
    console.log('AdminRoute: User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" />;
  }
};

export default AdminRoute; 