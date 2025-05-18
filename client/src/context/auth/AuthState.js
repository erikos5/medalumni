import React, { useReducer, useEffect } from 'react';
import api from '../../utils/api';
import AuthContext from './AuthContext';
import authReducer from './AuthReducer';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  SET_LOADING
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set token on initial load
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    
    getUser();
    // eslint-disable-next-line
  }, []);

  // Load User
  const getUser = async () => {
    if (!localStorage.token) {
      dispatch({ type: AUTH_ERROR });
      return;
    }

    try {
      // Set the token in headers for all requests
      setAuthToken(localStorage.token);
      
      // Try to get user from localStorage first (for quicker startup)
      const cachedUser = localStorage.getItem('user');
      let userData = null;
      
      if (cachedUser) {
        try {
          userData = JSON.parse(cachedUser);
          console.log('Using cached user data:', userData);
          
          // If we have a valid cached user with role, use it
          if (userData && userData.id && userData.role) {
            dispatch({
              type: USER_LOADED,
              payload: userData
            });
            return;
          }
        } catch (e) {
          console.error('Error parsing cached user data:', e);
        }
      }
      
      // For all users, try to get data from API
      console.log('Attempting to load user data from API');
      const res = await api.get('/api/auth');
      console.log('API response:', res.data);

      // Save user data to localStorage for future use
      if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        
        // If admin, mark the admin session
        if (res.data.role === 'admin') {
          localStorage.setItem('adminSession', 'true');
        }
      }

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      console.error('Error loading user:', err);
      
      // If adminSession is set but there was an error, try to recover
      if (localStorage.getItem('adminSession') === 'true' && localStorage.getItem('user')) {
        console.log('Recovering admin session after error');
        try {
          const cachedUser = JSON.parse(localStorage.getItem('user'));
          if (cachedUser && cachedUser.role === 'admin') {
            dispatch({
              type: USER_LOADED,
              payload: cachedUser
            });
            return;
          }
        } catch (e) {
          console.error('Error recovering admin session:', e);
        }
      }
      
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async formData => {
    try {
      // Set loading state
      dispatch({ type: SET_LOADING });
      
      console.log('Attempting registration via API');
      const res = await api.post('/api/auth/register', formData);
      console.log('Registration API response:', res.data);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      // Load user data after successful registration
      await getUser();
    } catch (err) {
      console.error('Registration error:', err);
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response && err.response.data && err.response.data.msg 
          ? err.response.data.msg 
          : 'Registration error'
      });
    }
  };

  // Login User
  const login = async formData => {
    try {
      // Set loading state
      dispatch({ type: SET_LOADING });
      
      // Special handling for admin login
      if (formData.email === 'admin@example.com' && formData.password === 'password123') {
        console.log('Admin login detected - using direct API call');
        
        try {
          // Make a direct axios call to avoid interceptors
          const loginResponse = await axios.post('http://localhost:5006/api/auth', {
            email: 'admin@example.com',
            password: 'password123'
          });
          
          if (!loginResponse.data || !loginResponse.data.token) {
            throw new Error('No token received from API');
          }
          
          const adminToken = loginResponse.data.token;
          const userData = loginResponse.data.user || {
            _id: '5f8f8c8f8c8f8c8f8c8f8c9d',
            id: '5f8f8c8f8c8f8c8f8c8f8c9d',
            name: 'Administrator',
            email: 'admin@example.com',
            role: 'admin'
          };
          
          console.log('Admin login successful - got token from API directly');
          
          // Store the admin session info
          localStorage.setItem('adminSession', 'true');
          localStorage.setItem('token', adminToken);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Set the token for future requests
          setAuthToken(adminToken);
          
          // Dispatch login success with the token and user
          dispatch({
            type: LOGIN_SUCCESS,
            payload: { 
              token: adminToken,
              user: userData
            }
          });
          
          return;
        } catch (err) {
          console.error('Error in direct admin login:', err.message);
          
          if (err.response) {
            console.error('API response error:', err.response.data);
          }
          
          // Fall back to regular login flow
          console.log('Falling back to regular login flow');
        }
      }
      
      // For non-admin users or if direct admin login failed
      console.log('Attempting login via API');
      const res = await api.post('/api/auth', formData);
      console.log('Login API response:', res.data);

      // If the response includes user data, we don't need to make a separate call
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      // If it's an admin user, mark the admin session
      if (res.data.user && res.data.user.role === 'admin') {
        localStorage.setItem('adminSession', 'true');
      }

      // Save the token and user data
      localStorage.setItem('token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      // Set auth token for future requests
      setAuthToken(res.data.token);
    } catch (err) {
      console.error('Login error:', err);
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response && err.response.data && err.response.data.msg 
          ? err.response.data.msg 
          : 'Login error'
      });
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    dispatch({ type: LOGOUT });
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        getUser,
        login,
        logout,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState; 