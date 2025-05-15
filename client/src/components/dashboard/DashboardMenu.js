import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardMenu.css';

const DashboardMenu = () => {
  return (
    <div className="dashboard-menu">
      <ul>
        <li>
          <Link to="/profiles">
            <i className="fas fa-users"></i> Alumni
          </Link>
        </li>
        <li>
          <Link to="/programs">
            <i className="fas fa-graduation-cap"></i> Programs
          </Link>
        </li>
        <li>
          <Link to="/events">
            <i className="fas fa-calendar-alt"></i> Events
          </Link>
        </li>
        <li>
          <Link to="/gallery">
            <i className="fas fa-images"></i> Photos
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardMenu; 