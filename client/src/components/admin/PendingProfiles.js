import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import Spinner from '../layout/Spinner';
import api from '../../utils/api';

// Remove mock data
const PendingProfiles = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user, loading } = authContext;
  const { setAlert } = alertContext;

  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadPendingProfiles = async () => {
    try {
      setProfileLoading(true);
      console.log('Fetching profiles from API...');
      const res = await api.get('/api/profiles');
      console.log('Profiles response:', res.data);
      
      // Filter only pending profiles
      const pending = res.data.filter(profile => profile.status === 'pending');
      console.log('Pending profiles found:', pending.length);
      setPendingProfiles(pending);
    } catch (err) {
      console.error('Error loading profiles:', err);
      setAlert('Error loading profiles', 'danger');
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadPendingProfiles();
    // eslint-disable-next-line
  }, []);

  const approveProfile = async (id) => {
    try {
      console.log('Approving profile:', id);
      await api.put(`/api/profiles/approve/${id}`);
      setAlert('Profile approved successfully', 'success');
      
      // Reload profiles to get the updated list
      loadPendingProfiles();
    } catch (err) {
      console.error('Error approving profile:', err);
      setAlert('Error approving profile', 'danger');
    }
  };

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Pending Profiles for Approval</h1>
      <p className="lead">
        <i className="fas fa-user-shield"></i> Manage alumni profile requests
      </p>

      <div className="dash-buttons">
        <Link to="/admin-dashboard" className="btn">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
        <Link to="/admin/schools" className="btn">
          <i className="fas fa-university"></i> Manage Schools
        </Link>
      </div>

      <div className="admin-section my-2">
        {profileLoading ? (
          <Spinner />
        ) : pendingProfiles.length === 0 ? (
          <p>There are no pending profiles for approval.</p>
        ) : (
          <div className="pending-profiles">
            {pendingProfiles.map(profile => (
              <div key={profile._id} className="profile bg-light p-2 my-1">
                <div>
                  <h2>{profile.user && profile.user.name ? profile.user.name : 'Unnamed User'}</h2>
                  <p>School: {profile.school && profile.school.name ? profile.school.name : 'Unknown School'}</p>
                  <p>Graduation Year: {profile.graduationYear}</p>
                  <p>Degree: {profile.degree || 'Not specified'}</p>
                </div>
                <div>
                  {profile.user && profile.user._id && (
                    <Link to={`/profile/${profile.user._id}`} className="btn btn-primary">
                      <i className="fas fa-eye"></i> View Profile
                    </Link>
                  )}
                  <button
                    onClick={() => approveProfile(profile._id)}
                    className="btn btn-success"
                  >
                    <i className="fas fa-check"></i> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingProfiles; 