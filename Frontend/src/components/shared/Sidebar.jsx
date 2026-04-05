import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
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
  LogOut
} from 'lucide-react';

const adminItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} />, section: 'OVERVIEW' },
  { label: 'Elections', path: '/admin/active-votes', icon: <Vote size={18} />, section: 'GOVERNANCE' },
  { label: 'Election Requests', path: '/admin/election-requests', icon: <RefreshCw size={18} /> },
  { label: 'Users', path: '/admin/users', icon: <Users size={18} /> },
  { label: 'Announcements', path: '/admin/announcements', icon: <Megaphone size={18} /> },

  { label: 'Activity Logs', path: '/admin/activity', icon: <ClipboardList size={18} /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <LineChart size={18} />, section: 'REPORTS' },
  { label: 'Profile', path: '/admin/profile', icon: <UserCircle size={18} />, section: 'ACCOUNT' },
];

const facultyItems = [
  { label: 'Dashboard', path: '/faculty/dashboard', icon: <LayoutDashboard size={18} />, section: 'OVERVIEW' },
  { label: 'Election Monitoring', path: '/faculty/monitoring', icon: <Vote size={18} />, section: 'MONITORING' },
  { label: 'Candidates', path: '/faculty/candidates', icon: <Users size={18} /> },
  { label: 'Participation Stats', path: '/faculty/statistics', icon: <LineChart size={18} />, section: 'REPORTS' },
  { label: 'Results', path: '/faculty/results', icon: <CheckCircle size={18} /> },
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
  { label: 'Notifications', path: '/student/notifications', icon: <Bell size={18} /> },
  { label: 'Profile', path: '/student/profile', icon: <UserCircle size={18} />, section: 'ACCOUNT' },
];

const getNavItems = (role) => {
  if (role === 'admin') return adminItems;
  if (role === 'faculty') return facultyItems;
  return studentItems;
};

const Sidebar = ({ collapsed, role }) => {
  const location = useLocation();
  const menuItems = getNavItems(role);
  let lastSection = null;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">🗳️</div>
        {!collapsed && (
          <div>
            <div className="brand-name">CollegeVote</div>
            <div className="brand-tagline">Governance Platform</div>
          </div>
        )}
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
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link
          to="/login"
          className="nav-link logout-link"
          onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); }}
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
