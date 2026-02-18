import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-3d">
        <div className="spinner-cube spinner-cube-1"></div>
        <div className="spinner-cube spinner-cube-2"></div>
        <div className="spinner-cube spinner-cube-3"></div>
        <div className="spinner-cube spinner-cube-4"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
