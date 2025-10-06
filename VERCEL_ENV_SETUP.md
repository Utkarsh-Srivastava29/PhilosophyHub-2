# Vercel Deployment - Environment Variables Checklist

## ⚠️ CRITICAL: Set These in Vercel Before Deploying

When deploying to Vercel, you **MUST** set these environment variables in your Vercel project settings, or your backend will crash with 500 errors.

---

## Backend (Server) Environment Variables

Go to: **Vercel Dashboard → Your Backend Project → Settings → Environment Variables**

Add these variables:

### Required Variables:

| Variable Name | Value                                                                             | Description                                                             |
| ------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `MONGO_URI`   | `mongodb+srv://stutkarsh291:stutkarsh@cluster0.pxqskap.mongodb.net/philosophyhub` | MongoDB Atlas connection string                                         |
| `JWT_SECRET`  | `123321`                                                                          | JWT secret for authentication (⚠️ Use a stronger secret in production!) |
| `PORT`        | `5000`                                                                            | Server port                                                             |
| `CLIENT_URL`  | `https://your-frontend-app.vercel.app`                                            | Your frontend URL (update after frontend deploy)                        |

### Optional (Email Features):

| Variable Name | Value                 | Description             |
| ------------- | --------------------- | ----------------------- |
| `SMTP_HOST`   | `smtp.gmail.com`      | SMTP server host        |
| `SMTP_PORT`   | `587`                 | SMTP server port        |
| `SMTP_USER`   | `lks992004@gmail.com` | Your email address      |
| `SMTP_PASS`   | `yjuk ckrm qtcu nabi` | Your Gmail app password |

---

## Frontend (Client) Environment Variables

Go to: **Vercel Dashboard → Your Frontend Project → Settings → Environment Variables**

Add this variable:

| Variable Name      | Value                                 | Description                                |
| ------------------ | ------------------------------------- | ------------------------------------------ |
| `VITE_BACKEND_URI` | `https://your-backend-app.vercel.app` | Your backend URL (from backend deployment) |

---

## 🚀 Deployment Order (IMPORTANT!)

### Step 1: Deploy Backend First

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import `PhilosophyHub-2` repository
4. **Framework Preset**: Other
5. **Root Directory**: Select `server`
6. **Build Command**: Leave empty
7. **Output Directory**: Leave empty
8. **Add all backend environment variables** (see table above)
9. Click "Deploy"
10. ✅ **Copy your backend URL** (e.g., `https://philosophy-hub-server.vercel.app`)

### Step 2: Deploy Frontend

1. Click "Add New Project" again
2. Import same repository
3. **Framework Preset**: Vite
4. **Root Directory**: Select `client`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Add environment variable:
   - `VITE_BACKEND_URI` = Your backend URL from Step 1
8. Click "Deploy"
9. ✅ **Copy your frontend URL** (e.g., `https://philosophy-hub.vercel.app`)

### Step 3: Update Backend CLIENT_URL

1. Go back to **backend project** in Vercel
2. Settings → Environment Variables
3. Update `CLIENT_URL` = Your frontend URL from Step 2
4. Go to Deployments → Latest → Three dots → **Redeploy**

---

## 🔍 Common 500 Errors & Solutions

### Error: "MONGO_URI is not defined"

**Solution**: Add `MONGO_URI` in Vercel environment variables

### Error: "Invalid token" / JWT errors

**Solution**: Make sure `JWT_SECRET` is set in backend environment variables

### Error: "CORS policy blocked"

**Solution**:

1. Verify `CLIENT_URL` is set correctly in backend
2. Make sure it matches your exact frontend URL
3. Redeploy backend after updating

### Error: "Cannot connect to database"

**Solution**:

1. Check MongoDB Atlas is running
2. Verify IP whitelist includes `0.0.0.0/0`
3. Verify connection string is correct (no typos in password)

---

## ✅ Testing Your Deployment

### Test Backend

Visit: `https://your-backend.vercel.app/api/test`

Should return:

```json
{
  "success": true,
  "message": "Backend is working!",
  "env": {
    "mongoExists": true,
    "jwtExists": true,
    "port": "5000"
  }
}
```

### Test Frontend

1. Visit your frontend URL
2. Try logging in
3. Create a seminar with an image
4. Verify all features work

---

## 📝 MongoDB Atlas Setup

### Whitelist IPs (IMPORTANT!)

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (`0.0.0.0/0`)
4. Click "Confirm"

**Why?** Vercel uses dynamic IPs, so we need to allow all IPs.

---

## 🔐 Security Notes

⚠️ **Before going to production:**

1. **Change JWT_SECRET** to a strong random string (32+ characters):

   ```bash
   # Generate using Node.js:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Review MongoDB whitelist** - Consider using MongoDB Atlas IP Access List for better security

3. **Use environment-specific secrets** - Different secrets for dev/staging/production

---

## 📞 Need Help?

If you get 500 errors:

1. Check Vercel deployment logs (Deployments → Click deployment → View Function Logs)
2. Verify all environment variables are set
3. Test backend `/api/test` endpoint
4. Check MongoDB Atlas connection

---

## Quick Reference

### Your Current Setup:

- **MongoDB**: `cluster0.pxqskap.mongodb.net/philosophyhub`
- **Local Backend**: `http://localhost:5000`
- **Local Frontend**: `http://localhost:5173`

### Production (After Deployment):

- **Backend**: `https://__________.vercel.app`
- **Frontend**: `https://__________.vercel.app`

---

Good luck with deployment! 🚀
