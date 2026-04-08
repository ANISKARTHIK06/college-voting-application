import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import http from '@/config/http';
import {
  LayoutDashboard,
  Vote,
  Users,
  LineChart,
  Megaphone,
  Settings,
  Clock,
  CheckCircle,
  UserCircle,
  Bell,
  RefreshCw,
  ClipboardList,
  LogOut,
  Plus,
  X
} from 'lucide-react';

const adminItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} />, section: 'OVERVIEW' },
  { label: 'Elections', path: '/admin/active-votes', icon: <Vote size={18} />, section: 'GOVERNANCE' },
  { label: 'Election Requests', path: '/admin/election-requests', icon: <CheckCircle size={18} /> },
  { label: 'Users', path: '/admin/users', icon: <Users size={18} /> },
  { label: 'Announcements', path: '/admin/announcements', icon: <Megaphone size={18} />, section: 'COMMUNITY' },
  { label: 'Notifications', path: '/admin/notifications', icon: <Bell size={18} /> },
  { label: 'Activity Logs', path: '/admin/activity', icon: <ClipboardList size={18} /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <LineChart size={18} />, section: 'REPORTS' },
  { label: 'Profile', path: '/admin/profile', icon: <UserCircle size={18} />, section: 'ACCOUNT' },
];

const facultyItems = [
  { label: 'Dashboard', path: '/faculty/dashboard', icon: <LayoutDashboard size={18} />, section: 'OVERVIEW' },
  { label: 'Create Election', path: '/faculty/create-election', icon: <Plus size={18} />, section: 'GOVERNANCE' },
  { label: 'Election Monitoring', path: '/faculty/monitoring', icon: <CheckCircle size={18} /> },
  { label: 'Approve Proposals', path: '/faculty/approve-proposals', icon: <CheckCircle size={18} /> },
  { label: 'Results', path: '/faculty/results', icon: <CheckCircle size={18} />, section: 'REPORTS' },
  { label: 'Announcements', path: '/faculty/announcements', icon: <Megaphone size={18} />, section: 'COMMUNITY' },
  { label: 'Profile', path: '/faculty/profile', icon: <UserCircle size={18} />, section: 'ACCOUNT' },
];

const studentItems = [
  { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={18} />, section: 'OVERVIEW' },
  { label: 'Active Votes', path: '/student/active-votes', icon: <Vote size={18} />, section: 'VOTING' },
  { label: 'My History', path: '/student/history', icon: <RefreshCw size={18} /> },
  { label: 'Results', path: '/student/results', icon: <CheckCircle size={18} /> },
  { label: 'Request Election', path: '/student/request-election', icon: <Clock size={18} /> },
  { label: 'Announcements', path: '/student/announcements', icon: <Megaphone size={18} />, section: 'COMMUNITY' },
  { label: 'Profile', path: '/student/profile', icon: <UserCircle size={18} />, section: 'ACCOUNT' },
];

const getNavItems = (role) => {
  if (role === 'admin') return adminItems;
  if (role === 'faculty') return facultyItems;
  return studentItems;
};

const Sidebar = ({ collapsed, mobileOpen, role, onClose }) => {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuItems = getNavItems(role);

  const fetchDataCounts = async () => {
    try {
      if (['admin', 'faculty'].includes(role)) {
        const reqRes = await http.get('/election-requests');
        setPendingCount(reqRes.data.filter(r => r.status === 'pending').length);
      }
      const notifRes = await http.get('/notifications');
      setUnreadCount(notifRes.data.filter(n => !n.isRead).length);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchDataCounts();
    const interval = setInterval(fetchDataCounts, 30000); // 30s poll
    return () => clearInterval(interval);
  }, [role]);

  let lastSection = null;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">🗳️</div>
        {!collapsed && (
          <div style={{ flex: 1 }}>
            <div className="brand-name">CollegeVote</div>
            <div className="brand-tagline">Governance Platform</div>
          </div>
        )}
        {/* Mobile close button */}
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const showSection = !collapsed && item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          const isActive = location.pathname === item.path;

          return (
            <div key={index}>
              {showSection && (
                <div className="nav-section-label">{item.section}</div>
              )}
              <Link
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
                onClick={onClose}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {item.label === 'Approve Proposals' && pendingCount > 0 && !collapsed && (
                  <span style={{ 
                    marginLeft: 'auto', background: '#f59e0b', color: 'white', 
                    fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', 
                    borderRadius: '10px', boxShadow: '0 2px 8px rgba(245,158,11,0.3)'
                  }}>
                    {pendingCount}
                  </span>
                )}
                {item.label === 'Approve Proposals' && pendingCount > 0 && collapsed && (
                   <span style={{ 
                    position: 'absolute', top: '8px', right: '8px', 
                    width: '6px', height: '6px', background: '#f59e0b', 
                    borderRadius: '50%', border: '1px solid var(--bg-card)'
                  }} />
                )}
                {item.label === 'Notifications' && unreadCount > 0 && !collapsed && (
                  <span style={{ 
                    marginLeft: 'auto', background: '#ef4444', color: 'white', 
                    fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', 
                    borderRadius: '10px', boxShadow: '0 2px 8px rgba(239,68,68,0.3)'
                  }}>
                    {unreadCount}
                  </span>
                )}
                {item.label === 'Notifications' && unreadCount > 0 && collapsed && (
                   <span style={{ 
                    position: 'absolute', top: '8px', right: '8px', 
                    width: '6px', height: '6px', background: '#ef4444', 
                    borderRadius: '50%', border: '1px solid var(--bg-card)'
                  }} />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link
          to="/login"
          className="nav-link logout-link"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            onClose?.();
          }}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <span className="nav-icon" style={{ color: 'var(--danger)' }}><LogOut size={18} /></span>
          <span className="nav-text" style={{ color: 'var(--danger)' }}>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
