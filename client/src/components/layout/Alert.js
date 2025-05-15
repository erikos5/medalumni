import React, { useContext } from 'react';
import AlertContext from '../../context/alert/AlertContext';

const Alert = () => {
  const alertContext = useContext(AlertContext);
  const { alerts } = alertContext;

  return (
    <div className="alert-wrapper">
      {alerts.length > 0 &&
        alerts.map(alert => (
          <div key={alert.id} className={`alert alert-${alert.type}`}>
            <i className="fas fa-info-circle" /> {alert.msg}
          </div>
        ))}
    </div>
  );
};

export default Alert; 