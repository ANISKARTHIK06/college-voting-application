import { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/shared/StatCard';

const VoteResults = () => {
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/votes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter only published results
                setVotes(res.data.filter(v => v.status === 'published' || v.status === 'ended'));
            } catch (error) {
                console.error('Failed to fetch results');
            } finally {
                setLoading(false);
            }
        };
        fetchVotes();
    }, []);

    return (
        <div className="vote-results-page animate-slideUp">
            <div className="section-header">
                <h2 className="section-title">Published Outcomes</h2>
                <p style={{ color: 'var(--text-muted)' }}>Transparency and final tallies of concluded campaigns.</p>
            </div>

            <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {votes.map(vote => (
                    <div key={vote._id} className="vote-card glass-panel">
                        <div className="vote-card-header">
                            <span className="status-pill published">PUBLISHED</span>
                            <span className="type-pill">{vote.votingType}</span>
                        </div>
                        <h3>{vote.title}</h3>
                        
                        <div className="quick-stats" style={{ display: 'flex', gap: '20px', margin: '16px 0', fontSize: '0.85rem' }}>
                            <span>👥 Total Participants: <strong>842</strong></span>
                        </div>

                        <Link to={`/admin/analytics/${vote._id}`} className="btn-auth" style={{ margin: 0, textAlign: 'center' }}>
                            View Detailed Breakdown
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Internal Link Helper
import { Link } from 'react-router-dom';

export default VoteResults;
