import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/components/Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const getRoleLinks = () => {
        switch (user.role) {
            case 'ADMIN':
                return (
                    <>
                        <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/admin/stores" className="nav-link">Stores</Link>
                        <Link to="/admin/users" className="nav-link">Users</Link>
                    </>
                );
            case 'USER':
                return (
                    <>
                        <Link to="/user/stores" className="nav-link">Browse Stores</Link>
                        <Link to="/user/password" className="nav-link">Update Password</Link>
                    </>
                );
            case 'STORE_OWNER':
                return (
                    <>
                        <Link to="/store/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/store/password" className="nav-link">Update Password</Link>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <h2>🏪 Store Rating Platform</h2>
                </div>

                <div className="nav-links">
                    {getRoleLinks()}
                </div>

                <div className="nav-user">
                    <span className="user-info">
                        <strong>{user.name}</strong>
                        <small>({user.role})</small>
                    </span>
                    <button onClick={logout} className="btn btn-secondary">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
