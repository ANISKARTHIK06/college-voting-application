import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser } from '../../services/authService';

const Topbar = ({ onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const user = getCurrentUser();

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
    };

    return (
        <header className="topbar glass-panel">
            <div className="topbar-left">
                <button className="menu-toggle" onClick={onToggleSidebar}>
                    ☰
                </button>
                <div className="breadcrumb">
                    <span>Platform</span>
                    <span className="separator">/</span>
                    <span className="current">{user?.role === 'admin' ? 'Admin Console' : 'User Portal'}</span>
                </div>
            </div>

            <div className="topbar-right">
                <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                
                <div className="notifications-btn">
                    🔔 <span className="badge">3</span>
                </div>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{user?.userType || user?.role}</span>
                    </div>
                    <div className="user-avatar">
                        {getInitials(user?.name)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
