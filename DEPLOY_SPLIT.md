# Split Deployment Guide

This project is configured for a split deployment:
- **Backend**: Deployed on **Render** (as a Web Service)
- **Frontend**: Deployed on **Vercel** (as a Static Site)

## Part 1: Backend (Render)

1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  **Root Directory**: `backend` (Important!)
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    -   `DATABASE_URL`: Your Neon DB URL.
    -   `JWT_SECRET`: Your secret key.
    -   `NODE_ENV`: `production`
    -   `FRONTEND_URL`: `https://your-vercel-frontend-url.vercel.app` (You can add this later after deploying frontend).

> Copy your **Render Backend URL** (e.g., `https://my-api.onrender.com`).

## Part 2: Frontend (Vercel)

1.  Create a new Project on Vercel.
2.  Connect your GitHub repository.
3.  **Root Directory**: `frontend` (Important!)
    -   Click "Edit" next to Root Directory and select `frontend`.
4.  **Environment Variables**:
    -   `VITE_API_URL`: Paste your **Render Backend URL** here.
        -   **IMPORTANT**: Append `/api` at the end.
        -   Example: `https://my-api.onrender.com/api`
5.  Deploy.

## Part 3: Final Connection
Once Frontend is live, go back to Render and update the `FRONTEND_URL` variable if you haven't already, so CORS works perfectly.
