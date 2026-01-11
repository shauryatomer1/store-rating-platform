
const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);
    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            message: `${err.meta?.target?.[0] || 'Field'} already exists`,
        });
    }
    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Resource not found',
        });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
        });
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
module.exports = errorMiddleware;
