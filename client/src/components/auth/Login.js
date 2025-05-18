import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';

const Login = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { login, error, clearErrors, isAuthenticated, loading } = authContext;
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
    email: '',
    password: ''
  });

  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      setAlert('Please fill in all fields', 'danger');
    } else {
      login({
        email,
        password
      });
    }
  };

  // Admin login shortcut
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setUser({
      email: 'admin@example.com',
      password: 'password123'
    });
    // Submit the form after a short delay to allow state update
    setTimeout(() => {
      document.querySelector('form.fancy-form').dispatchEvent(new Event('submit', { cancelable: true }));
    }, 100);
  };

  // User login shortcut
  const handleUserLogin = (e) => {
    e.preventDefault();
    setUser({
      email: 'yannos@example.com',
      password: 'password123'
    });
    // Submit the form after a short delay to allow state update
    setTimeout(() => {
      document.querySelector('form.fancy-form').dispatchEvent(new Event('submit', { cancelable: true }));
    }, 100);
  };

  return (
    <section className="fancy-auth-page">
      <div className="fancy-overlay"></div>
      <div className="fancy-login-container animate-fade-in">
        <div className="login-header">
          <i className="fas fa-graduation-cap fa-3x gradient-icon"></i>
          <h1 className="large gradient-text">Welcome Back</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Sign in to your alumni account
          </p>
        </div>

        <div className="fancy-login-card">
          <form className="fancy-form" onSubmit={onSubmit}>
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
            <button type="submit" className="btn btn-primary btn-glass btn-block animate-pop" disabled={loading}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>} 
              {loading ? ' Logging in...' : ' Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p className="my-1">
              Don't have an account? <Link to="/register" className="gradient-link">Register</Link>
            </p>
          </div>
        </div>

        <div className="demo-credentials fancy-alert">
          <i className="fas fa-info-circle"></i>
          <div className="demo-buttons">
            <div><strong>Demo Credentials:</strong></div>
            <div>
              <button onClick={handleAdminLogin} className="demo-btn">Admin: admin@example.com / password123</button>
              <button onClick={handleUserLogin} className="demo-btn">User: yannos@example.com / password123</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login; 