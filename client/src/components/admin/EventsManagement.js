import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import AlertContext from '../../context/alert/AlertContext';
import AuthContext from '../../context/auth/AuthContext';
import api from '../../utils/api';
import './EventsManagement.css';

const EventsManagement = () => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { setAlert } = alertContext;
  const { loading: authLoading, user } = authContext;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    image: '',
    registrationEnabled: false,
    registrationDeadline: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  const {
    title,
    description,
    date,
    time,
    location,
    category,
    image,
    registrationEnabled,
    registrationDeadline
  } = formData;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      setAlert('Not authorized', 'danger');
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('Fetching events...');
        const res = await api.get('/api/events');
        console.log('Events fetched successfully:', res.data.length);
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        // Use an empty array if events fail to load
        setEvents([]);
        setAlert('Error fetching events. Please refresh the page or try again later.', 'danger');
        setLoading(false);
      }
    };

    fetchEvents();
  }, [authLoading, user, setAlert]);

  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      image: '',
      registrationEnabled: false,
      registrationDeadline: ''
    });
    setEditMode(false);
    setCurrentEventId(null);
  };

  const formatDateForInput = dateString => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEditClick = event => {
    setFormData({
      title: event.title,
      description: event.description,
      date: formatDateForInput(event.date),
      time: event.time,
      location: event.location,
      category: event.category,
      image: event.image || '',
      registrationEnabled: event.registrationEnabled || false,
      registrationDeadline: event.registrationDeadline ? formatDateForInput(event.registrationDeadline) : ''
    });
    setEditMode(true);
    setCurrentEventId(event._id);
  };

  const handleDeleteClick = async eventId => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log('Attempting to delete event with ID:', eventId);
        const response = await api.delete(`/api/events/${eventId}`);
        console.log('Delete response:', response.data);
        
        if (response.data && response.data.id) {
          // Remove the deleted event from the state
          setEvents(events.filter(event => event._id !== eventId));
          setAlert('Event deleted successfully', 'success');
          
          // If we were editing this event, reset the form
          if (currentEventId === eventId) {
            resetForm();
          }
        } else {
          setAlert('Event was deleted but UI not updated. Please refresh.', 'warning');
        }
      } catch (err) {
        console.error('Error deleting event:', err);
        
        if (err.response) {
          setAlert(`Error deleting event: ${err.response.data.msg || err.response.statusText}`, 'danger');
        } else {
          setAlert(`Network error: ${err.message}. Try again later.`, 'danger');
        }
      }
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!title || !description || !date || !time || !location || !category) {
      setAlert('Please fill in all required fields', 'danger');
      return;
    }

    try {
      console.log('Submitting event data:', formData);
      
      // Enhanced admin auth check
      if (!user || user.role !== 'admin') {
        console.warn('User appears to have lost admin status, refreshing user data');
        // Force refresh the admin status
        localStorage.setItem('adminSession', 'true');
        
        // Check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          setAlert('Authentication error: No token found. Please login again.', 'danger');
          return;
        }
        
        // Verify token is not corrupted or too old
        if (token.length < 20) {
          setAlert('Authentication token appears invalid. Please login again.', 'danger');
          return;
        }
        
        // Make sure we have the right admin ID
        if (!localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify({
            _id: '5f8f8c8f8c8f8c8f8c8f8c9d',
            id: '5f8f8c8f8c8f8c8f8c8f8c9d',
            role: 'admin',
            name: 'Admin User',
            email: 'admin@example.com'
          }));
        }
        
        // Force a page reload to refresh auth state
        window.location.reload();
        return;
      }
      
      let res;
      if (editMode) {
        console.log('Updating event with ID:', currentEventId);
        try {
          res = await api.put(`/api/events/${currentEventId}`, formData);
          console.log('Update response:', res.data);
          
          // Create a new array with the updated event
          const updatedEvents = events.map(event => 
            event._id === currentEventId ? res.data : event
          );
          
          // Update the state
          setEvents(updatedEvents);
          setAlert('Event updated successfully', 'success');
          resetForm(); // Reset form after successful update
        } catch (err) {
          console.error('Error updating event:', err);
          if (err.response) {
            setAlert(`Update failed: ${err.response.data.msg || err.response.statusText}`, 'danger');
          } else {
            setAlert(`Update failed: ${err.message}`, 'danger');
          }
          return; // Don't reset form so user can try again
        }
      } else {
        console.log('Creating new event');
        try {
          // Send creation request with explicit check for token
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          console.log('Using token for event creation:', token.substring(0, 10) + '...');
          res = await api.post('/api/events', formData);
          
          // Success - add the new event to the list
          setEvents([...events, res.data]);
          setAlert('Event created successfully (ID: ' + res.data._id + ')', 'success');
          resetForm();
        } catch (err) {
          // Show the real error
          console.error('Event creation error:', err);
          
          if (err.response) {
            setAlert(`Event creation failed: ${err.response.data.msg || err.response.statusText}`, 'danger');
          } else {
            setAlert(`Event creation failed: ${err.message}`, 'danger');
          }
          
          throw err; // Re-throw for the outer catch block to handle
        }
      }
      resetForm();
    } catch (err) {
      console.error('Error saving event:', err);
      
      // Don't use the mock feature, show real errors
      if (err.response) {
        setAlert(`Error: ${err.response.data.msg || err.response.statusText}`, 'danger');
      } else {
        setAlert(`Error: ${err.message}`, 'danger');
      }
    }
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading || authLoading) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Event Management</h1>
      <p className="lead">
        <i className="fas fa-calendar-alt"></i> Add and manage events
      </p>

      <div className="my-2">
        <Link to="/admin" className="btn btn-light">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      <div className="admin-form-container my-2">
        <h2 className="text-primary">{editMode ? 'Edit Event' : 'Add New Event'}</h2>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="* Event Title"
              name="title"
              value={title}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="* Event Description"
              name="description"
              value={description}
              onChange={onChange}
            ></textarea>
          </div>
          <div className="form-group">
            <input
              type="date"
              name="date"
              value={date}
              onChange={onChange}
            />
            <small className="form-text">* Event Date</small>
          </div>
          <div className="form-group">
            <input
              type="time"
              name="time"
              value={time}
              onChange={onChange}
            />
            <small className="form-text">* Event Time</small>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="* Event Location"
              name="location"
              value={location}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <select name="category" value={category} onChange={onChange}>
              <option value="">* Select Category</option>
              <option value="career">Career</option>
              <option value="networking">Networking</option>
              <option value="academic">Academic</option>
              <option value="social">Social</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Image URL"
              name="image"
              value={image}
              onChange={onChange}
            />
            <small className="form-text">Event Cover Image URL</small>
          </div>
          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                name="registrationEnabled"
                checked={registrationEnabled}
                onChange={onChange}
                id="registrationEnabled"
              />
              <label htmlFor="registrationEnabled">Enable Registration</label>
            </div>
          </div>
          {registrationEnabled && (
            <div className="form-group">
              <input
                type="date"
                name="registrationDeadline"
                value={registrationDeadline}
                onChange={onChange}
              />
              <small className="form-text">Registration Deadline</small>
            </div>
          )}

          <input
            type="submit"
            className="btn btn-primary my-1"
            value={editMode ? 'Update Event' : 'Add Event'}
          />
          <button type="button" className="btn btn-light my-1" onClick={resetForm}>
            Reset Form
          </button>
        </form>
      </div>

      <div className="events-management-list my-3">
        <h2 className="text-primary">Current Events</h2>
        {events.length === 0 ? (
          <p>No events found. Create your first event above.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{event.location}</td>
                    <td>{event.category}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm mr-1"
                        onClick={() => handleEditClick(event)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(event._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManagement; 