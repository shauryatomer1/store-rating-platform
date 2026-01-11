import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchDashboard();
    }, []);
    const fetchDashboard = async () => {
        try {
            const response = await adminAPI.getDashboard();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <div className="loading-screen">Loading...</div>;
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="card">
                    <h3>👥 Total Users</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats?.totalUsers || 0}</p>
                </div>
                <div className="card">
                    <h3>🏪 Total Stores</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{stats?.totalStores || 0}</p>
                </div>
                <div className="card">
                    <h3>⭐ Total Ratings</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{stats?.totalRatings || 0}</p>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;
