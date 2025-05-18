import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import ProfileForm from './components/profile/ProfileForm';
import Profiles from './components/profiles/Profiles';
import ProgramsList from './components/programs/ProgramsList';
import EventsList from './components/events/EventsList';
import Gallery from './components/gallery/Gallery';
import AdminDashboard from './components/admin/AdminDashboard';
import PendingProfiles from './components/admin/PendingProfiles';
import SchoolsManagement from './components/admin/SchoolsManagement';
import SystemStatistics from './components/admin/SystemStatistics';
import PhotoManagement from './components/admin/PhotoManagement';
import EventsManagement from './components/admin/EventsManagement';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import AuthRoute from './components/routing/AuthRoute';
import Alert from './components/layout/Alert';

// Context
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import ThemeState from './context/theme/ThemeState';

import './App.css';

// NOTE: Token initialization moved to AuthState useEffect

const App = () => {
  return (
    <ThemeState>
      <AuthState>
        <AlertState>
          <Router>
            <div className="app">
              <Navbar />
              <Alert />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/profiles" 
                  element={<AuthRoute component={Profiles} />} 
                />
                <Route path="/programs" element={<ProgramsList />} />
                <Route 
                  path="/events" 
                  element={<AuthRoute component={EventsList} />} 
                />
                <Route 
                  path="/gallery" 
                  element={<AuthRoute component={Gallery} />} 
                />
                <Route 
                  path="/profile/:id" 
                  element={<AuthRoute component={Profile} />} 
                />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute component={Dashboard} />}
                />
                <Route
                  path="/edit-profile"
                  element={<PrivateRoute component={ProfileForm} />}
                />
                <Route
                  path="/admin-dashboard"
                  element={<AdminRoute component={AdminDashboard} />}
                />
                <Route
                  path="/admin/pending-profiles"
                  element={<AdminRoute component={PendingProfiles} />}
                />
                <Route
                  path="/admin/schools"
                  element={<AdminRoute component={SchoolsManagement} />}
                />
                <Route
                  path="/admin/statistics"
                  element={<AdminRoute component={SystemStatistics} />}
                />
                <Route
                  path="/admin/gallery"
                  element={<AdminRoute component={PhotoManagement} />}
                />
                <Route
                  path="/admin/events"
                  element={<AdminRoute component={EventsManagement} />}
                />
              </Routes>
              <Footer />
            </div>
          </Router>
        </AlertState>
      </AuthState>
    </ThemeState>
  );
};

export default App; 