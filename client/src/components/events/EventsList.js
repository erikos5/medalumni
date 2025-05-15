import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import './EventsList.css';

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: 'Career Day 2023',
    description: 'Annual career day with companies from all over Greece. Bring your resume and be ready for on-site interviews!',
    date: '2023-05-15',
    time: '10:00',
    location: 'Main Campus, Athens',
    category: 'career',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    registrationEnabled: true,
    registrationDeadline: '2023-05-10'
  },
  {
    id: 2,
    title: 'Alumni Networking Night',
    description: 'Join us for an evening of networking with fellow alumni from all departments. Refreshments will be served.',
    date: '2023-06-22',
    time: '19:00',
    location: 'Gallery Hall, Thessaloniki Campus',
    category: 'networking',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    registrationEnabled: true,
    registrationDeadline: '2023-06-15'
  },
  {
    id: 3,
    title: 'International Education Conference',
    description: 'The 5th International Conference on Education Innovation will host speakers from universities around the world.',
    date: '2023-07-10',
    time: '09:30',
    location: 'Conference Center, Athens',
    category: 'academic',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    registrationEnabled: true,
    registrationDeadline: '2023-06-30'
  },
  {
    id: 4,
    title: 'Summer Party 2023',
    description: 'Our annual summer celebration with food, music, and games! Open to all alumni and their families.',
    date: '2023-08-05',
    time: '16:00',
    location: 'Beach Club, Athens Riviera',
    category: 'social',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3',
    registrationEnabled: true,
    registrationDeadline: '2023-07-25'
  },
  {
    id: 5,
    title: 'Workshop: Digital Marketing Trends',
    description: 'Learn about the latest trends in digital marketing from industry experts in this practical workshop.',
    date: '2023-09-12',
    time: '14:00',
    location: 'Digital Lab, Athens Campus',
    category: 'workshop',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    registrationEnabled: true,
    registrationDeadline: '2023-09-05'
  }
];

const EventsList = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { isAuthenticated, user } = authContext;
  const { setAlert } = alertContext;

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    onlyFuture: true,
    searchTerm: ''
  });

  useEffect(() => {
    // Simulating API call
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...events];
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(event => event.category === filters.category);
    }
    
    // Filter by date (only future events)
    if (filters.onlyFuture) {
      const today = new Date();
      result = result.filter(event => new Date(event.date) >= today);
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

  if (filteredEvents.length === 0) {
    return <Spinner />;
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
          <p>No events found matching your criteria.</p>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="event-card bg-light">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
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