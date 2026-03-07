import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AppLayout from './layouts/AppLayout';

// Shared Components
import ProtectedRoute from './components/shared/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateVote from './pages/admin/CreateVote';
import UsersManagement from './pages/admin/UsersManagement';
import Analytics from './pages/admin/Analytics';
import ActiveVotes from './pages/admin/ActiveVotes';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import VotingInterface from './pages/user/VotingInterface';
import VoteResults from './pages/user/VoteResults';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-vote" element={<CreateVote />} />
            <Route path="/admin/active-votes" element={<ActiveVotes />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/analytics/:id" element={<Analytics />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute roles={['user', 'admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/vote/:id" element={<VotingInterface />} />
            <Route path="/user/results" element={<VoteResults />} />
            <Route path="/user/active-votes" element={<UserDashboard />} />
            <Route path="/user/history" element={<VoteResults />} />
          </Route>
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
