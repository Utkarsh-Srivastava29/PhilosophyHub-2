@echo off
REM PhilosophyHub Deployment Helper Script (Windows)
REM This script helps verify your setup before deploying to Vercel

echo ======================================
echo PhilosophyHub Deployment Pre-Check
echo ======================================
echo.

REM Check if .env files exist
echo Checking environment files...

if exist "server\.env" (
    echo [32m✓[0m server\.env found
) else (
    echo [31m✗[0m server\.env NOT found - Copy from server\.env.example
)

if exist "client\.env" (
    echo [32m✓[0m client\.env found
) else (
    echo [31m✗[0m client\.env NOT found - Copy from client\.env.example
)

echo.

REM Check if node_modules exist
echo Checking dependencies...

if exist "server\node_modules" (
    echo [32m✓[0m Server dependencies installed
) else (
    echo [33m![0m Server dependencies NOT installed - Run: cd server ^&^& npm install
)

if exist "client\node_modules" (
    echo [32m✓[0m Client dependencies installed
) else (
    echo [33m![0m Client dependencies NOT installed - Run: cd client ^&^& npm install
)

echo.

REM Check if vercel.json files exist
echo Checking Vercel configuration...

if exist "server\vercel.json" (
    echo [32m✓[0m server\vercel.json found
) else (
    echo [31m✗[0m server\vercel.json NOT found
)

if exist "client\vercel.json" (
    echo [32m✓[0m client\vercel.json found
) else (
    echo [31m✗[0m client\vercel.json NOT found
)

echo.
echo ======================================
echo Pre-deployment checklist:
echo ======================================
echo.
echo [ ] MongoDB Atlas cluster created
echo [ ] Database user created with password
echo [ ] IP whitelist set to 0.0.0.0/0
echo [ ] Connection string copied
echo [ ] JWT secret generated (32+ characters)
echo [ ] Gmail app password generated (if using email)
echo [ ] Code pushed to GitHub/GitLab
echo [ ] .env files are in .gitignore (not committed)
echo.
echo ======================================
echo Ready to deploy!
echo ======================================
echo.
echo Next steps:
echo 1. Deploy backend to Vercel (select 'server' folder)
echo 2. Add environment variables in Vercel
echo 3. Deploy frontend to Vercel (select 'client' folder)
echo 4. Update CLIENT_URL in backend with frontend URL
echo.
echo Read DEPLOYMENT_CHECKLIST.md for detailed instructions
echo.

pause
