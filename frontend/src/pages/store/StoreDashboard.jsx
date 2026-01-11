import { useState, useEffect } from 'react';
import { storeAPI } from '../../api';

const StoreDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await storeAPI.getDashboard();
            setDashboard(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading...</div>;
    if (!dashboard) return <div>No store data available</div>;

    return (
        <div>
            <h1>Store Dashboard</h1>
            <h2 className="text-secondary" style={{ fontWeight: 'normal', marginTop: '0.5rem' }}>
                {dashboard.store.name}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="card">
                    <h3>⭐ Average Rating</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                        {dashboard.statistics.averageRating.toFixed(1)}
                    </p>
                </div>
                <div className="card">
                    <h3>📊 Total Ratings</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {dashboard.statistics.totalRatings}
                    </p>
                </div>
            </div>

            <h2 style={{ marginTop: '2rem' }}>Rating Distribution</h2>
            <div className="card" style={{ marginTop: '1rem' }}>
                {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ width: '60px' }}>⭐ {rating}</span>
                            <div style={{ flex: 1, height: '24px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        background: 'var(--primary-color)',
                                        width: `${(dashboard.statistics.ratingDistribution[rating] / dashboard.statistics.totalRatings * 100) || 0}%`,
                                        transition: 'width 0.3s ease'
                                    }}
                                />
                            </div>
                            <span style={{ width: '40px', textAlign: 'right' }}>{dashboard.statistics.ratingDistribution[rating]}</span>
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={{ marginTop: '2rem' }}>Recent Ratings</h2>
            <div className="table-container" style={{ marginTop: '1rem' }}>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Rating</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboard.recentRatings.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No ratings yet
                                </td>
                            </tr>
                        ) : (
                            dashboard.recentRatings.map((rating) => (
                                <tr key={rating.id}>
                                    <td>{rating.user.name}</td>
                                    <td>{rating.user.email}</td>
                                    <td>⭐ {rating.rating}</td>
                                    <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreDashboard;
