import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';
import AdminDashboardMenu from '../dashboard/AdminDashboardMenu';

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

export const mockSchools = [
  {
    _id: 'school1',
    name: 'School of Maritime Studies',
    description: 'The School of Maritime Studies at Mediterranean College',
    programs: {
      undergraduate: ['BSc Maritime Studies', 'BSc International Maritime Management'],
      postgraduate: ['MSc Maritime Studies', 'MBA Maritime Management'],
      professional: ['Diploma in Maritime Operations', 'Certificate in Shipping Management']
    }
  },
  {
    _id: 'school2',
    name: 'School of Business',
    description: 'The School of Business at Mediterranean College',
    programs: {
      undergraduate: ['BA (Hons) Business Management', 'BSc Accounting and Finance'],
      postgraduate: ['MBA', 'MSc Marketing Management', 'MSc Human Resource Management'],
      professional: ['Diploma in Business Administration', 'Certificate in Digital Marketing']
    }
  },
  {
    _id: 'school3',
    name: 'School of Tourism and Hospitality',
    description: 'The School of Tourism and Hospitality at Mediterranean College',
    programs: {
      undergraduate: ['BA (Hons) Hospitality & Tourism Management', 'BSc Culinary Arts'],
      postgraduate: ['MSc International Hospitality Management', 'MSc Tourism Management'],
      professional: ['Diploma in Hotel Management', 'Certificate in Event Management']
    }
  },
  {
    _id: 'school4',
    name: 'School of Health Sciences & Sports',
    description: 'The School of Health Sciences & Sports at Mediterranean College',
    programs: {
      undergraduate: ['BSc Physiotherapy', 'BSc Sports Science'],
      postgraduate: ['MSc Sports Rehabilitation', 'MSc Health Science'],
      professional: ['Diploma in Sports Coaching', 'Certificate in Nutrition']
    }
  },
  {
    _id: 'school5',
    name: 'School of Computing',
    description: 'The School of Computing at Mediterranean College',
    programs: {
      undergraduate: ['BSc Computer Science', 'BSc Information Technology'],
      postgraduate: ['MSc Computer Science', 'MSc Data Science', 'MSc Cybersecurity'],
      professional: ['Diploma in Web Development', 'Certificate in Programming']
    }
  },
  {
    _id: 'school6',
    name: 'School of Psychology',
    description: 'The School of Psychology at Mediterranean College',
    programs: {
      undergraduate: ['BSc Psychology', 'BSc Applied Psychology'],
      postgraduate: ['MSc Counselling Psychology', 'MSc Clinical Psychology'],
      professional: ['Diploma in Counselling', 'Certificate in Psychotherapy']
    }
  },
  {
    _id: 'school7',
    name: 'School of Education',
    description: 'The School of Education at Mediterranean College',
    programs: {
      undergraduate: ['BA Early Childhood Studies', 'BSc Education Studies'],
      postgraduate: ['MA Education', 'MEd Educational Leadership'],
      professional: ['Diploma in Early Years Education', 'Certificate in Special Education']
    }
  },
  {
    _id: 'school8',
    name: 'School of Engineering',
    description: 'The School of Engineering at Mediterranean College',
    programs: {
      undergraduate: ['BEng Civil Engineering', 'BEng Mechanical Engineering'],
      postgraduate: ['MSc Civil Engineering', 'MSc Engineering Management'],
      professional: ['Diploma in Construction', 'Certificate in CAD']
    }
  },
  {
    _id: 'school9',
    name: 'School of Arts & Design',
    description: 'The School of Arts & Design at Mediterranean College',
    programs: {
      undergraduate: ['BA Graphic Design', 'BA Interior Design', 'BA Fashion Design'],
      postgraduate: ['MA Design', 'MA Digital Media'],
      professional: []
    }
  }
];

const AdminDashboard = () => {
  const authContext = useContext(AuthContext);
  const { user, loading } = authContext;

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">System Management</h1>
      <p className="lead">
        <i className="fas fa-user-shield"></i> Welcome {user && user.name}
      </p>

      <AdminDashboardMenu />

      <section className="admin-section my-3">
        <h2 className="text-primary mb-2">Management Options</h2>
        
        <div className="admin-cards">
          <div className="admin-card">
            <h3>
              <i className="fas fa-user-graduate mr-1"></i> Pending Profiles
            </h3>
            <p>Manage alumni profiles waiting for approval</p>
            <p><small>Pending: {mockPendingProfiles.length} profiles</small></p>
            <Link to="/admin/pending-profiles" className="btn btn-primary">
              <i className="fas fa-users"></i> Manage Profiles
            </Link>
          </div>

          <div className="admin-card">
            <h3>
              <i className="fas fa-university mr-1"></i> School Management
            </h3>
            <p>Add, edit and manage schools and study programs</p>
            <p><small>Total: {mockSchools.length} schools</small></p>
            <Link to="/admin/schools" className="btn btn-primary">
              <i className="fas fa-cogs"></i> Manage Schools
            </Link>
          </div>

          <div className="admin-card">
            <h3>
              <i className="fas fa-calendar-alt mr-1"></i> Event Management
            </h3>
            <p>Add and edit college events</p>
            <Link to="/admin/events" className="btn btn-primary">
              <i className="fas fa-calendar-check"></i> Manage Events
            </Link>
          </div>

          <div className="admin-card">
            <h3>
              <i className="fas fa-images mr-1"></i> Photo Management
            </h3>
            <p>Manage photo albums and images</p>
            <Link to="/admin/gallery" className="btn btn-primary">
              <i className="fas fa-photo-video"></i> Manage Albums
            </Link>
          </div>
          
          <div className="admin-card">
            <h3>
              <i className="fas fa-users mr-1"></i> View Alumni
            </h3>
            <p>View all approved alumni profiles</p>
            <Link to="/profiles" className="btn btn-primary">
              <i className="fas fa-user-friends"></i> View Alumni
            </Link>
          </div>
          
          <div className="admin-card">
            <h3>
              <i className="fas fa-chart-bar mr-1"></i> System Statistics
            </h3>
            <p>View statistics and analytics</p>
            <Link to="/admin/statistics" className="btn btn-primary">
              <i className="fas fa-chart-line"></i> View Statistics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard; 