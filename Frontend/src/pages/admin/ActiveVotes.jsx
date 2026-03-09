import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ActiveVotes = () => {
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchVotes();
    }, []);

    const fetchVotes = async () => {
        setLoading(true);
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

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/votes/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchVotes();
        } catch (error) {
            alert('Failed to update election status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to archive this voting event? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/votes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVotes(votes.filter(v => v._id !== id));
        } catch (error) {
            alert('Failed to delete vote');
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredVotes = votes.filter(v => {
        const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filter === 'all' || v.status === filter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
      return (
        <div className="loader-wrapper">
          <div className="loader-spinner"></div>
          <p className="loader-text">Syncing with governance vaults...</p>
        </div>
      );
    }

    return (
        <div className="active-votes-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Election Management Console</h1>
                    <p className="page-subtitle">Full lifecycle control for voting campaigns</p>
                </div>
                <div className="page-header-actions">
                    <div className="glass-panel" style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search elections..." 
                            className="form-input"
                            style={{ border: 'none', background: 'transparent', width: '200px', padding: '8px 0', fontSize: '0.85rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="glass-panel" style={{ padding: '4px', display: 'flex', gap: '4px' }}>
                        {['all', 'active', 'ended', 'published'].map(f => (
                            <button 
                                key={f} 
                                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setFilter(f)}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <Link to="/admin/create-vote" className="btn btn-primary">+ New Election</Link>
                </div>
            </div>

            <div className="dashboard-card glass-panel animate-slideUp" style={{ padding: '0' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Election Details</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Workflow Status</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Participation</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Schedule</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVotes.map((vote) => (
                                <tr key={vote._id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'var(--transition)' }}>
                                    <td style={{ padding: '24px' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{vote.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vote.votingType} • {vote.eligibleGroup}</div>
                                    </td>
                                    <td style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span className={`badge ${vote.status === 'active' ? 'badge-active' : vote.status === 'published' ? 'badge-published' : 'badge-ended'}`}>
                                                {vote.status}
                                            </span>
                                            {vote.status === 'active' && <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 600 }}>● RECEIVING BALLOTS</span>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ flex: 1, minWidth: '80px', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: '65%', height: '100%', background: 'var(--grad-primary)', borderRadius: '4px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>65%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span>Start: {new Date(vote.startTime).toLocaleDateString()}</span>
                                            <span>End: {new Date(vote.endTime).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            {vote.status !== 'active' && vote.status !== 'published' && (
                                                <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(vote._id, 'active')}>Launch ⚡</button>
                                            )}
                                            {vote.status === 'active' && (
                                                <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(vote._id, 'ended')}>End Now 🛑</button>
                                            )}
                                            {vote.status === 'ended' && (
                                                <button className="btn btn-primary btn-sm" onClick={() => updateStatus(vote._id, 'published')}>Certify 📜</button>
                                            )}
                                            <Link to={`/admin/candidates/${vote._id}`} className="btn btn-secondary btn-sm">Candidates 👥</Link>
                                            <Link to={`/admin/analytics/${vote._id}`} className="btn btn-ghost btn-sm">Monitoring 📊</Link>
                                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(vote._id)}>Archive</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredVotes.length === 0 && (
                  <div className="empty-state" style={{ border: 'none' }}>
                    <div className="empty-state-icon">📂</div>
                    <p className="empty-state-text">No elections match the selected filter.</p>
                  </div>
                )}
            </div>
        </div>
    );
};


export default ActiveVotes;
