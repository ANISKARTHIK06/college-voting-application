import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const AnalyticsSection = () => {
  // Mock data for analytics
  const dailyData = [
    { name: 'Mon', votes: 450 },
    { name: 'Tue', votes: 520 },
    { name: 'Wed', votes: 480 },
    { name: 'Thu', votes: 610 },
    { name: 'Fri', votes: 550 },
    { name: 'Sat', votes: 320 },
    { name: 'Sun', votes: 210 },
  ];

  const deptData = [
    { name: 'Engineering', count: 850 },
    { name: 'Science', count: 620 },
    { name: 'Arts', count: 480 },
    { name: 'Commerce', count: 590 },
    { name: 'Medical', count: 310 },
  ];

  const turnoutData = [
    { name: 'Participated', value: 1240 },
    { name: 'No Vote', value: 302 },
  ];

  const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)', 'var(--info)'];
  const PIE_COLORS = ['var(--primary)', 'var(--border)'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{label || payload[0].name}</p>
          <p style={{ color: payload[0].color || payload[0].fill }}>
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-section" style={{ marginTop: '32px' }}>
      <h3 className="section-title" style={{ marginBottom: '20px' }}>Election Intelligence</h3>
      
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Line Chart: Daily Activity */}
        <div className="dashboard-card glass-panel animate-slideUp">
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>Daily Voting Activity</h4>
          <div style={{ height: 260, width: '100%', minHeight: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    boxShadow: 'var(--shadow)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="votes" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--bg-card)' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Dept Participation */}
        <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>Participation by Faculty</h4>
          <div style={{ height: 240, width: '100%', minHeight: 240 }}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[0, 4, 4, 0]} 
                  barSize={12}
                  animationDuration={1500}
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Distribution */}
        <div className="dashboard-card glass-panel animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>Total Turnout Distribution</h4>
          <div style={{ height: 240, width: '100%', minHeight: 240 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={turnoutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {turnoutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
