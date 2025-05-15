import React, { useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import Spinner from '../layout/Spinner';
import DashboardMenu from './DashboardMenu';

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user, loading, getUser } = authContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    // Verify user is loaded
    if (!user) {
      getUser();
    }
    // eslint-disable-next-line
  }, []);

  // Debug user state
  console.log('Dashboard - User state:', user);
  console.log('Dashboard - Loading state:', loading);

  if (loading || !user) {
    return <Spinner />;
  }

  // Redirect admin users to admin dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/admin-dashboard" />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>

      <DashboardMenu />

      <div className="dash-buttons">
        <Link to="/edit-profile" className="btn btn-primary">
          <i className="fas fa-user-circle"></i> Edit Profile
        </Link>
      </div>

      <div className="my-2">
        <p>Account status: <strong>{user && user.role === 'appliedAlumni' ? 'Pending' : 'Approved'}</strong></p>
        
        {user && user.role === 'appliedAlumni' && (
          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i> Your profile is pending approval. Once approved, you will have full access to the platform's features.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 