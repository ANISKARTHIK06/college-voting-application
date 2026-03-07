import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Topbar from '../components/shared/Topbar';
import { getCurrentUser } from '../services/authService';
import '../styles/AppLayout.css';

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const user = getCurrentUser();

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} role={user?.role} />
            <main className={`main-container ${collapsed ? 'expanded' : ''}`}>
                <Topbar onToggleSidebar={() => setCollapsed(!collapsed)} />
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
