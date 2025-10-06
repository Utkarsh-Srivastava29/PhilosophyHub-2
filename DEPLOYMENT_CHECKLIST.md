# PhilosophyHub - Quick Deployment Checklist ✅

## Before You Deploy

### 1. MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster
- [ ] Create database user with password
- [ ] Copy connection string
- [ ] Whitelist all IPs (0.0.0.0/0) in Network Access

### 2. Prepare Repository

- [ ] Push code to GitHub/GitLab/Bitbucket
- [ ] Make sure `.env` files are NOT committed (check .gitignore)

---

## Backend Deployment (Do This First!)

### 1. Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your repository
4. **Root Directory**: Select `server`
5. **Framework**: Other
6. Click "Deploy"

### 2. Add Environment Variables

Go to Project Settings → Environment Variables and add:

| Variable         | Example Value                                               |
| ---------------- | ----------------------------------------------------------- |
| `MONGO_URI`      | `mongodb+srv://user:pass@cluster.mongodb.net/philosophyhub` |
| `JWT_SECRET`     | `your-random-32-character-secret-key`                       |
| `PORT`           | `5000`                                                      |
| `EMAIL_USER`     | `your-email@gmail.com`                                      |
| `EMAIL_PASSWORD` | `your-gmail-app-password`                                   |
| `CLIENT_URL`     | (Leave empty for now, update after frontend deploy)         |

### 3. Get Backend URL

- [ ] After deployment, copy your backend URL
- [ ] Example: `https://philosophy-hub-server.vercel.app`

---

## Frontend Deployment (Do This Second!)

### 1. Deploy to Vercel

1. In Vercel, click "Add New Project" again
2. Import the **same** repository
3. **Root Directory**: Select `client`
4. **Framework**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

### 2. Add Environment Variable

Go to Project Settings → Environment Variables and add:

| Variable           | Value                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| `VITE_BACKEND_URI` | Your backend URL from above (e.g., `https://philosophy-hub-server.vercel.app`) |

### 3. Get Frontend URL

- [ ] After deployment, copy your frontend URL
- [ ] Example: `https://philosophy-hub.vercel.app`

---

## Final Step: Update Backend

### Update CLIENT_URL

1. Go back to your **backend** project in Vercel
2. Settings → Environment Variables
3. Update `CLIENT_URL` with your frontend URL
4. **Redeploy** the backend (Deployments → Three dots → Redeploy)

---

## Test Your Deployment

### Backend Tests

- [ ] Visit `https://your-backend.vercel.app/api/test`
- [ ] Should see: `{"success": true, "message": "Backend is working!"}`

### Frontend Tests

- [ ] Visit your frontend URL
- [ ] Try logging in
- [ ] Create a seminar with an image
- [ ] Verify image displays correctly
- [ ] Check all pages work

---

## Quick Environment Variables Reference

### What You Need:

**MongoDB Connection String:**

```
mongodb+srv://username:password@cluster.mongodb.net/philosophyhub?retryWrites=true&w=majority
```

**JWT Secret (generate a random one):**

```bash
# Generate using Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Gmail App Password:**

- Go to Google Account → Security
- Enable 2-Factor Authentication
- Generate App Password for "Mail"

---

## Troubleshooting

### "CORS Error"

- Update `CLIENT_URL` in backend env variables
- Must match your exact frontend URL
- Redeploy backend after updating

### "Cannot connect to database"

- Check MongoDB Atlas IP whitelist
- Verify connection string is correct
- Make sure password doesn't contain special characters (URL encode if needed)

### "Images not loading"

- Check browser console for errors
- Verify image URLs are accessible
- Test with a different image URL

### "Login not working"

- Check `VITE_BACKEND_URI` in frontend
- Verify JWT_SECRET is set in backend
- Check backend logs in Vercel

---

## Pro Tips 💡

1. **Use Environment Variables Everywhere**

   - Never hardcode URLs or secrets
   - Always use `process.env.VARIABLE_NAME`

2. **Test Locally First**

   ```bash
   # Backend
   cd server && npm start

   # Frontend
   cd client && npm run dev
   ```

3. **Check Vercel Logs**

   - Go to Deployments → Click on deployment
   - View "Building" and "Runtime" logs

4. **Automatic Deployments**
   - Push to `main` branch = Production deploy
   - Push to other branches = Preview deploy

---

## Your Deployment URLs

Fill these in after deployment:

- **Backend**: `https://_____________________.vercel.app`
- **Frontend**: `https://_____________________.vercel.app`
- **MongoDB**: `mongodb+srv://_____________.mongodb.net/philosophyhub`

---

## Need Help?

1. Read `DEPLOYMENT.md` for detailed instructions
2. Check Vercel deployment logs
3. Verify all environment variables are set correctly
4. Make sure MongoDB Atlas IP whitelist includes 0.0.0.0/0

---

**Ready to deploy?** Follow the steps above in order! 🚀
