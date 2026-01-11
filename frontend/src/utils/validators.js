
export const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 20 || name.length > 60) {
        return 'Name must be between 20 and 60 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name can only contain letters and spaces';
    }
    return '';
};
export const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please provide a valid email address';
    }
    return '';
};
export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8 || password.length > 16) {
        return 'Password must be between 8 and 16 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    return '';
};
export const validateAddress = (address) => {
    if (!address) return 'Address is required';
    if (address.length > 400) {
        return 'Address must not exceed 400 characters';
    }
    return '';
};
export const validateRating = (rating) => {
    const num = parseInt(rating);
    if (isNaN(num) || num < 1 || num > 5) {
        return 'Rating must be between 1 and 5';
    }
    return '';
};
