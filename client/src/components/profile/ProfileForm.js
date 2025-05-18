import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import Spinner from '../layout/Spinner';

const ProfileForm = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { loading } = authContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    school: '',
    graduationYear: '',
    degree: '',
    bio: '',
    location: '',
    currentPosition: '',
    company: '',
    website: '',
    skills: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    profileImage: ''
  });

  const [schools, setSchools] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    school,
    graduationYear,
    degree,
    bio,
    location,
    currentPosition,
    company,
    website,
    skills,
    linkedin,
    twitter,
    facebook,
    instagram,
    profileImage
  } = formData;

  useEffect(() => {
    const getSchools = async () => {
      try {
        const res = await api.get('/api/schools');
        setSchools(res.data);
      } catch (err) {
        setAlert('Error loading schools', 'danger');
      }
    };

    const getCurrentProfile = async () => {
      try {
        const res = await api.get('/api/profiles/me');
        setProfile(res.data);

        setFormData({
          school: res.data.school._id,
          graduationYear: res.data.graduationYear,
          degree: res.data.degree,
          bio: res.data.bio || '',
          location: res.data.location || '',
          currentPosition: res.data.currentPosition || '',
          company: res.data.company || '',
          website: res.data.website || '',
          skills: res.data.skills ? res.data.skills.join(', ') : '',
          linkedin: res.data.social?.linkedin || '',
          twitter: res.data.social?.twitter || '',
          facebook: res.data.social?.facebook || '',
          instagram: res.data.social?.instagram || '',
          profileImage: res.data.profileImage || ''
        });
      } catch (err) {
        if (err.response && err.response.status === 400) {
          // No profile exists
          setProfile(null);
        } else {
          setAlert('Error loading profile', 'danger');
        }
      }
      setIsLoading(false);
    };

    getSchools();
    getCurrentProfile();
  }, [setAlert]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/api/profiles', formData);
      setAlert('Profile updated successfully', 'success');
      if (!profile) {
        // If it's a new profile, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setAlert('Error saving profile', 'danger');
    }
  };

  if (loading || isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">
        {profile ? 'Edit Profile' : 'Create Profile'}
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i>{' '}
        {profile
          ? 'Update your profile information'
          : 'Add information to your profile'}
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <select
            name="school"
            value={school}
            onChange={onChange}
            required
          >
            <option value="">* Select School</option>
            {schools.map(s => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="* Graduation Year"
            name="graduationYear"
            value={graduationYear}
            onChange={onChange}
            required
            min="1950"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree"
            name="degree"
            value={degree}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Short Biography"
            name="bio"
            value={bio}
            onChange={onChange}
          ></textarea>
          <small className="form-text">Tell us about yourself</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
          />
          <small className="form-text">
            City & Country (e.g. Athens, Greece)
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Current Position"
            name="currentPosition"
            value={currentPosition}
            onChange={onChange}
          />
          <small className="form-text">Your professional position</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={onChange}
          />
          <small className="form-text">The company you work for</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={onChange}
          />
          <small className="form-text">
            Your personal website or your company's website
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Skills"
            name="skills"
            value={skills}
            onChange={onChange}
          />
          <small className="form-text">
            Use commas to separate your skills (e.g. HTML, CSS, JavaScript)
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Profile Image (URL)"
            name="profileImage"
            value={profileImage}
            onChange={onChange}
          />
          <small className="form-text">URL for your profile image</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="LinkedIn URL"
            name="linkedin"
            value={linkedin}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Twitter URL"
            name="twitter"
            value={twitter}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Facebook URL"
            name="facebook"
            value={facebook}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Instagram URL"
            name="instagram"
            value={instagram}
            onChange={onChange}
          />
        </div>

        <input type="submit" className="btn btn-primary my-1" value="Save" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Back
        </Link>
      </form>
    </div>
  );
};

export default ProfileForm; 