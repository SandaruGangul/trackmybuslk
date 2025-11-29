# TrackMyBusLK Deployment Guide

This guide will help you deploy your TrackMyBusLK application to the cloud.

## Architecture

- **Frontend**: React.js → Vercel
- **Backend**: Node.js/Express → Render
- **Database**: MongoDB → MongoDB Atlas

---

## Part 1: MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Verify your email

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose "M0 FREE" tier
3. Select region: Singapore (closest to Sri Lanka)
4. Name cluster: `trackmybuslk-cluster`
5. Click "Create"

### 3. Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `trackmybuslk-admin`
4. Click "Autogenerate Secure Password" - **SAVE THIS PASSWORD!**
5. Set privileges: "Read and write to any database"
6. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Database"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string:
   ```
   mongodb+srv://trackmybuslk-admin:<password>@trackmybuslk-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your saved password
6. Add database name before the `?`:
   ```
   mongodb+srv://trackmybuslk-admin:YOUR_PASSWORD@trackmybuslk-cluster.xxxxx.mongodb.net/trackmybuslk?retryWrites=true&w=majority
   ```

**SAVE THIS CONNECTION STRING!**

---

## Part 2: Deploy Backend to Render

### 1. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/trackmybuslk.git
git branch -M main
git push -u origin main
```

### 2. Sign Up for Render
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render

### 3. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `trackmybuslk-backend`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free

### 4. Add Environment Variables

In Render Environment section:

1. **MONGODB_URI**
   - Value: Your MongoDB Atlas connection string

2. **JWT_SECRET**
   - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Copy the output

3. **NODE_ENV**
   - Value: `production`

4. **FRONTEND_URL**
   - Value: `http://localhost:3000` (will update after frontend deployment)

5. **PORT**
   - Value: `10000` (Render's default)

### 5. Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://trackmybuslk-backend.onrender.com`
4. **SAVE THIS URL!**

### 6. Test Backend
Visit: `https://trackmybuslk-backend.onrender.com/health`

Should see:
```json
{
  "status": "ok",
  "timestamp": "2024-11-29T...",
  "mongodb": "connected"
}
```

---

## Part 3: Deploy Frontend to Vercel

### 1. Sign Up for Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 2. Import Project
1. Click "Add New..." → "Project"
2. Import your `trackmybuslk` repository
3. Vercel detects it's a monorepo

### 3. Configure Project

**Framework Preset**: Create React App

**Root Directory**: 
- Click "Edit"
- Select `client` folder
- Click "Continue"

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### 4. Add Environment Variables

Click "Environment Variables":

1. **REACT_APP_API_URL**
   - Value: Your Render backend URL (e.g., `https://trackmybuslk-backend.onrender.com`)

2. **REACT_APP_SOCKET_URL**
   - Value: Same as API URL (e.g., `https://trackmybuslk-backend.onrender.com`)

### 5. Deploy
1. Click "Deploy"
2. Wait 3-5 minutes
3. You'll get: `https://trackmybuslk.vercel.app`

### 6. Update Backend CORS
1. Go to Render dashboard
2. Select backend service
3. Update `FRONTEND_URL` environment variable:
   - Value: Your Vercel URL (e.g., `https://trackmybuslk.vercel.app`)
4. Backend will auto-redeploy

---

## Part 4: Seed Production Database

### 1. Create Seed Script

The seed script is already in `server/seedProduction.js` (if not, ask me to create it)

### 2. Run Seed Script

```bash
cd server

# Windows CMD:
set MONGODB_URI=your-mongodb-atlas-connection-string
node seedProduction.js

# Windows PowerShell:
$env:MONGODB_URI="your-mongodb-atlas-connection-string"
node seedProduction.js

# Mac/Linux:
MONGODB_URI=your-mongodb-atlas-connection-string node seedProduction.js
```

---

## Testing Checklist

Visit your Vercel URL: `https://trackmybuslk.vercel.app`

- [ ] Register a new user
- [ ] Login with demo credentials (demo@trackmybuslk.com / password123)
- [ ] View bus routes
- [ ] Click on a route to see details
- [ ] Submit a bus update
- [ ] Check if update appears
- [ ] Open two browser tabs and test real-time updates
- [ ] Test user profile/leaderboard

---

## Important URLs

- **Frontend**: `https://trackmybuslk.vercel.app`
- **Backend**: `https://trackmybuslk-backend.onrender.com`
- **MongoDB Atlas**: https://cloud.mongodb.com

## Demo Credentials

- **Email**: demo@trackmybuslk.com
- **Password**: password123

---

## Troubleshooting

### CORS Error
- Verify `FRONTEND_URL` in Render matches Vercel URL exactly
- Redeploy backend after updating

### Socket.io Connection Failed
- Check `REACT_APP_SOCKET_URL` in Vercel
- Verify backend Socket.io CORS includes frontend URL

### MongoDB Connection Timeout
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify connection string is correct

### Service Unavailable (After Inactivity)
- Normal for Render free tier (sleeps after 15 min)
- First request takes 30-60 seconds to wake up

---

## Cost Summary

| Service | Free Tier |
|---------|-----------|
| MongoDB Atlas | 512MB storage |
| Render | 750 hours/month (sleeps after 15 min) |
| Vercel | Unlimited (100GB bandwidth/month) |

**Total: $0/month**

---

## Redeployment

### Frontend
```bash
git add .
git commit -m "Update frontend"
git push
# Auto-deploys to Vercel
```

### Backend
```bash
git add .
git commit -m "Update backend"
git push
# Auto-deploys to Render
```

---

Good luck with your deployment! 🚀
