require('dotenv').config();
const app = require('./app');
const prisma = require('./config/database');
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏪  Store Rating Platform API Server                   ║
║                                                           ║
║   Server running on: http://localhost:${PORT}            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                         ║
║                                                           ║
║   API Endpoints:                                          ║
║   • Auth:   http://localhost:${PORT}/api/auth            ║
║   • Admin:  http://localhost:${PORT}/api/admin           ║
║   • User:   http://localhost:${PORT}/api/user            ║
║   • Store:  http://localhost:${PORT}/api/store           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
process.on('SIGINT', async () => {
    console.log('\n\n🔄 Shutting down gracefully...');
    await prisma.$disconnect();
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});
process.on('SIGTERM', async () => {
    console.log('\n\n🔄 Shutting down gracefully...');
    await prisma.$disconnect();
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});
