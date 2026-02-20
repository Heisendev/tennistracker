# Quick Deployment Steps

## 1. Prepare Your Repository

Make sure all changes are committed:
```bash
git add .
git commit -m "Prepare for Vercel and Render deployment"
git push origin main
```

## 2. Deploy Frontend to Vercel (5 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework: **Vite**
4. Deploy
5. Go to **Settings → Environment Variables**
6. Add: `VITE_API_URL` = `https://your-backend-url.com` (you'll update this after backend is deployed)
7. **Redeploy** to apply environment variables

## 3. Deploy Backend to Render (5 minutes)

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect GitHub and select your repository
4. Fill in:
   - **Name**: `tennis-tracker-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Create Web Service**
6. Wait for deployment to complete
7. Copy the service URL (e.g., `https://tennis-tracker-api.onrender.com`)

## 4. Connect Frontend to Backend

1. Go back to Vercel project
2. Settings → Environment Variables
3. Update `VITE_API_URL` with your Render backend URL
4. Trigger a redeploy
5. Your app is live! 🎉

## Verify Deployment

- Frontend: https://your-vercel-domain.vercel.app
- Backend Health: https://your-backend-url.com/health

---

## Troubleshooting

**App loads but no data shows:**
- Check browser console for network errors
- Verify `VITE_API_URL` is correct in Vercel
- Check CORS is configured (should be automatic)

**Backend deployment fails:**
- Check Render logs in the dashboard
- Ensure `server/` directory is in the repository
- Verify `package.json` exists in `server/` directory

**Database issues:**
- On first deploy, the database needs to be initialized
- SSH into Render and run: `npm run init-db`
- Or access the API endpoint to trigger database creation

---

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.
