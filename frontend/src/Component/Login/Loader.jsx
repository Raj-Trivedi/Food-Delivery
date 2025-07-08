import React from 'react';
import './Login.css';

const Loader = ({ message = 'Loading...' }) => (
  <div className="login-loader-container">
    <div className="login-loader-spinner"></div>
    <div className="login-loader-message">{message}</div>
  </div>
);

export default Loader; 