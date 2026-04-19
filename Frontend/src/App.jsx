import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Shared Components & Layouts
import ProtectedRoute from './components/shared/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateVote from './pages/admin/CreateVote';
import ActiveVotes from './pages/admin/ActiveVotes';
import UsersManagement from './pages/admin/UsersManagement';
import Analytics from './pages/admin/Analytics';
import CandidateManager from './pages/admin/CandidateManager';

import ElectionRequests from './pages/admin/ElectionRequests';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserActiveVotes from './pages/user/UserActiveVotes';
import VotingInterface from './pages/user/VotingInterface';
import VoteResults from './pages/user/VoteResults';
import Notifications from './pages/user/Notifications';
import MyHistory from './pages/user/MyHistory';

// New Phase 3 Components
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ActivityLogs from './pages/admin/ActivityLogs';
import Announcements from './pages/user/Announcements';
import CandidateProfile from './pages/user/CandidateProfile';
import UserProfile from './pages/user/UserProfile';
import ElectionRequest from './pages/user/ElectionRequest';

import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyCreateElection from './pages/faculty/FacultyCreateElection';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
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
            <Route path="/admin/announcements" element={<ManageAnnouncements />} />
            <Route path="/admin/activity" element={<ActivityLogs />} />
            <Route path="/admin/analytics/:id" element={<Analytics />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/candidates/:id" element={<CandidateManager />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/profile" element={<UserProfile />} />
            <Route path="/admin/election-requests" element={<ElectionRequests />} />
          </Route>
        </Route>

        {/* Protected Faculty Routes */}
        <Route element={<ProtectedRoute roles={['faculty', 'admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/create-election" element={<FacultyCreateElection />} />
            <Route path="/faculty/monitoring" element={<ActiveVotes />} />
            <Route path="/faculty/candidates" element={<CandidateManager />} />
            <Route path="/faculty/candidates/:id" element={<CandidateManager />} />
            <Route path="/faculty/statistics" element={<Analytics />} />
            <Route path="/faculty/statistics/:id" element={<Analytics />} />
            <Route path="/faculty/results" element={<VoteResults />} />
            <Route path="/faculty/results/:id" element={<VoteResults />} />
            <Route path="/faculty/announcements" element={<ManageAnnouncements />} />
            <Route path="/faculty/approve-proposals" element={<ElectionRequests />} />
            <Route path="/faculty/notifications" element={<Notifications />} />
            <Route path="/faculty/profile" element={<UserProfile />} />
            <Route path="/faculty/users" element={<UsersManagement />} />
          </Route>
        </Route>

        {/* Protected Student Routes (Allow admin/faculty to view too if needed) */}
        <Route element={<ProtectedRoute roles={['student', 'faculty', 'admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/student/dashboard" element={<UserDashboard />} />
            <Route path="/student/vote/:id" element={<VotingInterface />} />
            <Route path="/student/results" element={<VoteResults />} />
            <Route path="/student/active-votes" element={<UserActiveVotes />} />
            <Route path="/student/history" element={<MyHistory />} />
            <Route path="/student/announcements" element={<Announcements />} />
            <Route path="/student/candidate/:id" element={<CandidateProfile />} />
            <Route path="/student/notifications" element={<Notifications />} />
            <Route path="/student/profile" element={<UserProfile />} />
            <Route path="/student/request-election" element={<ElectionRequest />} />
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
