# Deploying to Vercel

This project is configured for seamless deployment on Vercel. However, since Vercel is "Serverless", there are a few specific requirements you must follow.

## 1. Database Requirement (CRITICAL)
You **CANNOT** use your local database (`localhost`) on Vercel. You must use a cloud-hosted PostgreSQL database.

**Recommendation:**
- **[Neon.tech](https://neon.tech)** (Easiest, fast, free tier)
- **[Supabase](https://supabase.com)** (Free tier)

1. Sign up for one of the above.
2. Create a new project.
3. Get the **Connection String** (e.g., `postgres://user:pass@ep-xyz.region.neondb.cloud/dbname...`).

## 2. Environment Variables
In your Vercel Project Settings > **Environment Variables**, add the following:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your **Cloud** Database connection string |
| `JWT_SECRET` | A strong random string (e.g. generated earlier) |
| `VITE_API_URL` | `/api` (See note below) |
| `NODE_ENV` | `production` |

**Note on `VITE_API_URL`**: Since we are deploying both frontend and backend on the same Vercel project, the frontend can access the backend via the relative path `/api`. Set this specific value: `/api`.

## 3. How to Deploy

1. **Push to GitHub**: Ensure all your changes (including `vercel.json` and `backend/api/index.js`) are pushed.
2. **Import in Vercel**:
    - Go to [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New...** -> **Project**.
    - Select your GitHub repository (`store-rating-platform`).
    - **Framework Preset**: Vercel should detect `Vite` or `Other`. If it detects Vite, it might auto-configure the Root Directory to `frontend`. **DO NOT** change the Root Directory setting globally if you want the monorepo config to work, OR ensure the Build Settings override is correct.
    - **IMPORTANT**: With `vercel.json` at the root, simply leave the settings as default (Root Directory: `.`). Vercel will read `vercel.json`.

3. **Deploy**: Click Deploy.

## 4. Post-Deployment Steps (Database Migration)
Since your production database is fresh and empty, you need to run migrations.

**Option A: Connect Locally**
1. Update your local `.env` to point `DATABASE_URL` to your **Cloud** database.
2. Run `npx prisma migrate deploy` locally. 
   *(This applies the schema to the cloud DB).*
3. (Optional) Run `npx prisma db seed` if you have seed data.

**Option B: Vercel Command (Advanced)**
You can set the "Build Command" in Vercel for the backend, but running migrations during build is tricky in serverless. **Option A is recommended.**
