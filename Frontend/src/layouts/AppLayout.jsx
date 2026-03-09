import { useState } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Topbar from '../components/shared/Topbar';
import { Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import '../styles/AppLayout.css';

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const user = getCurrentUser();

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} role={user?.role} />
            
            <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Topbar 
                    onToggleSidebar={() => setCollapsed(!collapsed)} 
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
