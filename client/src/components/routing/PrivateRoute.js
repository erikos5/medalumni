import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({ component: Component }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, getUser } = authContext;

  useEffect(() => {
    // Try to load user if not already authenticated
    if (!isAuthenticated && !loading) {
      console.log('PrivateRoute: Not authenticated, attempting to load user');
      getUser();
    }
  }, [isAuthenticated, loading, getUser]);

  // Debug states
  console.log('PrivateRoute - Authentication state:', { isAuthenticated, loading });

  if (loading) {
    console.log('PrivateRoute: Loading...');
    return <Spinner />;
  }

  if (isAuthenticated) {
    console.log('PrivateRoute: User is authenticated, rendering component');
    return <Component />;
  } else {
    console.log('PrivateRoute: User is not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute; 