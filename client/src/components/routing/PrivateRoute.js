import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({ component: Component }) => {
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

  if (isAuthenticated) {
    return <Component />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute; 