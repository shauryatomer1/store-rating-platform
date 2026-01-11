import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';
import '../../styles/components/Auth.css';
const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    const validate = () => {
        const newErrors = {};
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await authAPI.login(formData);
            const { user, token } = response.data.data;
            login(user, token);
        } catch (error) {
            setApiError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>🏪 Store Rating Platform</h1>
                    <h2>Welcome Back</h2>
                    <p>Please login to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {apiError && <div className="error-message">{apiError}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <strong> Demo Admin:</strong>
                        </p>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div>Email: <strong>admin@platform.com</strong></div>
                            <div>Password: <strong>Admin@123</strong></div>
                        </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <strong> Demo Store Owner:</strong>
                        </p>
                        <div style={{ fontSize: '0.85rem' }}>
                            <div>Email: <strong>owner@store.com</strong></div>
                            <div>Password: <strong>Store@123</strong></div>
                        </div>
                    </div>
                </div>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/signup">Sign up here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Login;
