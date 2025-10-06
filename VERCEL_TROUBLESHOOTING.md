# Vercel Deployment Troubleshooting Guide

## Current Error: 500 Internal Server Error on Login

### Common Causes:

1. **Missing Environment Variables** ❌
   - JWT_SECRET not set
   - MONGO_URI not set
   - CLIENT_URL not set

2. **MongoDB Connection Issues** ❌
   - Invalid connection string
   - IP not whitelisted (should be 0.0.0.0/0)
   - Database user credentials incorrect

3. **CORS Issues** ❌
   - Frontend URL not in allowed origins
   - Vercel serverless function timeout

---

## Step-by-Step Fix

### 1. Check Vercel Backend Environment Variables

Go to your Vercel project → Settings → Environment Variables

**Required Variables:**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/philosophyhub
JWT_SECRET=your-secret-key-min-32-chars
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NODE_ENV=production
```

### 2. Test Your Backend API

Visit these URLs to test:

1. **Root**: `https://philosophy-hub-2.vercel.app/`
   - Should return API info

2. **Test Route**: `https://philosophy-hub-2.vercel.app/api/test`
   - Shows environment status
   - Check if `mongoExists` and `jwtExists` are `true`

3. **Health Check**: Test a simple endpoint first before login

### 3. Check Vercel Logs

1. Go to your Vercel project
2. Click on "Deployments"
3. Click on the latest deployment
4. Click "View Function Logs"
5. Look for errors like:
   - "JWT_SECRET is not defined"
   - "MongoDB connection failed"
   - "Invalid credentials"

### 4. MongoDB Atlas Configuration

1. **IP Whitelist**:
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

2. **Database User**:
   - Go to Database Access
   - Ensure user has "Read and write to any database" permission
   - Check username and password are correct

3. **Connection String**:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/philosophyhub?retryWrites=true&w=majority
   ```
   - Replace `<username>` with your DB user
   - Replace `<password>` with your DB password
   - Don't include `<` and `>` symbols

### 5. Update Frontend VITE_BACKEND_URI

In Vercel frontend project → Settings → Environment Variables:

```env
VITE_BACKEND_URI=https://philosophy-hub-2.vercel.app
```

Then redeploy the frontend.

---

## Quick Debugging Commands

### Test Backend Locally First

```bash
cd server
npm start
```

Visit: `http://localhost:5000/api/test`

### Test Login Locally

```bash
# In one terminal (backend)
cd server
npm start

# In another terminal (frontend)
cd client
npm run dev
```

Try logging in at: `http://localhost:5173/login`

If it works locally but not on Vercel, it's an environment variable issue.

---

## Common Fixes

### Fix 1: JWT_SECRET Not Set
```
Error: JWT_SECRET is not defined
```

**Solution**: Add `JWT_SECRET` in Vercel environment variables

### Fix 2: MongoDB Connection Failed
```
Error: MongoServerError: bad auth
```

**Solution**: 
1. Check username/password in MONGO_URI
2. Ensure IP whitelist includes 0.0.0.0/0
3. Verify database user permissions

### Fix 3: CORS Error
```
Error: Not allowed by CORS
```

**Solution**: 
1. Add `CLIENT_URL` environment variable in Vercel
2. Set to your frontend URL: `https://your-frontend.vercel.app`
3. Redeploy backend

### Fix 4: Module Not Found
```
Error: Cannot find module './routes/authRoutes.js'
```

**Solution**: 
1. Ensure all imports have `.js` extension
2. Check file names match exactly (case-sensitive)
3. Redeploy

---

## Verification Checklist

Before testing login again:

- [ ] All environment variables set in Vercel backend
- [ ] MongoDB IP whitelist includes 0.0.0.0/0
- [ ] JWT_SECRET is at least 32 characters
- [ ] MONGO_URI is correct (test it locally first)
- [ ] CLIENT_URL matches your frontend Vercel URL
- [ ] Frontend VITE_BACKEND_URI matches backend URL
- [ ] Both frontend and backend redeployed after changes
- [ ] Test `/api/test` endpoint first
- [ ] Check Vercel function logs for errors

---

## Still Not Working?

### Check Vercel Function Logs

1. Vercel Dashboard → Your Project
2. Deployments → Latest Deployment
3. Click "View Function Logs"
4. Look for the actual error message
5. Share the error for more specific help

### Test Specific Routes

```bash
# Test backend root
curl https://philosophy-hub-2.vercel.app/

# Test API endpoint
curl https://philosophy-hub-2.vercel.app/api/test

# Test login (replace with actual credentials)
curl -X POST https://philosophy-hub-2.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Contact Information

If you see specific error messages in Vercel logs, share them for targeted debugging.

**Next Steps:**
1. Set all environment variables in Vercel
2. Redeploy backend
3. Test `/api/test` endpoint
4. Try login again
5. Check Vercel logs if still failing
