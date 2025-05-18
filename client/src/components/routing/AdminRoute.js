import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';

const AdminRoute = ({ component: Component }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user, getUser } = authContext;

  useEffect(() => {
    // Only attempt to load user if the token exists but user is not authenticated yet
    if (!isAuthenticated && !loading && localStorage.getItem('token')) {
      getUser();
    }
  }, [isAuthenticated, loading, getUser]);

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated && user && user.role === 'admin') {
    return <Component />;
  } else {
    // If authenticated but not admin, go to regular dashboard
    // If not authenticated, go to login
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />;
  }
};

export default AdminRoute; 