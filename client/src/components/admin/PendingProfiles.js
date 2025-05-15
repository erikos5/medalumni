import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import Spinner from '../layout/Spinner';

// Mock data for development
const mockPendingProfiles = [
  {
    _id: 'profile1',
    user: {
      _id: 'user1',
      name: 'George Papadopoulos'
    },
    school: { name: 'School of Computer Science' },
    graduationYear: 2022,
    degree: 'BSc in Computer Science'
  },
  {
    _id: 'profile2',
    user: {
      _id: 'user2',
      name: 'Maria Ioannou'
    },
    school: { name: 'School of Business Administration' },
    graduationYear: 2023,
    degree: 'BA in Business Administration'
  }
];

const PendingProfiles = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user, loading } = authContext;
  const { setAlert } = alertContext;

  const [pendingProfiles, setPendingProfiles] = useState([]);

  const loadPendingProfiles = async () => {
    try {
      // For development, load mock data
      setPendingProfiles(mockPendingProfiles);
      
      // When backend is available:
      // const res = await api.get('/api/profiles');
      // const pending = res.data.filter(profile => profile.status === 'pending');
      // setPendingProfiles(pending);
    } catch (err) {
      setAlert('Error loading profiles', 'danger');
    }
  };

  useEffect(() => {
    loadPendingProfiles();
    // eslint-disable-next-line
  }, []);

  const approveProfile = async (id) => {
    try {
      // For development, just remove from local state
      setPendingProfiles(pendingProfiles.filter(profile => profile._id !== id));
      setAlert('Profile approved successfully', 'success');
      
      // When backend is available:
      // await api.put(`/api/profiles/approve/${id}`);
      // loadPendingProfiles();
    } catch (err) {
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
        {pendingProfiles.length === 0 ? (
          <p>There are no pending profiles for approval.</p>
        ) : (
          <div className="pending-profiles">
            {pendingProfiles.map(profile => (
              <div key={profile._id} className="profile bg-light p-2 my-1">
                <div>
                  <h2>{profile.user.name}</h2>
                  <p>School: {profile.school.name}</p>
                  <p>Graduation Year: {profile.graduationYear}</p>
                  <p>Degree: {profile.degree}</p>
                </div>
                <div>
                  <Link to={`/profile/${profile.user._id}`} className="btn btn-primary">
                    <i className="fas fa-eye"></i> View Profile
                  </Link>
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