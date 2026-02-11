import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Vote, History, HelpCircle, Bell, User, FileText } from 'lucide-react';
import Button from '../components/ui/Button';

const Sidebar = ({ isOpen, toggle, currentPage, onPageChange, userRole, onRoleChange }) => {
    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
        ...(userRole === 'Student' ? [
            { label: 'Active Elections', icon: Vote, id: 'dashboard' },
            { label: 'Submit Proposal', icon: FileText, id: 'active' }, // Mapping for demo
            { label: 'Voting History', icon: History, id: 'history' },
        ] : [
            { label: 'System Console', icon: Vote, id: 'admin' },
            { label: 'Audit Logs', icon: FileText, id: 'audit' },
        ]),
        { label: 'Support', icon: HelpCircle, id: 'support' },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
        >
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <span className="text-xl font-bold tracking-tight">College<span className="text-primary-600">Vote</span></span>
            </div>
            <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => onPageChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id
                            ? 'bg-primary-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Role Switcher Demo */}
            <div className="mx-4 mt-6 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">Switch View (Demo)</span>
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg">
                    <button
                        onClick={() => onRoleChange('Student')}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${userRole === 'Student' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Student
                    </button>
                    <button
                        onClick={() => onRoleChange('Admin')}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${userRole === 'Admin' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Admin
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans ${userRole === 'Admin' ? 'bg-red-900/50 text-red-200' : 'bg-slate-700 text-white'}`}>
                        {userRole === 'Admin' ? 'AD' : 'AK'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold truncate leading-none">{userRole === 'Admin' ? 'Super Admin' : 'Anis Khan'}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold mt-1">{userRole}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const TopBar = ({ toggleSidebar, userRole, onLogout }) => (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
            <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
                <Menu className="w-6 h-6" />
            </button>
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 border rounded-full ${userRole === 'Admin' ? 'bg-red-50 border-red-100' : 'bg-success-50 border-green-100'}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${userRole === 'Admin' ? 'bg-error-600' : 'bg-success-600'}`}></div>
                <span className={`text-xs font-bold ${userRole === 'Admin' ? 'text-error-600' : 'text-success-600'}`}>{userRole === 'Admin' ? 'Admin Access' : 'System Secure'}</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <Button variant="ghost" size="sm" className="text-error-600 hover:bg-red-50" onClick={onLogout}>
                Sign Out
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Profile
            </Button>
        </div>
    </header>
);

const AppLayout = ({ children, onLogout, currentPage, onPageChange, userRole, onRoleChange }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handlePageChange = (pageId) => {
        onPageChange(pageId);
        setSidebarOpen(false); // Close sidebar on mobile after selection
    };

    const handleRoleChange = (role) => {
        onRoleChange(role);
        // Page reset is handled in handleRoleChange in App.jsx or here
        onPageChange('dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                toggle={() => setSidebarOpen(!isSidebarOpen)}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                userRole={userRole}
                onRoleChange={handleRoleChange}
            />

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className="lg:pl-64 transition-all duration-300">
                <TopBar toggleSidebar={() => setSidebarOpen(true)} userRole={userRole} onLogout={onLogout} />
                <main className="p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
