import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import '../../styles/components/AdminModal.css';
const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER'
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        fetchUsers();
    }, [sortBy, sortOrder]);
    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);
    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getUsers({ sortBy, order: sortOrder });
            setUsers(response.data.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
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
    const filterUsers = () => {
        let filtered = users;
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (roleFilter !== 'ALL') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        setFilteredUsers(filtered);
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
        if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.address || formData.address.length < 10) newErrors.address = 'Address must be at least 10 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            await adminAPI.addUser(formData);
            fetchUsers();
            setShowCreateModal(false);
            setFormData({ name: '', email: '', password: '', address: '', role: 'USER' });
            alert('User created successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };
    const handleRowClick = (user) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };
    if (loading) return <div className="loading-screen">Loading...</div>;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1>Manage Users</h1>
                    <p className="text-secondary">View and manage all platform users</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    + Create User
                </button>
            </div>
            { }
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <input
                        type="text"
                        placeholder="Search by name, email, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="ALL">All Roles</option>
                        <option value="USER">User</option>
                        <option value="STORE_OWNER">Store Owner</option>
                        <option value="ADMIN">Admin</option>
                    </select>
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
                            <th onClick={() => handleSort('role')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Role {getSortIcon('role')}
                            </th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            background: user.role === 'ADMIN' ? '#fef3c7' : user.role === 'STORE_OWNER' ? '#dbeafe' : '#d1fae5',
                                            color: user.role === 'ADMIN' ? '#92400e' : user.role === 'STORE_OWNER' ? '#1e40af' : '#065f46'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{user.address}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            { }
            {showCreateModal && (
                <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Create New User</h2>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-modal-body">
                            <div className="form-group">
                                <label htmlFor="name">Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? 'error' : ''}
                                    placeholder="Enter full name"
                                />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'error' : ''}
                                    placeholder="user@example.com"
                                />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? 'error' : ''}
                                    placeholder="Minimum 6 characters"
                                />
                                {errors.password && <span className="field-error">{errors.password}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address *</label>
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
                                    {submitting ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            { }
            {showDetailModal && selectedUser && (
                <div className="admin-modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>User Details</h2>
                            <button className="close-btn" onClick={() => setShowDetailModal(false)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="detail-row">
                                <strong>Name:</strong>
                                <span>{selectedUser.name}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Email:</strong>
                                <span>{selectedUser.email}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Role:</strong>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    background: selectedUser.role === 'ADMIN' ? '#fef3c7' : selectedUser.role === 'STORE_OWNER' ? '#dbeafe' : '#d1fae5',
                                    color: selectedUser.role === 'ADMIN' ? '#92400e' : selectedUser.role === 'STORE_OWNER' ? '#1e40af' : '#065f46'
                                }}>
                                    {selectedUser.role}
                                </span>
                            </div>
                            <div className="detail-row">
                                <strong>Address:</strong>
                                <span>{selectedUser.address}</span>
                            </div>
                            {selectedUser.role === 'STORE_OWNER' && selectedUser.store && (
                                <>
                                    <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Store Information</h3>
                                    <div className="detail-row">
                                        <strong>Store Name:</strong>
                                        <span>{selectedUser.store.name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <strong>Store Rating:</strong>
                                        <span>⭐ {selectedUser.store.averageRating?.toFixed(1) || 'N/A'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageUsers;
