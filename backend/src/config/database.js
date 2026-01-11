const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with error logging
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
