import React from 'react';

function LoadingState({ message = 'Loading, please wait...' }) {
  return (
    <div className="state-container">
      <div className="loading-spinner"></div>
      <p className="state-title">{message}</p>
    </div>
  );
}

export default LoadingState;
