# 🔧 Setup & Troubleshooting Guide

## Current Issues & Solutions

### ✅ Frontend Issue - RESOLVED
**Problem**: `Cannot find module "../hooks/useAuth"`  
**Solution**: Updated import path in `ProtectedRoute.jsx` from `../hooks/useAuth` to `../../hooks/useAuth.js`  
**Status**: Fixed ✅

### ⚠️ Backend Issue - Prisma Client Generation

**Problem**: Prisma cannot generate the client due to DATABASE_URL environment variable not being read.

**Error**:
```
Error: environment variable not found: DATABASE_URL
```

**Root Cause**: The .env file is not being read properly by Prisma, possibly due to encoding issues or Prisma configuration problems.

## 🛠️ Solution Steps

### Option 1: Manual DATABASE_URL in schema.prisma (Quick Fix)

Temporarily hardcode the DATABASE_URL in the Prisma schema:

1. Open `backend/prisma/schema.prisma`
2. Replace line 10:
   ```prisma
   url      = env("DATABASE_URL")
   ```
   With:
   ```prisma
   url      = "postgresql://postgres:postgres@localhost:5432/store_rating_db?schema=public"
   ```

3. Run:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **After successful generation**, revert back to `env("DATABASE_URL")` to use environment variables.

### Option 2: Use dotenv-cli (Recommended for Development)

1. Install dotenv-cli:
   ```bash
   cd backend
   npm install -D dotenv-cli
   ```

2. Update `package.json` scripts:
   ```json
   "scripts": {
     "start": "node src/server.js",
     "dev": "nodemon src/server.js",
     "prisma:generate": "dotenv -e .env.local -- npx prisma generate",
     "prisma:migrate": "dotenv -e .env.local -- npx prisma migrate dev"
   }
   ```

3. Run:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

### Option 3: Fresh PostgreSQL Database Setup

If you haven't created the database yet:

1. **Start PostgreSQL** and create the database:
   ```sql
   CREATE DATABASE store_rating_db;
   ```

2. **Update .env.local** with YOUR PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/store_rating_db?schema=public"
   ```

3. Copy to .env:
   ```bash
   Copy-Item .env.local .env
   ```

4. Try generating again:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

## 📝 Complete Setup Checklist

### Backend Setup

- [ ] **PostgreSQL Running**: Ensure PostgreSQL service is running
- [ ] **Database Created**: `store_rating_db` database exists
- [ ] **Environment File**: `.env` or `.env.local` exists with correct DATABASE_URL
- [ ] **Prisma Generate**: Run `npx prisma generate`
- [ ] **Prisma Migrate**: Run `npx prisma migrate dev --name init`
- [ ] **Create Admin User**: Use Prisma Studio (`npx prisma studio`) or SQL
- [ ] **Start Server**: `npm run dev`

### Frontend Setup

- [x] **Dependencies Installed**: `npm install` completed
- [x] **Import Paths Fixed**: useAuth import corrected
- [ ] **Backend Running**: Backend API must be running on port 5000
- [ ] **Environment File**: `.env` with `VITE_API_URL=http://localhost:5000/api`
- [ ] **Start Dev Server**: `npm run dev`

## 🎯 Quick Start Commands

### Terminal 1 - Backend
```bash
cd backend

# FIRST: Choose one option to fix Prisma:
# Option A - Hardcode URL in schema.prisma (see Option 1 above)
# Option B - Use dotenv-cli (see Option 2 above)  
# Option C - Ensure .env has correct DATABASE_URL

npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## 🔍 Verification

### Check if Backend is Running
```bash
# Should return API info
curl http://localhost:5000
```

### Check if Frontend is Running
- Open browser: `http://localhost:5173`
- Should see login page

### Check Prisma Client
```bash
cd backend
node -e "const { PrismaClient } = require('@prisma/client'); console.log('Prisma OK!');"
```

## 🐛 Common Issues

### Issue: "Cannot find module '@prisma/client'"
**Solution**: Run `npx prisma generate` in backend directory

### Issue: "P1001: Can't reach database server"
**Solution**: 
- Ensure PostgreSQL is running
- Check DATABASE_URL credentials
- Verify database exists

### Issue: "Frontend shows blank page"
**Solution**:
- Check browser console for errors
- Ensure backend is running
- Verify VITE_API_URL in frontend/.env

### Issue: "CORS error in browser"
**Solution**: Backend CORS is configured for `http://localhost:5173` - ensure frontend runs on this port

## 📞 Next Steps After Setup

1. **Create Admin User** via Prisma Studio:
   ```bash
   cd backend
   npx prisma studio
   ```
   - Navigate to `users` table
   - Click "Add record"
   - Fill in:
     - name: "System Administrator Account" (20+ chars)
     - email: "admin@platform.com"
     - password: Use bcrypt hash (see below)
     - address: "123 Admin Street, City"
     - role: "ADMIN"

2. **Generate Bcrypt Hash** for password:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('Admin@123', 10))"
   ```

3. **Test the Application**:
   - Visit `http://localhost:5173`
   - Sign up as a normal user
   - Login with admin credentials
   - Test all functionalities

## 💡 Tips

- The frontend useAuth issue has been fixed ✅
- Focus on getting Prisma client generated first
- Use Option 1 (hardcode DATABASE_URL) for quickest solution
- Remember to create the PostgreSQL database before migrating
- Check that PostgreSQL service is running

---

**Status**: Frontend ready ✅ | Backend needs Prisma setup ⚠️
