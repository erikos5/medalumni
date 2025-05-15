import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <p>© {year} Mediterranean College Alumni. Με επιφύλαξη παντός δικαιώματος.</p>
    </footer>
  );
};

export default Footer; 