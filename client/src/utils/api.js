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
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercept responses and handle 401 errors (token expired or invalid)
api.interceptors.response.use(
  response => response,
  error => {
    // Only handle specific authentication errors
    if (error.response && 
        error.response.status === 401 && 
        (error.response.data.msg === 'Token is not valid' || 
         error.response.data.msg === 'Token has expired')) {
      
      console.error('Auth token expired or invalid, logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('adminSession');
      
      // Use window.location for logout instead of immediate redirect
      // This gives time for the current operation to complete
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default api; 