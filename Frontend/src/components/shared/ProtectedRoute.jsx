import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const ProtectedRoute = ({ roles }) => {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
