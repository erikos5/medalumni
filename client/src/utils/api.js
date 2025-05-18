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
    if (error.response && error.response.status === 401) {
      // If we get a 401 (Unauthorized), clear localStorage and reload
      if (localStorage.getItem('token')) {
        console.error('Auth token expired or invalid, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('adminSession');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 