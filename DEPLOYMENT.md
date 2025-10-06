# PhilosophyHub - Vercel Deployment Guide

This guide will help you deploy both the frontend (client) and backend (server) to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account for database (https://www.mongodb.com/cloud/atlas)
3. Git repository (GitHub, GitLab, or Bitbucket)

---

## Part 1: Deploy Backend (Server) to Vercel

### Step 1: Prepare Your Repository

1. Push your code to a Git repository (GitHub recommended)
2. Make sure the `server/vercel.json` file exists (already created)

### Step 2: Deploy on Vercel

1. Go to https://vercel.com and log in
2. Click "Add New Project"
3. Import your Git repository
4. Select the **server** folder as the root directory
5. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

### Step 3: Set Environment Variables

In the Vercel project settings, add these environment variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/philosophyhub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Important**:

- Replace `MONGO_URI` with your actual MongoDB Atlas connection string
- Generate a strong random string for `JWT_SECRET`
- Update `CLIENT_URL` after deploying the frontend (Step 4)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

---

## Part 2: Deploy Frontend (Client) to Vercel

### Step 1: Deploy on Vercel

1. In Vercel dashboard, click "Add New Project" again
2. Import the same Git repository
3. Select the **client** folder as the root directory
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables

In the Vercel project settings, add this environment variable:

```
VITE_BACKEND_URI=https://your-backend.vercel.app
```

**Important**: Replace with your actual backend URL from Part 1, Step 4

### Step 3: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your frontend will be live at `https://your-frontend.vercel.app`

---

## Part 3: Update Backend CORS

### Step 1: Update Backend Environment Variable

1. Go to your **backend** Vercel project settings
2. Update the `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://your-frontend.vercel.app
   ```
3. Redeploy the backend

---

## Part 4: MongoDB Atlas Configuration

### Whitelist Vercel IPs

1. Go to MongoDB Atlas dashboard
2. Navigate to "Network Access"
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, consider using MongoDB Atlas IP Access List for Vercel
   - Vercel uses dynamic IPs, so this is the simplest approach

### Verify Connection

1. Make sure your MongoDB connection string is correct
2. Test the connection by visiting: `https://your-backend.vercel.app/api/test`

---

## Part 5: Testing Your Deployment

### Test Backend

Visit these endpoints:

- `https://your-backend.vercel.app/api/test` - Should return success message
- `https://your-backend.vercel.app/api/seminars` - Should return seminars data

### Test Frontend

1. Visit `https://your-frontend.vercel.app`
2. Try logging in
3. Create a seminar or content
4. Verify all features work

---

## Environment Variables Summary

### Backend (.env)

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/philosophyhub
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (.env)

```
VITE_BACKEND_URI=https://your-backend.vercel.app
```

---

## Troubleshooting

### CORS Errors

- Make sure `CLIENT_URL` in backend matches your frontend URL
- Redeploy backend after updating `CLIENT_URL`

### MongoDB Connection Failed

- Verify your connection string is correct
- Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- Ensure your database user has proper permissions

### Environment Variables Not Loading

- Environment variables must start with `VITE_` for frontend
- Redeploy after adding/updating environment variables
- Check Vercel deployment logs for errors

### 404 Errors on Frontend Routes

- The `vercel.json` file handles SPA routing
- Make sure it's in the client folder

---

## Continuous Deployment

Once set up, Vercel will automatically deploy:

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

---

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update environment variables with new domain

---

## Security Best Practices

1. **Never commit `.env` files** (already in .gitignore)
2. Use strong JWT_SECRET (at least 32 characters)
3. Enable MongoDB Atlas IP Access List if possible
4. Regularly rotate secrets
5. Use HTTPS for all API calls (Vercel provides this automatically)

---

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Check deployment logs in Vercel dashboard

---

## Quick Deploy Commands

### Local Testing Before Deploy

```bash
# Test backend locally
cd server
npm start

# Test frontend locally
cd client
npm run dev

# Build frontend (to verify it builds successfully)
cd client
npm run build
```

---

Good luck with your deployment! 🚀
