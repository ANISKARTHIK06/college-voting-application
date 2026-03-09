import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import { User, Mail, BookOpen, Calendar, Award, CheckCircle } from 'lucide-react';
import axios from 'axios';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Simulate fetching voting history for demonstration
    setTimeout(() => {
      setHistory([
        { id: 1, title: 'Cultural Head Election 2026', date: 'Oct 15, 2025', status: 'Voted', candidate: 'Priya Patel' },
        { id: 2, title: 'Department Representative', date: 'Sep 01, 2025', status: 'Voted', candidate: 'Rahul Sharma' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading || !user) {
    return (
      <div className="loader-wrapper">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';

  return (
    <div className="profile-page animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your student account and view voting records</p>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '32px' }}>
        
        {/* Left Column: Profile Card */}
        <div className="glass-panel" style={{ padding: '40px 32px', textAlign: 'center', height: 'fit-content' }}>
          <div 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              background: 'var(--grad-primary)', 
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 24px rgba(var(--primary-rgb), 0.3)'
            }}
          >
            {getInitials(user.name)}
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            {user.name}
          </h2>
          <div className="badge badge-active" style={{ marginBottom: '24px' }}>
            Verified Student
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <Mail size={18} style={{ color: 'var(--primary)' }} />
              <span>{user.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <BookOpen size={18} style={{ color: 'var(--primary)' }} />
              <span>{user.department || 'General Department'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <Calendar size={18} style={{ color: 'var(--primary)' }} />
              <span>{user.position || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
              <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}>
                <CheckCircle size={32} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Votes Cast</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{history.length}</h3>
              </div>
            </div>
            
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
              <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
                <Award size={32} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Civic Score</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{history.length * 50}</h3>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="glass-panel" style={{ flex: 1 }}>
            <h3 className="section-title" style={{ marginBottom: '24px' }}>Voting History</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {history.map((record) => (
                <div key={record.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)'
                }}>
                  <div>
                    <h4 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>{record.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Selected: <strong style={{ color: 'var(--primary)' }}>{record.candidate}</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="badge badge-active" style={{ marginBottom: '8px', display: 'inline-block' }}>{record.status}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{record.date}</div>
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <p>No voting history found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
