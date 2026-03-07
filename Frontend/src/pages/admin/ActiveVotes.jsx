import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ActiveVotes = () => {
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/votes/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            alert('Update failed');
        }
    };

    return (
        <div className="active-votes-page animate-slideUp">
            <div className="section-header">
                <h2 className="section-title">Campaign Repository</h2>
                <Link to="/admin/create-vote" className="btn-auth" style={{ margin: 0, padding: '10px 20px' }}>
                    + New Campaign
                </Link>
            </div>

            <div className="votes-grid">
                {votes.map(vote => (
                    <div key={vote._id} className="vote-card glass-panel">
                        <div className="vote-card-header">
                            <span className={`status-pill ${vote.status}`}>{vote.status}</span>
                            <span className="type-pill">{vote.votingType}</span>
                        </div>
                        <h3>{vote.title}</h3>
                        <p className="description">{vote.description.substring(0, 100)}...</p>
                        
                        <div className="vote-meta">
                            <div>🗓️ {new Date(vote.endTime).toLocaleDateString()}</div>
                            <div>👥 {vote.eligibleGroup}</div>
                        </div>

                        <div className="vote-actions">
                            {vote.status === 'draft' && (
                                <button className="btn-small btn-primary" onClick={() => updateStatus(vote._id, 'active')}>Activate</button>
                            )}
                            {vote.status === 'active' && (
                                <button className="btn-small danger" onClick={() => updateStatus(vote._id, 'ended')}>End Now</button>
                            )}
                            {vote.status === 'ended' && (
                                <button className="btn-small glass-card" onClick={() => updateStatus(vote._id, 'published')}>Publish Results</button>
                            )}
                            <Link to={`/admin/analytics/${vote._id}`} className="btn-small glass-card">Analytics</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveVotes;
