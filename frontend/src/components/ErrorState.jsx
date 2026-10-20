import React from 'react';

function ErrorState({ message = 'An error occurred while loading data.', onRetry }) {
  return (
    <div className="alert alert-danger" style={{ textAlign: 'center', margin: '20px 0' }}>
      <p style={{ fontWeight: 600, marginBottom: onRetry ? '8px' : '0' }}>⚠️ {message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;
