import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ collapsed, role }) => {
    const location = useLocation();
    const { theme } = useTheme();

    const adminItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Console' },
        { path: '/admin/create-vote', icon: '➕', label: 'Create Vote' },
        { path: '/admin/active-votes', icon: '🗳️', label: 'Manage Votes' },
        { path: '/admin/users', icon: '👥', label: 'Users' },
        { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
    ];

    const userItems = [
        { path: '/user/dashboard', icon: '🏠', label: 'Dashboard' },
        { path: '/user/active-votes', icon: '🗳️', label: 'Active Votes' },
        { path: '/user/history', icon: '🕒', label: 'My History' },
        { path: '/user/results', icon: '📊', label: 'Results' },
    ];

    const menuItems = role === 'admin' ? adminItems : userItems;

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''} glass-panel`}>
            <div className="sidebar-header">
                <span className="logo-icon">🗳️</span>
                {!collapsed && <span className="logo-text">CollegeVote</span>}
            </div>
            
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-text">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <Link to="/login" className="nav-link logout-link" onClick={() => localStorage.clear()}>
                    <span className="nav-icon">🚪</span>
                    {!collapsed && <span className="nav-text">Sign Out</span>}
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
