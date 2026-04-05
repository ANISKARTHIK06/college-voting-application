import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Users, LineChart, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/shared/StatCard';
import AnalyticsSection from '../../components/shared/AnalyticsSection';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/announcements`, { headers: { Authorization: `Bearer ${token}` } });
        setAnnouncements(res.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: '👥', value: '1,542', label: 'Registered Voters', trend: 12.5 },
    { icon: '🗳️', value: '2', label: 'Live Elections', trend: 1, trendType: 'up' },
    { icon: '📈', value: '82.4%', label: 'Avg. Participation', trend: 4.1, trendType: 'up' },
    { icon: '✅', value: '142', label: 'Candidates Verified' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Portal</h1>
          <p className="page-subtitle">Monitor election integrity and track student participation</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/faculty/statistics')}>View Full Report</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <AnalyticsSection />

      <div className="dashboard-grid" style={{ marginTop: '48px' }}>
        <div className="dashboard-main-col">
          <div className="dashboard-card glass-panel animate-slideUp">
            <div className="card-header">
              <h3 className="section-title">Elections Under Observation</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/faculty/monitoring')}>View All Active</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              {[1, 2].map(i => (
                <div key={i} className="panel-item glass-card">
                  <div className="panel-item-icon">🗳️</div>
                  <div className="panel-item-content">
                    <div className="panel-item-title">Cultural Head Election 2026</div>
                    <div className="panel-item-subtitle">{i === 1 ? 'High Participation' : 'Normal Participation'} • {i === 1 ? '3 days' : '14 hours'} remaining</div>
                  </div>
                  <div className="badge badge-active">Live</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/faculty/candidates`} className="btn btn-secondary btn-sm">Candidates</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-side-col">
          <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="section-title">Institution Notices</h3>
              <Megaphone size={18} className="text-muted" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {announcements.map((a, i) => (
                <div key={i} className="glass-card" style={{ padding: '16px' }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.priority === 'Important' ? 'bg-danger text-white' : 'bg-primary-light text-primary'}`}>
                      {a.priority}
                    </span>
                    <span className="text-[10px] text-muted">{new Date(a.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>{a.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }} className="truncate">{a.description}</div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-muted text-center py-4">No notices published</p>}
              <button className="btn btn-secondary btn-auth" style={{ width: '100%', margin: 0 }} onClick={() => navigate('/faculty/announcements')}>
                View Communications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
