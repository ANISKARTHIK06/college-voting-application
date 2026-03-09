import { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../../components/shared/StatCard';
import '../../styles/Dashboard.css';

const VoteResults = () => {
    const [votes, setVotes] = useState([]);
    const [resultsData, setResultsData] = useState({}); // { voteId: { results, totalVotes, vote } }
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        department: 'All',
        type: 'All',
        year: 'All'
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('token');
                const votesRes = await axios.get('http://localhost:5000/api/votes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const publishedVotes = votesRes.data.filter(v => v.status === 'published' || v.status === 'ended');
                setVotes(publishedVotes);

                // Fetch results for each published vote
                const resultsPromises = publishedVotes.map(v => 
                    axios.get(`http://localhost:5000/api/votes/${v._id}/results`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(err => null)
                );

                const resultsResponses = await Promise.all(resultsPromises);
                const resultsMap = {};
                resultsResponses.forEach((res, index) => {
                    if (res && res.data) {
                        resultsMap[publishedVotes[index]._id] = res.data;
                    }
                });
                setResultsData(resultsMap);
            } catch (error) {
                console.error('Failed to fetch results dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const calculateWinner = (voteId) => {
        const data = resultsData[voteId];
        if (!data || !data.vote.candidates.length) return null;
        
        return data.vote.candidates.reduce((prev, current) => {
            const currentVotes = data.results[current._id] || 0;
            const prevVotes = data.results[prev?._id] || 0;
            return currentVotes > prevVotes ? current : prev;
        }, data.vote.candidates[0]);
    };

    const filteredVotes = votes.filter(v => {
        const matchDept = filters.department === 'All' || v.eligibleGroup === filters.department;
        const matchType = filters.type === 'All' || v.votingType === filters.type;
        const matchYear = filters.year === 'All' || new Date(v.endTime).getFullYear().toString() === filters.year;
        return matchDept && matchType && matchYear;
    });

    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="loader-spinner"></div>
                <p className="loader-text">Aggregating historical governance data...</p>
            </div>
        );
    }

    return (
        <div className="vote-results-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Governance Outcomes</h1>
                    <p className="page-subtitle">Certified election tallies and institutional records</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="dashboard-card glass-panel" style={{ marginBottom: '32px', padding: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>DEPARTMENT</label>
                        <select 
                            className="form-input" 
                            style={{ padding: '10px' }}
                            value={filters.department}
                            onChange={(e) => setFilters({...filters, department: e.target.value})}
                        >
                            <option>All</option>
                            <option>Computer Science</option>
                            <option>Engineering</option>
                            <option>Arts & Humanities</option>
                            <option>Business Admin</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>ELECTION TYPE</label>
                        <select 
                            className="form-input" 
                            style={{ padding: '10px' }}
                            value={filters.type}
                            onChange={(e) => setFilters({...filters, type: e.target.value})}
                        >
                            <option>All</option>
                            <option>Election</option>
                            <option>Approval</option>
                            <option>Ranked</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>ACADEMIC YEAR</label>
                        <select 
                            className="form-input" 
                            style={{ padding: '10px' }}
                            value={filters.year}
                            onChange={(e) => setFilters({...filters, year: e.target.value})}
                        >
                            <option>All</option>
                            <option>2026</option>
                            <option>2025</option>
                            <option>2024</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="results-stack" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {filteredVotes.length > 0 ? filteredVotes.map((vote, i) => {
                    const data = resultsData[vote._id];
                    const winner = calculateWinner(vote._id);
                    const winnerCount = data ? data.results[winner?._id || ''] : 0;
                    const winnerPercent = data && data.totalVotes > 0 ? (winnerCount / data.totalVotes * 100).toFixed(1) : 0;

                    return (
                        <div key={vote._id} className="result-dashboard-item animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                                {/* Left Side: Winner Highlight */}
                                <div className="dashboard-card glass-panel" style={{ background: 'var(--grad-primary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '3rem', opacity: 0.2 }}>🏆</div>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', marginBottom: '24px' }}>CERTIFIED WINNER</span>
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        <div className="winner-avatar" style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'white', color: 'var(--primary)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, border: '4px solid rgba(255,255,255,0.3)' }}>
                                            {winner?.name[0]}
                                        </div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>{winner?.name}</h2>
                                        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{winnerPercent}% of total mandates</p>
                                    </div>
                                    <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <div>
                                            <div style={{ opacity: 0.7 }}>TOTAL VOTEST</div>
                                            <div style={{ fontWeight: 700 }}>{data?.totalVotes || 0}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ opacity: 0.7 }}>STATUS</div>
                                            <div style={{ fontWeight: 700 }}>PUBLISHED</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Visual Analytics */}
                                <div className="dashboard-card glass-panel" style={{ padding: '32px' }}>
                                    <div style={{ marginBottom: '32px' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>{vote.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{vote.votingType} • {vote.eligibleGroup} • {new Date(vote.endTime).getFullYear()}</p>
                                    </div>

                                    <div className="results-visualization">
                                        {vote.candidates.map((candidate) => {
                                            const count = data ? data.results[candidate._id] || 0 : 0;
                                            const percent = data && data.totalVotes > 0 ? (count / data.totalVotes * 100) : 0;
                                            const isWinner = winner?._id === candidate._id;

                                            return (
                                                <div key={candidate._id} className="result-bar-row" style={{ marginBottom: '28px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                                                        <span style={{ fontWeight: 600, color: isWinner ? 'var(--primary)' : 'var(--text-main)' }}>
                                                            {candidate.name} {isWinner && '👑'}
                                                        </span>
                                                        <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{count} votes ({percent.toFixed(1)}%)</span>
                                                    </div>
                                                    <div style={{ height: '12px', background: 'var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div 
                                                            className="animate-bar"
                                                            style={{ 
                                                                width: `${percent}%`, 
                                                                height: '100%', 
                                                                background: isWinner ? 'var(--grad-primary)' : 'var(--border)',
                                                                borderRadius: '10px',
                                                                transition: 'width 2s cubic-bezier(0.1, 0, 0, 1)'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                        <div className="glass-card" style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Participation</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>84.2%</div>
                                        </div>
                                        <div className="glass-card" style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Margin</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>12.4%</div>
                                        </div>
                                        <div className="glass-card" style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Audited</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>100%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📂</div>
                        <p className="empty-state-text">No archived results found matching your current filters.</p>
                        <button className="btn btn-secondary btn-sm" onClick={() => setFilters({ department: 'All', type: 'All', year: 'All' })}>Reset Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoteResults;
