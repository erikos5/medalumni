import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../layout/Spinner';

const Profiles = () => {
  const location = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    school: '',
    graduationYear: ''
  });

  useEffect(() => {
    // Check for query parameters in URL
    const queryParams = new URLSearchParams(location.search);
    const schoolId = queryParams.get('school');
    
    if (schoolId) {
      console.log('School ID from URL:', schoolId);
      setFilter(prevFilter => ({
        ...prevFilter,
        school: schoolId
      }));
    }
    
    const getProfiles = async () => {
      try {
        console.log('Fetching profiles...');
        const res = await api.get('/api/profiles');
        console.log('Profiles response:', res.data);
        
        // Filter only approved profiles for public view
        const approvedProfiles = res.data.filter(
          profile => profile.status === 'approved'
        );
        console.log('Approved profiles count:', approvedProfiles.length);
        setProfiles(approvedProfiles);
        return approvedProfiles;
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load alumni profiles. Please try again later.');
        return [];
      }
    };

    const getSchools = async () => {
      try {
        console.log('Fetching schools...');
        const res = await api.get('/api/schools');
        console.log('Schools response:', res.data);
        setSchools(res.data);
        return res.data;
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError('Failed to load school information. Please try again later.');
        return [];
      }
    };

    Promise.all([getProfiles(), getSchools()])
      .then(([profilesData, schoolsData]) => {
        console.log('Data loading complete:', { profilesCount: profilesData.length, schoolsCount: schoolsData.length });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error in Promise.all:', err);
        setLoading(false);
        setError('Something went wrong. Please try again later.');
      });
  }, [location.search]);

  const { school, graduationYear } = filter;

  const onChange = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilter({
      school: '',
      graduationYear: ''
    });
  };

  // Filtering profiles
  const filteredProfiles = profiles.filter(profile => {
    let matchesSchool = true;
    let matchesYear = true;

    if (school && school !== '') {
      // Handle possible null values and type checking
      const profileSchoolId = profile.school && profile.school._id ? profile.school._id : null;
      matchesSchool = profileSchoolId === school;
    }

    if (graduationYear && graduationYear !== '') {
      // Handle possible null values and type checking
      const profileYear = profile.graduationYear ? profile.graduationYear.toString() : null;
      matchesYear = profileYear === graduationYear;
    }

    return matchesSchool && matchesYear;
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="container">
        <h1 className="large text-primary">Alumni Directory</h1>
        <div className="alert alert-danger">{error}</div>
        <p>
          <Link to="/" className="btn btn-light">
            <i className="fas fa-arrow-left"></i> Return to Home
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Alumni Directory</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i> Connect with other Mediterranean College alumni
      </p>

      <div className="profiles-filter bg-light p-2 my-2">
        <h4>Search Filters</h4>
        <div className="form">
          <div className="form-group">
            <select name="school" value={school} onChange={onChange}>
              <option value="">All Schools</option>
              {schools.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Graduation Year"
              name="graduationYear"
              value={graduationYear}
              onChange={onChange}
            />
          </div>
          <button onClick={resetFilters} className="btn btn-light">
            Reset Filters
          </button>
        </div>
      </div>

      <div className="profiles">
        {profiles.length === 0 ? (
          <div className="no-profiles">
            <h4>No alumni profiles found in the system</h4>
            <p>The alumni directory only displays approved profiles. Please check back later as more alumni join the platform.</p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          filteredProfiles.map(profile => (
            <div key={profile._id} className="profile bg-light">
              <div>
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt=""
                    className="round-img"
                  />
                ) : (
                  <i className="fas fa-user fa-4x"></i>
                )}
              </div>
              <div>
                <h2>{profile.user && profile.user.name ? profile.user.name : 'Alumni'}</h2>
                <p>
                  {profile.currentPosition || 'Alumni'}{' '}
                  {profile.company && <span> at {profile.company}</span>}
                </p>
                <p>{profile.location && <span>{profile.location}</span>}</p>
                <p>School: {profile.school && profile.school.name ? profile.school.name : 'Unknown School'}</p>
                <p>Graduation Year: {profile.graduationYear || 'Not specified'}</p>
                <Link to={`/profile/${profile.user && profile.user._id ? profile.user._id : '404'}`} className="btn btn-primary">
                  View Profile
                </Link>
              </div>

              <ul>
                {profile.skills && profile.skills.length > 0 ? (
                  <>
                    {profile.skills.slice(0, 4).map((skill, index) => (
                      <li key={index} className="text-primary">
                        <i className="fas fa-check"></i> {skill}
                      </li>
                    ))}
                    {profile.skills.length > 4 && (
                      <li className="text-primary">
                        <i className="fas fa-ellipsis-h"></i> and {profile.skills.length - 4} more
                      </li>
                    )}
                  </>
                ) : (
                  <li className="text-primary">
                    <i className="fas fa-info-circle"></i> No skills listed
                  </li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <div className="no-profiles">
            <h4>No profiles found based on the selected filters</h4>
            <p>Try adjusting your search criteria or check back later for more alumni profiles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles; 