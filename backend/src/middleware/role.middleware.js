/**
 * Middleware to check if user has required role(s)
 * @param {string[]} allowedRoles - Array of allowed roles
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        // Check if user has required role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access forbidden. Insufficient permissions.',
            });
        }

        next();
    };
};

module.exports = roleMiddleware;
