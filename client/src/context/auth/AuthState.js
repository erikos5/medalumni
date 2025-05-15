import React, { useReducer } from 'react';
import api from '../../utils/api';
import AuthContext from './AuthContext';
import authReducer from './AuthReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
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

  // Load User
  const getUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      // Mock user data for admin
      if (localStorage.getItem('adminSession') === 'true') {
        console.log('Admin session found, loading admin user data');
        dispatch({
          type: USER_LOADED,
          payload: {
            _id: 'admin-user-id',
            name: 'Administrator',
            email: 'admin@example.com',
            role: 'admin',
            date: new Date()
          }
        });
        return;
      }
      
      // For non-admin users, try to get data from API
      console.log('Attempting to load user data from API');
      const res = await api.get('/api/auth');
      console.log('API response:', res.data);

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      console.error('Error loading user:', err);
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async formData => {
    try {
      const res = await api.post('/api/auth/register', formData);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      getUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response && err.response.data && err.response.data.msg 
          ? err.response.data.msg 
          : 'Σφάλμα εγγραφής'
      });
    }
  };

  // Login User
  const login = async formData => {
    try {
      // Special handling for admin login
      if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
        console.log('Admin login successful');
        localStorage.setItem('adminSession', 'true');
        localStorage.setItem('token', 'fake-admin-token-for-development-only');
        
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { 
            token: 'fake-admin-token-for-development-only' 
          }
        });
        
        dispatch({
          type: USER_LOADED,
          payload: {
            _id: 'admin-user-id',
            name: 'Administrator',
            email: 'admin@example.com',
            role: 'admin',
            date: new Date()
          }
        });
        
        return;
      }
    
      // For non-admin users
      console.log('Attempting login via API');
      const res = await api.post('/api/auth', formData);
      console.log('Login API response:', res.data);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      getUser();
    } catch (err) {
      console.error('Login error:', err);
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response && err.response.data && err.response.data.msg 
          ? err.response.data.msg 
          : 'Σφάλμα σύνδεσης'
      });
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('adminSession');
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