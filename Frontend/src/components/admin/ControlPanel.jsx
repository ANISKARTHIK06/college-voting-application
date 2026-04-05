import React from 'react';
import { useNavigate } from 'react-router-dom';

const ControlPanel = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Create New Election', icon: '🗳️', color: 'var(--primary)', onClick: () => navigate('/admin/create-vote') },
    { label: 'Add Candidate', icon: '👤', color: 'var(--secondary)', onClick: () => navigate('/admin/active-votes') },
    { label: 'Import Students', icon: '📥', color: 'var(--accent)', onClick: () => navigate('/admin/users') },
    { label: 'Publish Announcement', icon: '📢', color: 'var(--info)', onClick: () => navigate('/admin/announcements') },

    { label: 'Lock or End Election', icon: '🔒', color: 'var(--danger)', onClick: () => navigate('/admin/active-votes') },
  ];

  return (
    <div className="dashboard-card glass-panel animate-slideUp">
      <h3 className="section-title">Admin Quick Actions</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginTop: '20px'
      }}>
        {actions.map((action, index) => (
          <button
            key={index}
            className="glass-card hover-lift"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'center',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              transition: 'all 0.3s ease'
            }}
            onClick={action.onClick}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: `${action.color}15`,
              color: action.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              {action.icon}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
