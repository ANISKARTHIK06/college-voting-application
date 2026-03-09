const StatCard = ({ icon, value, label, trend, trendType = 'up' }) => {
  return (
    <div className="stat-card glass-panel animate-slideUp">
      <div className="stat-card-header">
        <div className="stat-icon">{icon}</div>
        {trend && (
          <div className={`stat-trend ${trendType}`}>
            {trendType === 'up' ? '↗' : '↘'} {trend}%
          </div>
        )}
      </div>
      <div className="stat-card-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
