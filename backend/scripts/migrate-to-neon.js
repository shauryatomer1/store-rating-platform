const { PrismaClient } = require('@prisma/client');

// Check arguments
if (process.argv.length < 3) {
    console.error('❌ Error: Please provide the Neon Database URL as an argument.');
    console.error('Usage: node scripts/migrate-to-neon.js <NEON_DATABASE_URL>');
    process.exit(1);
}

const neonUrl = process.argv[2];

// Initialize Clients
const localPrisma = new PrismaClient(); // Uses .env DATABASE_URL
const remotePrisma = new PrismaClient({
    datasources: {
        db: {
            url: neonUrl,
        },
    },
});

async function main() {
    console.log('🚀 Starting migration to Neon DB...');
    console.log(`Target: ${neonUrl.replace(/:[^:]*@/, ':****@')}`); // Hide password in log

    // 1. Migrate Stores 
    // (User depends on Store via Foreign Key storeId, so Stores must exist first)
    console.log('\n📦 Fetching Stores from local DB...');
    const stores = await localPrisma.store.findMany();
    console.log(`Found ${stores.length} stores.`);

    if (stores.length > 0) {
        console.log('  Upserting stores...');
        for (const store of stores) {
            await remotePrisma.store.upsert({
                where: { id: store.id },
                update: { ...store },
                create: { ...store },
            });
        }
        console.log('  ✅ Stores migrated.');
    }

    // 2. Migrate Users
    console.log('\n👤 Fetching Users from local DB...');
    const users = await localPrisma.user.findMany();
    console.log(`Found ${users.length} users.`);

    if (users.length > 0) {
        console.log('  Upserting users...');
        for (const user of users) {
            await remotePrisma.user.upsert({
                where: { id: user.id },
                update: { ...user },
                create: { ...user },
            });
        }
        console.log('  ✅ Users migrated.');
    }

    // 3. Migrate Ratings
    console.log('\n⭐ Fetching Ratings from local DB...');
    const ratings = await localPrisma.rating.findMany();
    console.log(`Found ${ratings.length} ratings.`);

    if (ratings.length > 0) {
        console.log('  Upserting ratings...');
        for (const rating of ratings) {
            await remotePrisma.rating.upsert({
                where: { id: rating.id },
                update: { ...rating },
                create: { ...rating },
            });
        }
        console.log('  ✅ Ratings migrated.');
    }

    console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
}

main()
    .catch((e) => {
        console.error('\n❌ Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await localPrisma.$disconnect();
        await remotePrisma.$disconnect();
    });
