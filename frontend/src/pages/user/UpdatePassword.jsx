import { useState } from 'react';
import { authAPI } from '../../api';
import { validatePassword } from '../../utils/validators';

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
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

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) newErrors.newPassword = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccess(false);

        if (!validate()) return;

        setLoading(true);
        try {
            await authAPI.updatePassword(formData);
            setSuccess(true);
            setFormData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            setApiError(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h1>Update Password</h1>
            <p className="text-secondary">Change your account password</p>

            <div className="card" style={{ marginTop: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    {success && <div className="success-message">Password updated successfully!</div>}
                    {apiError && <div className="error-message">{apiError}</div>}

                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password *</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={errors.currentPassword ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.currentPassword && <span className="field-error">{errors.currentPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password *</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={errors.newPassword ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
                        <small className="field-hint">8-16 chars, 1 uppercase, 1 special character</small>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
