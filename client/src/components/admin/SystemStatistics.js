import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';
import { mockSchools } from './AdminDashboard';
import './SystemStatistics.css';

// Mock data for statistics
const mockStats = {
  userStats: {
    totalUsers: 158,
    activeUsers: 124,
    pendingApproval: 12,
    adminUsers: 3,
    studentUsers: 19,
    alumniUsers: 136,
    newUsersThisMonth: 23,
  },
  profileStats: {
    totalProfiles: 136,
    completedProfiles: 112,
    incompleteProfiles: 24,
    averageCompletionRate: 82.3,
  },
  schoolStats: {
    totalSchools: 9,
    programsBySchool: [
      { name: 'School of Maritime Studies', programs: 7 },
      { name: 'School of Business', programs: 9 },
      { name: 'School of Tourism and Hospitality', programs: 6 },
      { name: 'School of Health Sciences & Sports', programs: 6 },
      { name: 'School of Computing', programs: 8 },
      { name: 'School of Psychology', programs: 6 },
      { name: 'School of Education', programs: 7 },
      { name: 'School of Engineering', programs: 6 },
      { name: 'School of Arts & Design', programs: 5 },
    ],
    mostPopularSchool: 'School of Business',
    alumniDistribution: [
      { name: 'School of Business', count: 38 },
      { name: 'School of Computing', count: 27 },
      { name: 'School of Engineering', count: 19 },
      { name: 'School of Health Sciences & Sports', count: 15 },
      { name: 'School of Tourism and Hospitality', count: 12 },
      { name: 'School of Psychology', count: 10 },
      { name: 'School of Maritime Studies', count: 8 },
      { name: 'School of Education', count: 4 },
      { name: 'School of Arts & Design', count: 3 },
    ],
  },
  activityStats: {
    loginsPastWeek: 78,
    averageDailyLogins: 11.2,
    mostActiveDay: 'Wednesday',
    peakHour: '19:00 - 20:00',
  },
  eventStats: {
    totalEvents: 12,
    upcomingEvents: 5,
    pastEvents: 7,
    totalAttendees: 423,
    averageAttendanceRate: 76.8,
    mostPopularEvent: 'Career Day 2023',
  },
  systemStats: {
    uptime: '27 days, 14 hours',
    databaseSize: '256 MB',
    totalUploads: 187,
    storageUsed: '1.2 GB',
  }
};

