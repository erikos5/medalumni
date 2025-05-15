import React, { useReducer, useEffect } from 'react';
import ThemeContext from './ThemeContext';
import themeReducer from './themeReducer';
import { SET_THEME } from '../types';

const ThemeState = props => {
  const initialState = {
    darkMode: false
  };

  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Έλεγχος για προτιμώμενο θέμα από το σύστημα ή τοπική αποθήκευση
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme !== null) {
      // Αν υπάρχει αποθηκευμένη προτίμηση
      const isDarkMode = JSON.parse(savedTheme);
      toggleTheme(isDarkMode);
    } else {
      // Έλεγχος προτίμησης του συστήματος
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      toggleTheme(prefersDarkMode);
    }
    
    // Εφαρμογή του κατάλληλου θέματος στο html element
    applyTheme(state.darkMode);
  }, []);

  // Εφαρμογή του θέματος στο html element
  const applyTheme = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  // Εναλλαγή θέματος
  const toggleTheme = (forceValue = null) => {
    const newDarkMode = forceValue !== null ? forceValue : !state.darkMode;
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    dispatch({
      type: SET_THEME,
      payload: newDarkMode
    });
    
    applyTheme(newDarkMode);
  };

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