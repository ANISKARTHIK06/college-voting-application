import { useState, useEffect } from 'react';
import StatCard from '../../components/shared/StatCard';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
    const stats = [
        { icon: '👥', value: '1,240', label: 'Registered Voters', trend: 12 },
        { icon: '🗳️', value: '8', label: 'Active Elections', trend: 2 },
        { icon: '📊', value: '78.5%', label: 'Avg. Participation', trend: 5.4 },
        { icon: '🛡️', value: '100%', label: 'System Integrity', trend: 0 },
    ];

    const activities = [
        { title: 'New Election Created', time: '10 mins ago', desc: 'Student Council President 2026 is now live.' },
        { title: 'Voter Registration', time: '1 hour ago', desc: 'Jane Smith (Staff) joined the platform.' },
        { title: 'Result Published', time: '3 hours ago', desc: 'Library Timings Poll results are now public.' },
        { title: 'System Audit', time: '5 hours ago', desc: 'Routine security scan completed successfully.' },
    ];

    return (
        <div className="admin-dashboard-page">
            <div className="dashboard-header animate-slideUp">
                <h2 className="section-title">Administrative Overview</h2>
                <div className="stats-grid">
                    {stats.map((s, i) => <StatCard key={i} {...s} />)}
                </div>
            </div>

            <div className="dashboard-main-grid animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="glass-panel main-chart-section" style={{ padding: '32px' }}>
                    <div className="section-title">
                        <h3>Election Participation</h3>
                        <div className="chart-filters">
                            <button className="btn-small glass-card">Weekly</button>
                        </div>
                    </div>
                    {/* Mock chart representation */}
                    <div className="mock-chart-container" style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '20px 0' }}>
                        {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} style={{ 
                                flex: 1, 
                                height: `${h}%`, 
                                background: 'linear-gradient(to top, var(--primary), var(--secondary))',
                                borderRadius: '8px 8px 0 0',
                                position: 'relative'
                            }}>
                                <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 700 }}>{h}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="chart-labels" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="glass-panel activity-section" style={{ padding: '32px' }}>
                    <h3 className="section-title">Live Feed</h3>
                    <div className="activity-list">
                        {activities.map((a, i) => (
                            <div key={i} className="activity-item">
                                <div className="activity-dot"></div>
                                <div className="activity-content">
                                    <h4>{a.title}</h4>
                                    <p>{a.desc}</p>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{a.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-auth" style={{ width: '100%', marginTop: '24px', padding: '10px' }}>
                        View System Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
