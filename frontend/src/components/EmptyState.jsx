import React from 'react';

function EmptyState({ title = 'No records found', message = 'No data available to display.' }) {
  return (
    <div className="state-container">
      <h3 className="state-title">{title}</h3>
      <p className="state-desc">{message}</p>
    </div>
  );
}

export default EmptyState;
