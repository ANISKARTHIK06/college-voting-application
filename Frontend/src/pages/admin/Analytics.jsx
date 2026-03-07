import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StatCard from '../../components/shared/StatCard';

const Analytics = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/votes/${id}/results`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch results');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchResults();
    }, [id]);

    if (loading) return <div className="loader">Analyzing data...</div>;
    if (!data) return <div className="error">No data found for this campaign.</div>;

    const { vote, totalVotes, results } = data;

    return (
        <div className="analytics-page animate-slideUp">
            <div className="section-header">
                <div>
                    <h2 className="section-title">{vote.title} — Analytics</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time participation and outcome tracking</p>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon="📊" value={totalVotes} label="Total Votes Cast" />
                <StatCard icon="📈" value={`${((totalVotes / 1240) * 100).toFixed(1)}%`} label="Participation Rate" />
                <StatCard icon="⏳" value={vote.status} label="Campaign Status" />
                <StatCard icon="🏆" value="In Progress" label="Leading Option" />
            </div>

            <div className="dashboard-main-grid">
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 className="section-title">Vote Distribution</h3>
                    <div className="results-list" style={{ marginTop: '24px' }}>
                        {vote.candidates.map((candidate) => {
                            const count = results[candidate._id] || 0;
                            const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                            return (
                                <div key={candidate._id} className="result-row" style={{ marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                                        <span>{candidate.name}</span>
                                        <span>{count} votes ({percent.toFixed(1)}%)</span>
                                    </div>
                                    <div style={{ height: '12px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            height: '100%', 
                                            width: `${percent}%`, 
                                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                                            borderRadius: '6px',
                                            transition: 'width 1s ease-out'
                                        }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 className="section-title">Audience Snapshot</h3>
                    <div className="demographics" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>DEPARTMENT REACH</p>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <div style={{ flex: 3, height: '8px', background: 'var(--primary)', borderRadius: '4px' }}></div>
                                <div style={{ flex: 2, height: '8px', background: 'var(--secondary)', borderRadius: '4px' }}></div>
                                <div style={{ flex: 1, height: '8px', background: 'var(--accent)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></span>
                                Computer Science (45%)
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }}></span>
                                Arts & Humanities (30%)
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }}></span>
                                Engineering (25%)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
