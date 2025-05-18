import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5006',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests and add token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
      // Log the token being sent for debugging
      console.log('Request with token:', token.substring(0, 10) + '...');
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Intercept responses
api.interceptors.response.use(
  response => {
    // Log successful responses for endpoints that might be problematic
    if (response.config.url.includes('/events') || response.config.url.includes('/auth')) {
      console.log(`Response from ${response.config.url}:`, response.status);
    }
    return response;
  },
  error => {
    // Handle unauthorized errors (expired or invalid token)
    if (error.response && error.response.status === 401) {
      console.error('401 Unauthorized response:', error.response.data);
      
      // Don't automatically logout during development unless specifically asked to
      if (error.config.url.includes('/auth') || error.response.data.msg === 'Token is not valid') {
        console.warn('Auth token expired or invalid, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('adminSession');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.response) {
      // Log other errors with response
      console.error(`API Error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      // Log network errors
      console.error('Network Error - No response received:', error.request);
    } else {
      // Log all other errors
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 