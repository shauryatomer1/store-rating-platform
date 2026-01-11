import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (user.role === 'USER') {
            return <Navigate to="/user/stores" replace />;
        } else if (user.role === 'STORE_OWNER') {
            return <Navigate to="/store/dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }
    return children;
};
export default ProtectedRoute;
