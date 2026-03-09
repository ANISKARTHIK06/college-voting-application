import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser } from '../../services/authService';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const Topbar = ({ onToggleSidebar, collapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const user = getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to update topbar notifications');
    }
  };

  const markRead = async (id, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark read');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return user?.role === 'admin' ? 'Admin Console' : 'My Dashboard';
    if (path.includes('create-vote')) return 'Create New Vote';
    if (path.includes('active-votes') || path.includes('manage')) return 'Manage Votes';
    if (path.includes('users')) return 'User Management';
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('vote/')) return 'Voting Booth';
    if (path.includes('results')) return 'Results';
    if (path.includes('history')) return 'Vote History';
    if (path.includes('notifications')) return 'Notifications';
    return 'Platform';
  };

  return (
    <header className={`topbar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="breadcrumb">
          <span className="breadcrumb-root">Platform</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{getPageTitle()}</span>
        </div>
      </div>

      <div className="topbar-right">
        <button 
          className="topbar-icon-btn" 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        <div className="notif-dropdown-wrapper">
          <button className="topbar-icon-btn" onClick={() => setShowDropdown(!showDropdown)} aria-label="Notifications">
            <BellIcon />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showDropdown && (
            <div className="notif-dropdown glass-panel animate-slideUp">
              <div className="notif-dropdown-header">
                <span>Recent Alerts</span>
                <Link to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'faculty' ? '/faculty/announcements' : '/student/notifications'} onClick={() => setShowDropdown(false)}>View All</Link>
              </div>
              <div className="notif-dropdown-list">
                {notifications.length > 0 ? notifications.map(n => (
                  <div 
                    key={n._id} 
                    className={`notif-dropdown-item ${!n.isRead ? 'unread' : ''}`}
                    onClick={() => { navigate(user?.role === 'student' ? '/student/notifications' : '/faculty/announcements'); setShowDropdown(false); }}
                  >
                    <div className="notif-item-icon">
                      {n.type === 'election' ? '🗳️' : n.type === 'result' ? '🏆' : '🔔'}
                    </div>
                    <div className="notif-item-body">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-time">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    {!n.isRead && (
                      <button className="notif-item-mark" onClick={(e) => markRead(n._id, e)}>Read</button>
                    )}
                  </div>
                )) : (
                  <div className="notif-dropdown-empty">Zero alerts to report.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="topbar-user">
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.name || 'Guest'}</span>
            <span className="topbar-user-role">{user?.userType || user?.role || 'member'}</span>
          </div>
          <div className="topbar-avatar">{getInitials(user?.name)}</div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
