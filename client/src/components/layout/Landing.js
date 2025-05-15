import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';

const Landing = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <section className="fancy-landing-bg">
      <div className="fancy-overlay"></div>
      <div className="landing-inner animate-fade-in">
        <div className="college-logo-container">
          <a href="https://www.medcollege.edu.gr" target="_blank" rel="noopener noreferrer" className="college-logo-link">
            <img src="/images/mc-logo.svg" alt="Mediterranean College" className="college-logo" />
          </a>
        </div>
        
        <h1 className="x-large gradient-text">Mediterranean College Alumni Network</h1>
        <p className="lead">
          Connect with fellow graduates, access career opportunities, and stay informed about college events
        </p>
        <div className="fancy-buttons">
          <Link to="/register" className="btn btn-primary btn-glass animate-pop">
            <i className="fas fa-user-plus"></i> Register
          </Link>
          <Link to="/login" className="btn btn-glass animate-pop">
            <i className="fas fa-sign-in-alt"></i> Login
          </Link>
        </div>
        <div className="fancy-features">
          <div className="fancy-feature-card animate-up">
            <i className="fas fa-users fa-3x"></i>
            <h3>Alumni Community</h3>
            <p>Connect with graduates from all departments and year groups</p>
          </div>
          <div className="fancy-feature-card animate-up" style={{ animationDelay: '0.1s' }}>
            <i className="fas fa-briefcase fa-3x"></i>
            <h3>Career Opportunities</h3>
            <p>Exclusive job postings and networking events</p>
          </div>
          <div className="fancy-feature-card animate-up" style={{ animationDelay: '0.2s' }}>
            <i className="fas fa-calendar-alt fa-3x"></i>
            <h3>Events</h3>
            <p>Stay updated on upcoming meetings and college events</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing; 