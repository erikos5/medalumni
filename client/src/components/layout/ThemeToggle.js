import React from 'react';

const ThemeToggle = () => {
  return (
    <div className="theme-toggle">
      <button 
        className="theme-toggle-btn"
        title="Dark mode is permanent"
        disabled={true}
      >
        <i className="fas fa-moon"></i>
      </button>
    </div>
  );
};

export default ThemeToggle; 