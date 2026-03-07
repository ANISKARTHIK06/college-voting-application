const Alerts = () => {
    const mockAlerts = [
        { title: 'Critical Security: Protocol Breach', desc: 'Multiple failed brute-force attempts on SuperAdmin layer detected from unauthorized geo-location.', severity: 'High', time: '10 mins ago', category: 'Security' },
        { title: 'Operational Risk: Low Engagement', desc: 'Library Policy referendum participation dropped 15% below threshold targets for the current cycle.', severity: 'Medium', time: '1 hour ago', category: 'Engagement' },
        { title: 'Information: Mass Ingress', desc: 'Accelerated user registration recorded from Mechanical Engineering faculty (45+ entities).', severity: 'Low', time: '3 hours ago', category: 'Growth' },
        { title: 'Protocol Conclusion: Election Fin', desc: 'Voting event ID #8841 concluded successfully with 92% integrity score verified.', severity: 'Low', time: '5 hours ago', category: 'Audit' },
        { title: 'Maintenance Directive: DB Sync', desc: 'Scheduled database optimization and cache flush initiated for weekend downtime window.', severity: 'Medium', time: 'Yesterday', category: 'System' },
    ];

    return (
        <div className="admin-content">
            <header style={{ marginBottom: '40px' }}>
                <h2 className="page-title">Response Command</h2>
                <p className="page-subtitle">Real-time threat monitoring and system status alerts.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {mockAlerts.map((alert, index) => (
                    <div
                        key={index}
                        className={`card-container severity-${alert.severity.toLowerCase()}`}
                        style={{
                            padding: '32px',
                            borderLeftWidth: '8px',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{
                                padding: '4px 12px',
                                background: '#f1f5f9',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '10px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                color: 'var(--admin-text-muted)'
                            }}>
                                {alert.category}
                            </span>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: '900',
                                color: alert.severity === 'High' ? '#ef4444' : alert.severity === 'Medium' ? '#f59e0b' : '#3b82f6'
                            }}>
                                {alert.severity.toUpperCase()} PRIORITY
                            </span>
                        </div>
                        <h3 style={{ fontSize: '19px', fontWeight: '800', marginBottom: '12px', color: 'var(--admin-text-main)' }}>{alert.title}</h3>
                        <p style={{ color: 'var(--admin-text-muted)', marginBottom: '24px', lineHeight: '1.7', fontSize: '14px', fontWeight: '500' }}>{alert.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>{alert.time}</div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-action btn-view" style={{ borderRadius: '8px', fontWeight: '800' }}>Archive</button>
                                <button className="btn-action btn-view" style={{ borderRadius: '8px', background: 'var(--admin-active)', color: 'white', fontWeight: '800' }}>Triage</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alerts;