const SystemStatistics = () => {
  const authContext = useContext(AuthContext);
  const { user, loading } = authContext;
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch statistics
    setTimeout(() => {
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (loading || !user || isLoading) {
    return <Spinner />;
  }

  const { userStats, profileStats, schoolStats, activityStats, eventStats, systemStats } = stats;

  // Calculate percentage for the progress bars
  const calculatePercentage = (part, total) => {
    return (part / total * 100).toFixed(1);
  };

  // Format percentage with + sign if trend is positive
  const formatTrend = (value, isPositive = true) => {
    const sign = isPositive ? '+' : '';
    return `${sign}${value}%`;
  };

  return (
    <div className="container">
      <h1>System Statistics</h1>
      <p className="lead">
        <i className="fas fa-chart-line"></i> Analytics and statistics dashboard
      </p>

      <div className="dash-buttons">
        <Link to="/admin-dashboard" className="btn">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      <div className="statistics-container">
        {/* User Statistics Section */}
        <div className="stats-card">
          <h3><i className="fas fa-users"></i> User Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-user-friends text-primary"></i> Total Users
              </span>
              <span className="stat-value">{userStats.totalUsers}</span>
              <span className="stat-trend positive">
                <i className="fas fa-arrow-up"></i> {formatTrend(14.5)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-user-check text-success"></i> Active Users
              </span>
              <span className="stat-value">{userStats.activeUsers}</span>
              <span className="stat-trend positive">
                <i className="fas fa-arrow-up"></i> {formatTrend(8.2)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-user-clock text-warning"></i> Pending Approval
              </span>
              <span className="stat-value">{userStats.pendingApproval}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-user-plus text-info"></i> New This Month
              </span>
              <span className="stat-value">{userStats.newUsersThisMonth}</span>
              <span className="stat-trend positive">
                <i className="fas fa-arrow-up"></i> {formatTrend(30.1)}
              </span>
            </div>
          </div>

          <div className="user-distribution">
            <h4>User Distribution</h4>
            <div className="progress-container">
              <div className="progress-label">
                <span><i className="fas fa-user-graduate"></i> Alumni</span>
                <span>{userStats.alumniUsers} ({calculatePercentage(userStats.alumniUsers, userStats.totalUsers)}%)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-primary" 
                  style={{ width: `${calculatePercentage(userStats.alumniUsers, userStats.totalUsers)}%` }}
                ></div>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-label">
                <span><i className="fas fa-user-edit"></i> Students</span>
                <span>{userStats.studentUsers} ({calculatePercentage(userStats.studentUsers, userStats.totalUsers)}%)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-success" 
                  style={{ width: `${calculatePercentage(userStats.studentUsers, userStats.totalUsers)}%` }}
                ></div>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-label">
                <span><i className="fas fa-user-shield"></i> Admins</span>
                <span>{userStats.adminUsers} ({calculatePercentage(userStats.adminUsers, userStats.totalUsers)}%)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-dark" 
                  style={{ width: `${calculatePercentage(userStats.adminUsers, userStats.totalUsers)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Statistics */}
        <div className="stats-card">
          <h3><i className="fas fa-id-card"></i> Profile Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-address-card text-primary"></i> Total Profiles
              </span>
              <span className="stat-value">{profileStats.totalProfiles}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-check-circle text-success"></i> Complete Profiles
              </span>
              <span className="stat-value">{profileStats.completedProfiles}</span>
              <span className="stat-trend positive">
                <i className="fas fa-arrow-up"></i> {formatTrend(12.5)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-exclamation-circle text-warning"></i> Incomplete
              </span>
              <span className="stat-value">{profileStats.incompleteProfiles}</span>
              <span className="stat-trend negative">
                <i className="fas fa-arrow-down"></i> {formatTrend(8.3, false)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-percentage text-info"></i> Completion Rate
              </span>
              <span className="stat-value">{profileStats.averageCompletionRate}%</span>
              <span className="stat-trend positive">
                <i className="fas fa-arrow-up"></i> {formatTrend(3.7)}
              </span>
            </div>
          </div>

          <div className="profile-completion">
            <h4>Profile Completion</h4>
            <div className="progress-container">
              <div className="progress-label">
                <span><i className="fas fa-check"></i> Completed</span>
                <span>{profileStats.completedProfiles} ({calculatePercentage(profileStats.completedProfiles, profileStats.totalProfiles)}%)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-success" 
                  style={{ width: `${calculatePercentage(profileStats.completedProfiles, profileStats.totalProfiles)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* School Statistics */}
        <div className="stats-card">
          <h3><i className="fas fa-university"></i> Schools and Programs</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-building text-primary"></i> Total Schools
              </span>
              <span className="stat-value">{schoolStats.totalSchools}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-award text-success"></i> Most Popular
              </span>
              <span className="stat-value">Business</span>
              <span className="stat-detail">School of Business</span>
            </div>
          </div>

          <div className="alumni-distribution">
            <h4>Alumni Distribution by School</h4>
            {schoolStats.alumniDistribution.slice(0, 5).map((school, index) => (
              <div key={index} className="progress-container">
                <div className="progress-label">
                  <span><i className={`fas fa-${getSchoolIcon(school.name)}`}></i> {getShortSchoolName(school.name)}</span>
                  <span>{school.count} ({calculatePercentage(school.count, profileStats.totalProfiles)}%)</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${calculatePercentage(school.count, profileStats.totalProfiles)}%`,
                      backgroundColor: getSchoolColor(index)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Statistics */}
        <div className="stats-card">
          <h3><i className="fas fa-calendar-alt"></i> Event Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-calendar text-primary"></i> Total Events
              </span>
              <span className="stat-value">{eventStats.totalEvents}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-calendar-plus text-success"></i> Upcoming
              </span>
              <span className="stat-value">{eventStats.upcomingEvents}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-users text-info"></i> Attendees
              </span>
              <span className="stat-value">{eventStats.totalAttendees}</span>
              <span className="stat-trend positive">
                <i className="fas fa-arrow-up"></i> {formatTrend(15.8)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-percentage text-success"></i> Attendance Rate
              </span>
              <span className="stat-value">{eventStats.averageAttendanceRate}%</span>
            </div>
          </div>
          <div className="event-info">
            <p><i className="fas fa-star text-warning"></i> <strong>Most Popular Event:</strong> {eventStats.mostPopularEvent}</p>
          </div>
        </div>

        {/* System Information */}
        <div className="stats-card">
          <h3><i className="fas fa-server"></i> System Information</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-clock text-primary"></i> Uptime
              </span>
              <span className="stat-value">{systemStats.uptime}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-database text-info"></i> Database Size
              </span>
              <span className="stat-value">{systemStats.databaseSize}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-upload text-success"></i> Total Uploads
              </span>
              <span className="stat-value">{systemStats.totalUploads}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">
                <i className="fas fa-hdd text-warning"></i> Storage Used
              </span>
              <span className="stat-value">{systemStats.storageUsed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get appropriate icon for each school
const getSchoolIcon = (schoolName) => {
  const iconMap = {
    'School of Business': 'briefcase',
    'School of Computing': 'laptop-code',
    'School of Engineering': 'cogs',
    'School of Health Sciences & Sports': 'heartbeat',
    'School of Tourism and Hospitality': 'concierge-bell',
    'School of Psychology': 'brain',
    'School of Maritime Studies': 'anchor',
    'School of Education': 'chalkboard-teacher',
    'School of Arts & Design': 'palette'
  };
  
  return iconMap[schoolName] || 'university';
};

// Helper function to get shortened school name
const getShortSchoolName = (fullName) => {
  return fullName.replace('School of ', '');
};

// Helper function to get colors for school bars
const getSchoolColor = (index) => {
  const colors = [
    '#007bff', // primary blue
    '#28a745', // success green
    '#fd7e14', // orange
    '#6f42c1', // purple
    '#20c997', // teal
    '#e83e8c', // pink
    '#17a2b8', // info blue
    '#6c757d', // gray
    '#343a40'  // dark
  ];
  
  return colors[index % colors.length];
};

export default SystemStatistics; 