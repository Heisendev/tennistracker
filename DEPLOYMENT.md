# Tennis Tracker - Deployment Guide

This guide explains how to deploy both the frontend and backend of Tennis Tracker.

## Architecture

- **Frontend**: React + Vite (Deploy to Vercel)
- **Backend**: Express.js + SQLite (Deploy to Render.com or Railway)

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free at vercel.com)
- GitHub account with this repository

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Connect your GitHub account and select this repository
   - Click "Import"

3. **Configure Build Settings**
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - Click "Deploy"

4. **Add Environment Variables**
   - After deployment, go to Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com` (update with actual backend URL)
   - Redeploy

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain

---

## Backend Deployment (Render.com)

### Option A: Using Render.com (Recommended)

#### Prerequisites
- Render account (free at render.com)
- GitHub connected to Render

#### Steps

1. **Prepare Backend for Render**
   ```bash
   cd server
   ```

2. **Create `render.yaml`** in server directory:
   ```yaml
   services:
     - type: web
       name: tennis-tracker-api
       env: node
       startCommand: npm start
       buildCommand: npm install
       envVars:
         - key: NODE_ENV
           value: production
   ```

3. **Push changes to GitHub**

4. **Deploy on Render**
   - Go to [render.com/dashboard](https://dashboard.render.com)
   - Click "New+" → "Web Service"
   - Connect GitHub repository
   - Select the `server` directory (if it asks)
   - Set:
     - **Name**: `tennis-tracker-api`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Region**: Choose nearest to you
   - Click "Create Web Service"

5. **Configure Database**
   - Render will persist SQLite in `/data` directory
   - Files in `.gitignore` won't be deployed
   - On first deploy, run migrations manually via SSH or initialize database through API

6. **Get Backend URL**
   - Copy the URL from Render dashboard (e.g., `https://tennis-tracker-api.onrender.com`)
   - Update `VITE_API_URL` in Vercel with this URL
   - Redeploy frontend

### Option B: Using Railway.app

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add plugin → PostgreSQL (or SQLite if preferred)
5. Set environment variables
6. Deploy

### Option C: Using Fly.io

1. Install `flyctl`
2. Run `fly launch` in server directory
3. Configure app settings
4. Run `fly deploy`

---

## Database Considerations

### SQLite on Deployment Platforms

Your backend uses **SQLite**, which stores data in local files. Here's how it works on different platforms:

**How it works:**
- The database file is stored in the `database/` directory
- On first startup (deployment), the database is automatically created and initialized with tables
- All subsequent requests use the same database file

**Database Persistence:**
- **Render.com** ✅ - Default storage is persistent between deploys
- **Railway.app** ✅ - Can configure persistent volumes
- **Fly.io** ✅ - Can mount persistent volumes
- **Vercel** ❌ - Not recommended (serverless, stateless file system)

### Automatic Database Initialization

The database automatically initializes on the **first server startup**:
1. Creates all necessary tables if they don't exist
2. Seeds default players and sample matches
3. Subsequent requests reuse the existing database

**No manual setup required!** Just deploy and the database will be ready.

### Database Files

The `.gitignore` excludes the database from version control:
```
database/*  # Local database files are not committed
```

This is intentional because:
- Database files are large and binary
- Each environment (dev, staging, prod) needs its own data
- Deployment platforms auto-initialize the database

### Backup & Data Persistence

For production deployments:
1. **Render** - Use their backup features to regularly backup SQLite databases
2. **Railway** - Configure backup services in dashboard
3. Consider upgrading to PostgreSQL for larger scale applications

---

## Troubleshooting

### CORS Issues
Add these to `server.js`:
```javascript
import cors from 'cors';
app.use(cors({
  origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Database Connection Issues
- Ensure `database/` directory exists and is writable
- Check file permissions on the server
- Verify database file isn't corrupted after migration

### API Not Responding
- Check backend is running: Visit your backend URL in browser
- Verify `VITE_API_URL` is correct in Vercel environment
- Check CORS configuration
- Review backend logs on Render/Railway dashboard

---

## Monitoring & Updates

1. **Backend Logs** → View on Render/Railway dashboard
2. **Frontend Analytics** → Vercel Analytics (enable in settings)
3. **Auto-redeploy** → Push to main branch, both services auto-deploy
4. **Keep dependencies updated** → Regularly run `npm update`

---

## Production Checklist

- [ ] Backend URL set in Vercel `VITE_API_URL`
- [ ] CORS configured for production domain
- [ ] Database initialized on backend
- [ ] SSL/HTTPS enabled (automatic on Vercel and Render)
- [ ] Environment variables secured
- [ ] Error handling in place
- [ ] API rate limiting considered
- [ ] Database backups configured (for production systems)

