import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

const ProtectedRoute = ({ roles }) => {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        let redirectPath = '/student/dashboard';
        if (user.role === 'admin') redirectPath = '/admin/dashboard';
        else if (user.role === 'faculty') redirectPath = '/faculty/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
