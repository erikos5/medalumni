import React, { Fragment, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ title, icon }) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { isAuthenticated, logout, user } = authContext;

  const onLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const authLinks = (
    <ul>
      {user && user.role === 'admin' && (
        <li>
          <Link to="/admin-dashboard">
            <i className="fas fa-cog"></i>{' '}
            <span className="hide-sm">Management</span>
          </Link>
        </li>
      )}
      
      {user && user.role !== 'admin' && (
        <li>
          <Link to="/dashboard">
            <i className="fas fa-user"></i>{' '}
            <span className="hide-sm">Dashboard</span>
          </Link>
        </li>
      )}

      <li>
        <Link to="/profiles">
          <i className="fas fa-users"></i>{' '}
          <span className="hide-sm">Alumni</span>
        </Link>
      </li>

      <li>
        <Link to="/events">
          <i className="fas fa-calendar-alt"></i>{' '}
          <span className="hide-sm">Events</span>
        </Link>
      </li>
      
      <li>
        <Link to="/gallery">
          <i className="fas fa-images"></i>{' '}
          <span className="hide-sm">Gallery</span>
        </Link>
      </li>

      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
      <li>
        <ThemeToggle />
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/programs">
          <i className="fas fa-graduation-cap"></i>{' '}
          <span className="hide-sm">Programs</span>
        </Link>
      </li>
      <li>
        <Link to="/register">
          <i className="fas fa-user-plus"></i>{' '}
          <span className="hide-sm">Register</span>
        </Link>
      </li>
      <li>
        <Link to="/login">
          <i className="fas fa-sign-in-alt"></i>{' '}
          <span className="hide-sm">Login</span>
        </Link>
      </li>
      <li>
        <ThemeToggle />
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-primary">
      <h1>
        <Link to="/">
          <i className="fas fa-graduation-cap"></i> Mediterranean Alumni
        </Link>
      </h1>
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default Navbar; 