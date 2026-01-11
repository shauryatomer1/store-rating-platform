import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validators';
import '../../styles/components/Auth.css';
const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    const validate = () => {
        const newErrors = {};
        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;
        const addressError = validateAddress(formData.address);
        if (addressError) newErrors.address = addressError;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        if (!validate()) return;
        setLoading(true);
        try {
            await authAPI.signup(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="success-message">
                        <h2>✅ Registration Successful!</h2>
                        <p>Redirecting you to login...</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>🏪 Store Rating Platform</h1>
                    <h2>Create Your Account</h2>
                    <p>Sign up to start rating stores</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {apiError && <div className="error-message">{apiError}</div>}
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                            placeholder="Enter your full name (20-60 characters)"
                            disabled={loading}
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                        <small className="field-hint">Letters and spaces only, 20-60 characters</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
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
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Create a strong password"
                            disabled={loading}
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                        <small className="field-hint">8-16 chars, 1 uppercase, 1 special character</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address *</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={errors.address ? 'error' : ''}
                            placeholder="Enter your complete address"
                            rows="3"
                            disabled={loading}
                        />
                        {errors.address && <span className="field-error">{errors.address}</span>}
                        <small className="field-hint">Maximum 400 characters</small>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Signup;
