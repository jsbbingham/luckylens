#!/bin/bash
# LuckyLens Vercel Deploy Script
# Usage: ./deploy-vercel.sh

VERCEL_TOKEN="vJazsH2glBBI1Hf1qHH01rMG"
PROJECT_DIR="/home/syebrex/.openclaw/workspace/luckylens"

echo "🚀 Deploying LuckyLens to Vercel..."
echo ""

cd "$PROJECT_DIR"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to production
echo "☁️  Starting deployment..."
vercel --token "$VERCEL_TOKEN" --prod --yes

echo ""
echo "✅ Deployment complete!"
echo "Check your Vercel dashboard for the URL"
