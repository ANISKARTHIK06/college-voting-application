import React, { useState } from 'react';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProposalSubmission from './pages/ProposalSubmission';
import Login from './pages/Login';
import Results from './pages/Results';
import AuditLog from './pages/AuditLog';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userRole, setUserRole] = useState('Student');

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    if (userRole === 'Admin') return <AdminDashboard />;
    if (currentPage === 'active') return <ProposalSubmission />; // Demo mapping
    if (currentPage === 'history') return <Results />;
    if (currentPage === 'audit') return <AuditLog />;
    return <Dashboard />;
  };

  return (
    <AppLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      userRole={userRole}
      onRoleChange={setUserRole}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
