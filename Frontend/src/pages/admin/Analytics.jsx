import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StatCard from '../../components/shared/StatCard';
import '../../styles/Dashboard.css';

const Analytics = () => {
    const { id: routeId } = useParams();
    const [selectedId, setSelectedId] = useState(routeId || null);
    const [allVotes, setAllVotes] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/votes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllVotes(res.data);
                if (!routeId && res.data.length > 0) {
                    setSelectedId(res.data[0]._id);
                }
            } catch (err) {
                console.error('Failed to fetch votes list');
                setLoading(false);
            }
        };
        fetchVotes();
    }, [routeId]);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/votes/${selectedId}/results`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch results');
            } finally {
                setLoading(false);
            }
        };
        if (selectedId) fetchResults();
    }, [selectedId]);

    if (loading) {
      return (
        <div className="loader-wrapper">
          <div className="loader-spinner"></div>
          <p className="loader-text">Compiling cryptographic tallies...</p>
        </div>
      );
    }

    if (!data && !loading) return (
        <div className="analytics-page">
            <h1 className="page-title">Analytics</h1>
            <div className="empty-state" style={{ marginTop: '24px' }}>
                <p>No election data found.</p>
            </div>
        </div>
    );

    const { vote, totalVotes, results, departmentTurnout } = data;

    // Calculate leading candidate
    const leadingCandidate = vote.candidates.reduce((prev, current) => {
        return (results[current._id] || 0) > (results[prev?._id] || 0) ? current : prev;
    }, vote.candidates[0]);

    const participationRate = ((totalVotes / 1240) * 100).toFixed(1); // Assuming 1240 is total expected

    return (
        <div className="analytics-page">
            <div className="page-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h1 className="page-title" style={{ margin: 0 }}>Analytics:</h1>
                        <select 
                            className="form-input" 
                            style={{ width: 'auto', minWidth: '250px', padding: '8px 12px', fontWeight: 700 }}
                            value={selectedId || ''}
                            onChange={(e) => setSelectedId(e.target.value)}
                        >
                            {allVotes.map(v => (
                                <option key={v._id} value={v._id}>{v.title} ({v.status})</option>
                            ))}
                        </select>
                    </div>
                    <p className="page-subtitle">Real-time participation and outcome tracking</p>
                </div>
                <div className="page-header-actions">
                  <span className={`badge ${vote.status === 'active' ? 'badge-active' : vote.status === 'published' ? 'badge-published' : 'badge-ended'}`}>
                    {vote.status}
                  </span>
                  <button className="btn btn-primary btn-sm">Export Audit Log</button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon="📊" value={totalVotes} label="Total Votes Cast" trend={5.2} />
                <StatCard icon="📈" value={`${participationRate}%`} label="Participation Rate" trend={2.1} />
                <StatCard icon="👤" value={vote.eligibleGroup} label="Eligible Voters" />
                <StatCard icon="🏆" value={leadingCandidate?.name || 'N/A'} label="Leading Option" />
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main-col">
                  <div className="dashboard-card glass-panel animate-slideUp">
                      <div className="card-header">
                        <h3 className="section-title">Vote Distribution</h3>
                        <div className="chart-legend" style={{ display: 'flex', gap: '12px' }}>
                          <span className="badge badge-published">Live Tally</span>
                        </div>
                      </div>
                      
                      <div className="results-list" style={{ marginTop: '32px' }}>
                          {vote.candidates.map((candidate) => {
                              const count = results[candidate._id] || 0;
                              const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                              return (
                                  <div key={candidate._id} className="result-row" style={{ marginBottom: '32px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 600 }}>
                                          <span style={{ fontSize: '0.95rem' }}>{candidate.name}</span>
                                          <span style={{ color: 'var(--primary)' }}>{count} votes ({percent.toFixed(1)}%)</span>
                                      </div>
                                      <div style={{ height: '14px', background: 'var(--border-subtle)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                                          <div style={{ 
                                              height: '100%', 
                                              width: `${percent}%`, 
                                              background: 'var(--grad-primary)',
                                              borderRadius: '10px',
                                              transition: 'width 1.5s cubic-bezier(0.1, 0, 0, 1)'
                                          }}></div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                </div>

                <div className="dashboard-side-col">
                  <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.2s' }}>
                      <h3 className="section-title">Organizational Turnout</h3>
                      <div className="demographics" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
                          <div>
                              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Department Distribution</p>
                              <div style={{ display: 'flex', gap: '4px', height: '10px' }}>
                                  {Object.keys(departmentTurnout || {}).map((dept, idx) => (
                                      <div 
                                          key={dept} 
                                          style={{ 
                                              flex: departmentTurnout[dept], 
                                              background: idx % 3 === 0 ? 'var(--primary)' : idx % 3 === 1 ? 'var(--secondary)' : 'var(--accent)', 
                                              borderRadius: '4px' 
                                          }}
                                      ></div>
                                  ))}
                              </div>
                          </div>
                          
                          <div className="demographic-legend" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {Object.entries(departmentTurnout || {}).map(([dept, count], idx) => {
                                const deptPercent = totalVotes > 0 ? (count / totalVotes * 100).toFixed(1) : 0;
                                return (
                                  <div key={dept} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ width: '8px', height: '8px', background: idx % 3 === 0 ? 'var(--primary)' : idx % 3 === 1 ? 'var(--secondary)' : 'var(--accent)', borderRadius: '50%' }}></span>
                                      <span style={{ color: 'var(--text-muted)' }}>{dept}</span>
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{deptPercent}% ({count})</span>
                                  </div>
                                );
                            })}
                            {Object.keys(departmentTurnout || {}).length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waiting for first ballots...</p>}
                          </div>

                          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                              🔒 Participation data is audited in real-time. Department-wise turnout helps monitor engagement across the institution.
                            </p>
                          </div>
                      </div>
                  </div>
                </div>
            </div>
        </div>
    );
};


export default Analytics;
