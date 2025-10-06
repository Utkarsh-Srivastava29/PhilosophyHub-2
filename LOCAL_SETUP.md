# Local Development Setup

## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd PhilosophyHub-main
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### 3. Environment Variables

#### Backend (.env file in server folder)

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/philosophyhub
JWT_SECRET=your-secret-key-min-32-characters
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env file in client folder)

```bash
cd client
cp .env.example .env
```

The file should already have:

```
VITE_BACKEND_URI=http://localhost:5000
```

### 4. Start Development Servers

#### Terminal 1 - Backend

```bash
cd server
npm start
```

Server runs on: http://localhost:5000

#### Terminal 2 - Frontend

```bash
cd client
npm run dev
```

Frontend runs on: http://localhost:5173 (or 5174 if 5173 is busy)

### 5. Test the Application

Visit: http://localhost:5173

---

## Development Workflow

### Making Changes

1. **Backend changes** (server folder)

   - API routes, controllers, models
   - Restart server after changes: `Ctrl+C` then `npm start`

2. **Frontend changes** (client folder)
   - Components, pages, styles
   - Hot reload automatic (no restart needed)

### Testing Features

1. **User Registration/Login**

   - Create a philosopher account
   - Create a student (enthusiast) account

2. **Create Content**

   - Login as philosopher
   - Create articles with images

3. **Create Seminars**

   - Add seminar with image URL
   - Verify image displays on seminars page

4. **Doubts/Questions**
   - Post questions
   - Answer questions

---

## Common Issues

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error

- Verify your MONGO_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure internet connection is stable

### CORS Errors

- Make sure backend is running on port 5000
- Verify `CLIENT_URL` in backend .env
- Check frontend uses correct `VITE_BACKEND_URI`

---

## Project Structure

```
PhilosophyHub-main/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Images, icons
│   ├── .env               # Frontend environment variables
│   └── package.json       # Frontend dependencies
│
└── server/                # Express Backend
    ├── controller/        # Request handlers
    ├── models/           # MongoDB schemas
    ├── routes/           # API routes
    ├── middleware/       # Auth middleware
    ├── config/           # Configuration files
    ├── .env              # Backend environment variables
    └── package.json      # Backend dependencies
```

---

## Useful Commands

### Backend

```bash
cd server
npm start              # Start server
node index.js          # Alternative start command
```

### Frontend

```bash
cd client
npm run dev            # Development server
npm run build          # Build for production
npm run preview        # Preview production build
```

---

## MongoDB Setup

### Local MongoDB (Optional)

```bash
# Install MongoDB locally
# Update MONGO_URI to: mongodb://localhost:27017/philosophyhub
```

### MongoDB Atlas (Recommended)

1. Create account at https://mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (for development)
5. Get connection string

---

## Git Workflow

### Before Making Changes

```bash
git pull origin main
```

### After Making Changes

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### Create Feature Branch (Recommended)

```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create Pull Request on GitHub
```

---

## Tips

1. **Keep servers running** while developing
2. **Check browser console** for frontend errors
3. **Check terminal logs** for backend errors
4. **Use meaningful commit messages**
5. **Test before pushing** to avoid breaking production

---

Happy coding! 🎉
