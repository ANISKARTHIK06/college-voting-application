import API_BASE_URL from '@/config/api';
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
          axios.get(`${API_BASE_URL}/announcements`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/activity`, { headers: { Authorization: `Bearer ${token}` } })
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

      {/* ── Latest Notices Banner ── */}
      <div className="glass-panel animate-slideUp" style={{ margin: '24px 0', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Megaphone size={18} style={{ color: 'var(--primary)' }} />
            <h3 className="section-title" style={{ margin: 0 }}>Latest Notices</h3>
            {announcements.length > 0 && (
              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                {announcements.length} new
              </span>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/announcements')}>View All →</button>
        </div>

        {loading ? (
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Loading notices...</p>
        ) : announcements.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '12px 0', fontSize: '0.875rem' }}>No active notices.</p>
        ) : (
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {announcements.map((a, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  minWidth: '280px', maxWidth: '320px', padding: '16px',
                  borderLeft: `4px solid ${a.priority === 'Important' ? 'var(--danger)' : 'var(--primary)'}`,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em',
                    padding: '2px 8px', borderRadius: 6,
                    background: a.priority === 'Important' ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.1)',
                    color: a.priority === 'Important' ? 'var(--danger)' : 'var(--primary)',
                  }}>
                    {a.priority}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(a.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem', marginBottom: '4px' }}>{a.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="section-title">Quick Actions</h3>
              <Zap size={18} className="text-muted" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/admin/announcements')}>
                📢 Publish Announcement
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/admin/alerts')}>
                🔔 Send Notification
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/admin/activity')}>
                📋 View Full Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
