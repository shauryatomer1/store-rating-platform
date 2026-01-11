import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import '../../styles/components/AdminModal.css';
const ManageStores = () => {
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        fetchStores();
    }, [sortBy, sortOrder]);
    useEffect(() => {
        filterStores();
    }, [stores, searchTerm]);
    const fetchStores = async () => {
        try {
            const response = await adminAPI.getStores({ sortBy, order: sortOrder });
            setStores(response.data.data.stores);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };
    const getSortIcon = (column) => {
        if (sortBy !== column) return '↕';
        return sortOrder === 'asc' ? '↑' : '↓';
    };
    const filterStores = () => {
        let filtered = stores;
        if (searchTerm) {
            filtered = filtered.filter(store =>
                store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredStores(filtered);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name || formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
        if (!formData.address || formData.address.length < 10) newErrors.address = 'Address must be at least 10 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            await adminAPI.addStore(formData);
            fetchStores();
            setShowCreateModal(false);
            setFormData({ name: '', email: '', address: '' });
            alert('Store created successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create store');
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) return <div className="loading-screen">Loading...</div>;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1>Manage Stores</h1>
                    <p className="text-secondary">View and manage all registered stores</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    + Create Store
                </button>
            </div>
            {}
            <div style={{ marginBottom: '2rem' }}>
                <div className="form-group" style={{ marginBottom: 0, maxWidth: '500px' }}>
                    <input
                        type="text"
                        placeholder="Search by name, email, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Name {getSortIcon('name')}
                            </th>
                            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Email {getSortIcon('email')}
                            </th>
                            <th>Address</th>
                            <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Average Rating {getSortIcon('rating')}
                            </th>
                            <th>Total Ratings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStores.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No stores found
                                </td>
                            </tr>
                        ) : (
                            filteredStores.map((store) => (
                                <tr key={store.id}>
                                    <td>{store.name}</td>
                                    <td>{store.email}</td>
                                    <td>{store.address}</td>
                                    <td>⭐ {store.averageRating.toFixed(1)}</td>
                                    <td>{store.totalRatings}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {}
            {showCreateModal && (
                <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Create New Store</h2>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-modal-body">
                            <div className="form-group">
                                <label htmlFor="name">Store Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? 'error' : ''}
                                    placeholder="Enter store name"
                                />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Store Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'error' : ''}
                                    placeholder="store@example.com"
                                />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Store Address *</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={errors.address ? 'error' : ''}
                                    placeholder="Enter full address"
                                    rows="3"
                                />
                                {errors.address && <span className="field-error">{errors.address}</span>}
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Creating...' : 'Create Store'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageStores;
