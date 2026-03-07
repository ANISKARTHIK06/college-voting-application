const StatCard = ({ icon, value, label, trend }) => {
    return (
        <div className="glass-card stat-card">
            <div className="stat-header">
                <span className="stat-icon-box">{icon}</span>
                {trend && (
                    <span className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div className="stat-body">
                <h3 className="stat-value">{value}</h3>
                <p className="stat-label">{label}</p>
            </div>
        </div>
    );
};

export default StatCard;
