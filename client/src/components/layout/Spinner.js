import React from 'react';
import spinner from '../../assets/images/spinner.gif';

const Spinner = () => (
  <div className="spinner-container">
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt="Φόρτωση..."
    />
  </div>
);

export default Spinner; 