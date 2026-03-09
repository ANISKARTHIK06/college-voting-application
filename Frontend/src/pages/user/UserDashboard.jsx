import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/shared/StatCard';
import AnalyticsSection from '../../components/shared/AnalyticsSection';
import EmptyState from '../../components/shared/EmptyState';
import { getCurrentUser } from '../../services/authService';
import { Megaphone } from 'lucide-react';
import '../../styles/Dashboard.css';

const UserDashboard = () => {
    const [votes, setVotes] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [voteRes, annRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/votes', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/announcements', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setVotes(voteRes.data);
                setAnnouncements(annRes.data.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const activeVotes = votes.filter(v => v.status === 'active');
    
    // Mock data for user-specific stats
    const stats = [
      { icon: '🗳️', value: activeVotes.length, label: 'Available Polls' },
      { icon: '✅', value: '8', label: 'Votes Cast' },
      { icon: '🕒', value: '2', label: 'Awaiting Results' },
      { icon: '🎁', value: '120', label: 'Reward Points' },
    ];

    if (loading) {
      return (
        <div className="loader-wrapper">
          <div className="loader-spinner"></div>
          <div className="loader-text">Loading your dashboard...</div>
        </div>
      );
    }

    return (
        <div className="user-dashboard">
            <div className="page-header">
                <div>
                  <h1 className="page-title">Welcome back, {user?.name.split(' ')[0]}!</h1>
                  <p className="page-subtitle">Here is what is happening in your college today.</p>
                </div>
                <div className="page-header-actions">
                  <button className="btn btn-secondary">Settings</button>
                </div>
            </div>

            {/* Top Analytics Cards */}
            <div className="stats-grid">
              {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <AnalyticsSection />

            <div className="dashboard-grid">
              {/* Main Column: Active Elections */}
              <div className="dashboard-main-col">
                <div className="section-header" style={{ marginBottom: '24px' }}>
                  <h3 className="section-title">Open Elections</h3>
                  <span className="badge badge-active">{activeVotes.length} Live</span>
                </div>

                <div className="elections-grid">
                  {activeVotes.length > 0 ? activeVotes.map((vote, i) => (
                    <div key={vote._id} className="election-card glass-panel animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="election-banner"></div>
                      <div className="election-content">
                        <div className="election-header">
                          <span className="badge badge-published">{vote.votingType}</span>
                          <span className="badge badge-active">Live</span>
                        </div>
                        <h3 className="election-title">{vote.title}</h3>
                        <p className="description" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          {vote.description.substring(0, 100)}...
                        </p>
                        <div className="election-meta">
                          <div className="meta-item">
                            <span>📅</span>
                            <span>Ends {new Date(vote.endTime).toLocaleDateString()}</span>
                          </div>
                          <div className="meta-item">
                            <span>👥</span>
                            <span>{vote.eligibleGroup}</span>
                          </div>
                        </div>
                      </div>
                      <div className="election-footer">
                        <Link to={`/user/active-votes`} className="btn btn-primary btn-sm">
                          Enter Voting Booth 🏛️
                        </Link>
                      </div>
                    </div>
                  )) : (
                    <EmptyState 
                      icon="🗳️"
                      title="No elections are active right now."
                      description="Check back later for upcoming polls or university notices."
                      actionText="Browse Upcoming Elections"
                      onAction={() => navigate('/user/active-votes')}
                    />
                  )}
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="dashboard-side-col">
                <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="section-title">Campus Announcements</h3>
                    <Megaphone size={18} className="text-primary" />
                  </div>
                  <div className="space-y-4">
                    {announcements.map((a, i) => (
                      <div key={i} className="panel-item glass-card hover:bg-glass-bg transition-colors" style={{ cursor: 'pointer' }} onClick={() => navigate('/user/announcements')}>
                        <div className={`panel-item-icon ${a.priority === 'Important' ? 'text-danger' : 'text-primary'}`}>
                          {a.priority === 'Important' ? '⚠️' : '📢'}
                        </div>
                        <div className="panel-item-content">
                          <div className="panel-item-title">{a.title}</div>
                          <div className="panel-item-subtitle line-clamp-1">{a.description}</div>
                        </div>
                      </div>
                    ))}
                    {announcements.length === 0 && <p className="text-muted text-center py-4">No recent notices</p>}
                    <button className="btn btn-ghost btn-sm w-full mt-2" onClick={() => navigate('/user/announcements')}>View Notice Board</button>
                  </div>
                </div>

                <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.3s', marginTop: '32px' }}>
                    <h3 className="section-title">Voting Activity</h3>
                    <div className="panel-section">
                      <div className="panel-item glass-card">
                        <div className="panel-item-icon">🗳️</div>
                        <div className="panel-item-content">
                          <div className="panel-item-title">Turnout Progress</div>
                          <div className="panel-item-subtitle">{activeVotes.length} elections open</div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export default UserDashboard;
