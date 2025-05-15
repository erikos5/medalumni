import React, { Fragment, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import ThemeContext from '../../context/theme/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const location = useLocation();

  const { isAuthenticated, logout, user } = authContext;
  const { darkMode } = themeContext;

  const onLogout = () => {
    logout();
  };

  // Only show these links on the dashboard
  const isDashboardPage = location.pathname === '/dashboard';

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
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>{' '}
          <span className="hide-sm">Dashboard</span>
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
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
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

export default Navbar; 