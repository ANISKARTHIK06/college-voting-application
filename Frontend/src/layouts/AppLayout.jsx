import { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Topbar from '../components/shared/Topbar';
import { Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import '../styles/AppLayout.css';

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = getCurrentUser();

    // Close sidebar on route change on mobile
    const handleSidebarClose = () => setMobileOpen(false);

    // Close sidebar when clicking overlay
    const handleOverlayClick = () => setMobileOpen(false);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleToggle = () => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            setMobileOpen(prev => !prev);
        } else {
            setCollapsed(prev => !prev);
        }
    };

    return (
        <div className="app-layout">
            {/* Mobile overlay backdrop */}
            {mobileOpen && (
                <div className="sidebar-overlay" onClick={handleOverlayClick} />
            )}

            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                role={user?.role}
                onClose={handleSidebarClose}
            />

            <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Topbar
                    onToggleSidebar={handleToggle}
                    collapsed={collapsed}
                />

                <div className="page-wrapper animate-fadeIn">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
