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

const authReducer = (state, action) => {
  console.log('AuthReducer: Action dispatched', action.type, action.payload);
  
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      console.log('REGISTER_SUCCESS: Token saved, loading getUser data');
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: true, // Still loading until user data is retrieved
        error: null
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      console.log('LOGIN_SUCCESS: Token saved, user data received');
      // Store the user data as well if it's included in the payload
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user || null,
        isAuthenticated: true,
        loading: action.payload.user ? false : true, // Still loading if no user data
        error: null
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('AUTH_ERROR/LOGOUT: Token removed, isAuthenticated set to false');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer; 