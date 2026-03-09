import React from 'react';

const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="empty-state animate-fadeIn">
      <div className="empty-state-icon">{icon}</div>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '8px' }}>{title}</h4>
      <p className="empty-state-text" style={{ maxWidth: '300px', margin: '0 auto' }}>{description}</p>
      {actionText && (
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ marginTop: '16px' }}
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
