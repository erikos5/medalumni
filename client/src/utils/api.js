import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5006',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include cookies in cross-site requests
});

// Helper function to get user info
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (e) {
    console.error('Error parsing user data from localStorage:', e);
    return null;
  }
};

// Intercept requests and add token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
      
      // If it's an admin request, add extra validation
      const user = getUserFromStorage();
      if (user && user.role === 'admin' && localStorage.getItem('adminSession') === 'true') {
        config.headers['x-admin-token'] = token;
      }
      
      // Log the token being sent for debugging
      console.log('API Request:', config.method.toUpperCase(), config.url);
      console.log('Token present in request:', token.substring(0, 10) + '...');
    } else {
      console.warn('No auth token found for request:', config.url);
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
      console.log(`Response success from ${response.config.url}:`, response.status);
    }
    
    // If this is a login response, cache the token and user data
    if (response.config.url.includes('/auth') && response.config.method === 'post' && response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set admin session flag
        if (response.data.user.role === 'admin') {
          localStorage.setItem('adminSession', 'true');
        }
      }
    }
    
    return response;
  },
  error => {
    // Handle unauthorized errors (expired or invalid token)
    if (error.response && error.response.status === 401) {
      console.error('401 Unauthorized response:', error.response.data);
      localStorage.removeItem('token');
      localStorage.removeItem('adminSession');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (error.response) {
      // Log other errors with response
      console.error(`API Error (${error.response.status}):`, 
        error.response.data,
        'URL:', error.config.url,
        'Method:', error.config.method
      );
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