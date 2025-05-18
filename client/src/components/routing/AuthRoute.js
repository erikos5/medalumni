import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';

// AuthRoute is used for routes that should only be accessible to authenticated users
// Similar to PrivateRoute but can be customized for visitor access levels if needed
const AuthRoute = ({ component: Component, requireAuth = true }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, getUser } = authContext;

  useEffect(() => {
    // Only attempt to load user if the token exists but user is not authenticated yet
    if (!isAuthenticated && !loading && localStorage.getItem('token')) {
      getUser();
    }
  }, [isAuthenticated, loading, getUser]);

  if (loading) {
    return <Spinner />;
  }

  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Otherwise, render the component
  return <Component />;
};

export default AuthRoute; 