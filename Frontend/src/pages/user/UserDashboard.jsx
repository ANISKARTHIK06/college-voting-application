import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StatCard from '../components/shared/StatCard';
import '../styles/Dashboard.css';

const UserDashboard = () => {
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/votes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVotes(res.data);
            } catch (error) {
                console.error('Failed to fetch votes');
            } finally {
                setLoading(false);
            }
        };
        fetchVotes();
    }, []);

    const activeVotes = votes.filter(v => v.status === 'active');
    const pastVotes = votes.filter(v => v.status === 'published' || v.status === 'ended');

    return (
        <div className="user-dashboard-page animate-slideUp">
            <div className="dashboard-header">
                <h2 className="section-title">Welcome back, {user?.name.split(' ')[0]}!</h2>
                <div className="stats-grid">
                    <StatCard icon="🗳️" value={activeVotes.length} label="Active Elections" />
                    <StatCard icon="✅" value="0" label="Votes Cast" />
                    <StatCard icon="📅" value="2" label="Upcoming Events" />
                    <StatCard icon="🏆" value="1" label="Published Results" />
                </div>
            </div>

            <div className="dashboard-main-grid">
                <div className="active-section">
                    <h3 className="section-title">Open for Voting</h3>
                    <div className="votes-grid">
                        {activeVotes.length > 0 ? activeVotes.map(vote => (
                            <div key={vote._id} className="vote-card glass-panel">
                                <div className="vote-card-header">
                                    <span className="status-pill active">LIVE</span>
                                    <span className="type-pill">{vote.votingType}</span>
                                </div>
                                <h3>{vote.title}</h3>
                                <p className="description">{vote.description.substring(0, 100)}...</p>
                                <div className="vote-meta">
                                    <span>Ends: {new Date(vote.endTime).toLocaleDateString()}</span>
                                </div>
                                <Link to={`/user/vote/${vote._id}`} className="btn-auth" style={{ margin: '16px 0 0 0', textAlign: 'center' }}>
                                    Enter Booth
                                </Link>
                            </div>
                        )) : (
                            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', opacity: 0.7 }}>
                                <p>No active elections at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="sidebar-section">
                    <h3 className="section-title">Recent Updates</h3>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-dot" style={{ background: 'var(--success)' }}></div>
                                <div className="activity-content">
                                    <h4>Results Published</h4>
                                    <p>The "Cafeteria Menu" poll results are out.</p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-dot"></div>
                                <div className="activity-content">
                                    <h4>New Election</h4>
                                    <p>Cultural Head elections start tomorrow.</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-small glass-card" style={{ width: '100%', marginTop: '20px' }}>
                            View Notifications
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
