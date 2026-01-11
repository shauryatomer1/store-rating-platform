const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const storeRoutes = require('./routes/store.routes');
const errorMiddleware = require('./middleware/error.middleware');
const prisma = require('./config/database');
const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async (req, res) => {
    // Check Env Vars (without revealing values)
    const envCheck = {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
    };

    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            success: true,
            message: 'Store Rating Platform API',
            database: 'Connected ✅',
            env: envCheck,
            version: '1.0.0',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Store Rating Platform API',
            database: 'Connection Failed ❌',
            env: envCheck,
            error: error.message,
            version: '1.0.0',
        });
    }
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
app.use(errorMiddleware);
module.exports = app;
