import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Megaphone, ClipboardList, Shield, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/shared/StatCard';
import AnalyticsSection from '../../components/shared/AnalyticsSection';
import ControlPanel from '../../components/admin/ControlPanel';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [annRes, actRes] = await Promise.all([
          axios.get('http://localhost:5000/api/announcements', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/activity', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setAnnouncements(annRes.data.slice(0, 3));
        setActivity(actRes.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const managementModules = [
    { title: 'Election Ops', desc: 'Lifecycle, dates, and status', icon: '🗳️', link: '/admin/active-votes', color: 'var(--primary)' },
    { title: 'User Directory', desc: 'CSV Import & Access Toggles', icon: '👥', link: '/admin/users', color: 'var(--secondary)' },
    { title: 'Live Tracker', desc: 'Real-time turnout & results', icon: '📊', link: '/admin/active-votes', color: 'var(--accent)' },
    { title: 'System Security', desc: 'Audit logs & integrity', icon: '🛡️', link: '#', color: 'var(--success)' },
  ];

  const stats = [
    { icon: '👥', value: '1,542', label: 'Registered Voters', trend: 12.5 },
    { icon: '🗳️', value: '12', label: 'Active Elections', trend: 2, trendType: 'up' },
    { icon: '📈', value: '82.4%', label: 'Avg. Participation', trend: 4.1, trendType: 'up' },
    { icon: '🛡️', value: '100%', label: 'System Integrity' }
  ];

  const recentEvents = [
    { title: 'New Election Published', time: '12 mins ago', desc: 'University Cultural Head 2026 is now live.', icon: '📢' },
    { title: 'Bulk Import Success', time: '2 hours ago', desc: 'Verified 450 student IDs from CSV.', icon: '📥' },
    { title: 'Results Certified', time: '5 hours ago', desc: 'Library Timings Poll results have been certified.', icon: '🏆' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Management Console</h1>
          <p className="page-subtitle">Governance command center and institutional oversight</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>Print Summary</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/create-vote')}>+ New Election</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <ControlPanel />

      <AnalyticsSection />

      <div className="dashboard-grid">
        <div className="dashboard-main-col">
          <div className="dashboard-card glass-panel animate-slideUp">
            <h3 className="section-title">Core Management Modules</h3>
            <div className="modules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '24px' }}>
              {managementModules.map((m, i) => (
                <Link key={i} to={m.link} className="panel-item glass-card hover-lift" style={{ textDecoration: 'none', borderLeft: `4px solid ${m.color}` }}>
                  <div className="panel-item-icon" style={{ background: `${m.color}15`, color: m.color, fontSize: '1.5rem', width: '48px', height: '48px' }}>{m.icon}</div>
                  <div className="panel-item-content">
                    <div className="panel-item-title" style={{ color: 'var(--text-main)' }}>{m.title}</div>
                    <div className="panel-item-subtitle">{m.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.2s', marginTop: '32px' }}>
            <div className="card-header">
              <h3 className="section-title">Critical Elections</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/active-votes')}>View All</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              {[1, 2].map(i => (
                <div key={i} className="panel-item glass-card">
                  <div className="panel-item-icon">🗳️</div>
                  <div className="panel-item-content">
                    <div className="panel-item-title">Student Council {i === 1 ? 'President' : 'General Secretary'} 2026</div>
                    <div className="panel-item-subtitle">High participation • {i === 1 ? '3 days' : '14 hours'} remaining</div>
                  </div>
                  <div className="badge badge-active">Active</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/admin/candidates/mock-id-${i}`} className="btn btn-ghost btn-sm">Candidates</Link>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/active-votes')}>Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-side-col">
          <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="section-title">Live Activity Log</h3>
              <ClipboardList size={18} className="text-muted" />
            </div>
            <div className="timeline">
              {activity.map((a, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-icon"><Shield size={14} className="text-primary" /></div>
                  <div className="timeline-content">
                    <div className="timeline-title">{a.action}</div>
                    <div className="timeline-desc">{a.user?.name || 'System'}</div>
                    <div className="timeline-time">{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              {activity.length === 0 && <p className="text-muted text-center py-4">No recent activity</p>}
            </div>
            <button className="btn btn-ghost btn-sm w-full mt-4" onClick={() => navigate('/admin/activity')}>View Full Audit Trail</button>
          </div>

          <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.4s', marginTop: '32px' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="section-title">Latest Notices</h3>
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
              <button className="btn btn-secondary btn-auth" style={{ width: '100%', margin: 0 }} onClick={() => navigate('/admin/announcements')}>
                Manage Broadcasts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
