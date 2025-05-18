import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import api from '../../utils/api';
import './EventsList.css';

const EventsList = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { isAuthenticated, user } = authContext;
  const { setAlert } = alertContext;
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertShown, setAlertShown] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    onlyFuture: true,
    searchTerm: ''
  });

  useEffect(() => {
    // Check if user is authenticated and has proper role
    const checkAccess = () => {
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        return false;
      }

      // Allow admin users to access events
      if (user && user.role === 'admin') {
        console.log('Admin user, allowing access');
        return true;
      }

      // Check if user is an approved alumni (registeredAlumni)
      if (user && user.role === 'registeredAlumni') {
        console.log('Registered alumni, allowing access');
        return true;
      }

      // Non-approved users (appliedAlumni) should not see events
      console.log('User role not approved for events:', user?.role);
      setError('Access denied. Only approved alumni can view events.');
      
      // Show alert only once and redirect
      if (!alertShown && user && user.role === 'appliedAlumni') {
        setAlert('Your profile needs to be approved to view events', 'info');
        setAlertShown(true);
        navigate('/dashboard');
      }
      
      return false;
    };

    const hasAccess = checkAccess();
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    // Fetch events from API
    const fetchEvents = async () => {
      try {
        console.log('Fetching events from API');
        const res = await api.get('/api/events');
        console.log('API response:', res.data);
        
        // Convert API data format to match component format
        const formattedEvents = res.data.map(event => ({
          id: event._id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          category: event.category,
          image: event.image,
          registrationEnabled: event.registrationEnabled,
          registrationDeadline: event.registrationDeadline
        }));
        
        setEvents(formattedEvents);
        setFilteredEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setAlert('Error fetching events', 'danger');
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, user, setAlert, alertShown, navigate]);

  useEffect(() => {
    // Apply filters
    let result = [...events];
    
    console.log('Filtering events, starting with:', result.length);
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(event => event.category === filters.category);
      console.log('After category filter:', filters.category, result.length);
    }
    
    // Filter by date (only future events)
    if (filters.onlyFuture) {
      const today = new Date();
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        const isFuture = eventDate >= today;
        return isFuture;
      });
      console.log('After future filter:', result.length);
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(term) || 
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term)
      );
      console.log('After search filter:', result.length);
    }
    
    setFilteredEvents(result);
  }, [filters, events]);

  const handleFilterChange = e => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const isPastDeadline = deadlineString => {
    const today = new Date();
    const deadline = new Date(deadlineString);
    return today > deadline;
  };

  const handleRegister = eventId => {
    // Mock function - would connect to API in real app
    alert(`You've registered for event #${eventId}. You'll receive confirmation by email.`);
  };

  // Redirect unapproved users - moved to useEffect to prevent multiple alerts
  if (user && user.role === 'appliedAlumni') {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="container">
        <h1 className="large text-primary">Events</h1>
        <div className="alert alert-danger">{error}</div>
        <p>
          <Link to="/dashboard" className="btn btn-light">
            <i className="fas fa-arrow-left"></i> Return to Dashboard
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Upcoming Events</h1>
      
      <div className="events-filter bg-light">
        <h4>Filter Events</h4>
        <div className="form">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
            >
              <option value="all">All Categories</option>
              <option value="career">Career</option>
              <option value="networking">Networking</option>
              <option value="academic">Academic</option>
              <option value="social">Social</option>
              <option value="workshop">Workshops</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="searchTerm">Search:</label>
            <input 
              type="text" 
              name="searchTerm" 
              value={filters.searchTerm} 
              onChange={handleFilterChange}
              placeholder="Search by title, description..."
            />
          </div>
          
          <div className="form-check">
            <input 
              type="checkbox" 
              name="onlyFuture" 
              checked={filters.onlyFuture} 
              onChange={handleFilterChange}
              id="onlyFuture"
            />
            <label htmlFor="onlyFuture">Show only upcoming events</label>
          </div>
        </div>
      </div>
      
      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <h4>No events found matching your criteria.</h4>
            <p>Try adjusting your search criteria or check back later for upcoming events.</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="event-card bg-light">
              <div className="event-image">
                {event.image ? (
                  <img src={event.image} alt={event.title} />
                ) : (
                  <div className="event-placeholder-image">
                    <i className="fas fa-calendar-day fa-4x"></i>
                  </div>
                )}
              </div>
              <div className="event-details">
                <h2>{event.title}</h2>
                <p className="event-date">
                  <i className="fas fa-calendar-day"></i> {formatDate(event.date)} at {event.time}
                </p>
                <p className="event-location">
                  <i className="fas fa-map-marker-alt"></i> {event.location}
                </p>
                <p>{event.description}</p>
                
                <div className="event-registration">
                  {event.registrationEnabled ? (
                    isPastDeadline(event.registrationDeadline) ? (
                      <p className="text-danger">Registration has closed (deadline: {formatDate(event.registrationDeadline)})</p>
                    ) : (
                      <>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleRegister(event.id)}
                        >
                          Register Now
                        </button>
                        <p className="registration-info">Registration open until {formatDate(event.registrationDeadline)}</p>
                      </>
                    )
                  ) : (
                    <p>Registration not required</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsList; 