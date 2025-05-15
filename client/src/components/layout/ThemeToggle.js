import React, { useContext } from 'react';
import ThemeContext from '../../context/theme/ThemeContext';

const ThemeToggle = () => {
  const themeContext = useContext(ThemeContext);
  const { darkMode, toggleTheme } = themeContext;

  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleTheme} 
        className="theme-toggle-btn"
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {darkMode ? (
          <i className="fas fa-sun"></i>
        ) : (
          <i className="fas fa-moon"></i>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle; 