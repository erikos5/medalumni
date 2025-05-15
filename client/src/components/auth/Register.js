import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';

const Register = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { register, error, clearErrors, isAuthenticated } = authContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'appliedAlumni'
  });

  const { name, email, password, password2, role } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
      setAlert('Please fill in all required fields', 'danger');
    } else if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({
        name,
        email,
        password,
        role
      });
    }
  };

  return (
    <section className="fancy-auth-page">
      <div className="fancy-overlay"></div>
      <div className="fancy-login-container animate-fade-in">
        <div className="login-header">
          <i className="fas fa-user-plus fa-3x gradient-icon"></i>
          <h1 className="large gradient-text">Join Our Community</h1>
          <p className="lead">
            <i className="fas fa-graduation-cap"></i> Create your alumni account
          </p>
        </div>

        <div className="fancy-login-card">
          <form className="fancy-form" onSubmit={onSubmit}>
            <div className="fancy-form-group">
              <div className="input-icon-wrapper">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                  className="fancy-input"
                />
              </div>
            </div>
            
            <div className="fancy-form-group">
              <div className="input-icon-wrapper">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="fancy-input"
                />
              </div>
              <small className="form-text text-light">
                We'll never share your email with anyone else
              </small>
            </div>
            
            <div className="fancy-form-group">
              <div className="input-icon-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                  className="fancy-input"
                />
              </div>
            </div>
            
            <div className="fancy-form-group">
              <div className="input-icon-wrapper">
                <i className="fas fa-check-circle"></i>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  required
                  minLength="6"
                  className="fancy-input"
                />
              </div>
            </div>
            
            <div className="fancy-form-group">
              <label className="fancy-select-label">Account Type</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-user-graduate"></i>
                <select 
                  name="role" 
                  value={role} 
                  onChange={onChange} 
                  required
                  className="fancy-input"
                >
                  <option value="appliedAlumni">Alumni</option>
                  <option value="student">Current Student</option>
                </select>
              </div>
              <small className="form-text text-light">
                Alumni accounts require verification by administrators
              </small>
            </div>
            
            <button type="submit" className="btn btn-primary btn-glass btn-block animate-pop">
              <i className="fas fa-user-plus"></i> Register
            </button>
          </form>

          <div className="auth-footer">
            <p className="my-1">
              Already have an account? <Link to="/login" className="gradient-link">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;