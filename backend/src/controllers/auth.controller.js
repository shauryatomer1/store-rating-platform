const authService = require('../services/auth.service');
const signup = async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        if (error.message.includes('Invalid email or password')) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await authService.updatePassword(
            req.user.id,
            currentPassword,
            newPassword
        );
        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        if (error.message.includes('incorrect')) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};
module.exports = {
    signup,
    login,
    updatePassword,
};
