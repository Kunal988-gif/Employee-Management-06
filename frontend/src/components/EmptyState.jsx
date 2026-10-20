import React from 'react';

function EmptyState({ title = 'No Data Available', message = 'There are no records to display at this time.' }) {
  return (
    <div className="state-container">
      <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📭</div>
      <h3 className="state-title">{title}</h3>
      <p className="state-desc">{message}</p>
    </div>
  );
}

export default EmptyState;
