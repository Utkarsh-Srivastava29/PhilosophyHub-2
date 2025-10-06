#!/bin/bash

# PhilosophyHub Deployment Helper Script
# This script helps verify your setup before deploying to Vercel

echo "======================================"
echo "PhilosophyHub Deployment Pre-Check"
echo "======================================"
echo ""

# Check if .env files exist
echo "Checking environment files..."

if [ -f "server/.env" ]; then
    echo "✅ server/.env found"
else
    echo "❌ server/.env NOT found - Copy from server/.env.example"
fi

if [ -f "client/.env" ]; then
    echo "✅ client/.env found"
else
    echo "❌ client/.env NOT found - Copy from client/.env.example"
fi

echo ""

# Check if node_modules exist
echo "Checking dependencies..."

if [ -d "server/node_modules" ]; then
    echo "✅ Server dependencies installed"
else
    echo "⚠️  Server dependencies NOT installed - Run: cd server && npm install"
fi

if [ -d "client/node_modules" ]; then
    echo "✅ Client dependencies installed"
else
    echo "⚠️  Client dependencies NOT installed - Run: cd client && npm install"
fi

echo ""

# Check if vercel.json files exist
echo "Checking Vercel configuration..."

if [ -f "server/vercel.json" ]; then
    echo "✅ server/vercel.json found"
else
    echo "❌ server/vercel.json NOT found"
fi

if [ -f "client/vercel.json" ]; then
    echo "✅ client/vercel.json found"
else
    echo "❌ client/vercel.json NOT found"
fi

echo ""
echo "======================================"
echo "Pre-deployment checklist:"
echo "======================================"
echo ""
echo "[ ] MongoDB Atlas cluster created"
echo "[ ] Database user created with password"
echo "[ ] IP whitelist set to 0.0.0.0/0"
echo "[ ] Connection string copied"
echo "[ ] JWT secret generated (32+ characters)"
echo "[ ] Gmail app password generated (if using email)"
echo "[ ] Code pushed to GitHub/GitLab"
echo "[ ] .env files are in .gitignore (not committed)"
echo ""
echo "======================================"
echo "Ready to deploy!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Vercel (select 'server' folder)"
echo "2. Add environment variables in Vercel"
echo "3. Deploy frontend to Vercel (select 'client' folder)"
echo "4. Update CLIENT_URL in backend with frontend URL"
echo ""
echo "Read DEPLOYMENT_CHECKLIST.md for detailed instructions"
echo ""
