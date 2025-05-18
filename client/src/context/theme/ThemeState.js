import React, { useReducer, useEffect, useCallback } from 'react';
import ThemeContext from './ThemeContext';
import themeReducer from './themeReducer';
import { SET_THEME } from '../types';

const ThemeState = props => {
  // Always initialize with dark mode
  const initialState = {
    darkMode: true
  };

  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Apply theme to html element
  const applyTheme = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  // Force dark mode
  const toggleTheme = useCallback((forceValue = null) => {
    // Always use dark mode regardless of toggle
    const newDarkMode = true;
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    dispatch({
      type: SET_THEME,
      payload: newDarkMode
    });
    
    applyTheme(newDarkMode);
  }, []);

  // Initialize theme
  useEffect(() => {
    // Force dark mode
    toggleTheme(true);
    
    // Apply dark mode
    applyTheme(true);
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode: state.darkMode,
        toggleTheme
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeState; 