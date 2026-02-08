#!/bin/bash

# LuckyLens Dev Server Setup Script
# Run this on your dev server to set up the app for testing

echo "🎯 Setting up LuckyLens Dev Server..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the luckylens directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Creating environment file..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# LuckyLens Environment Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LuckyLens
EOF
    echo "✅ Created .env.local"
fi

echo "🏗️ Building the application..."
npm run build

echo "🚀 Starting production server..."
echo ""
echo "==================================="
echo "  LuckyLens is now running!"
echo "  http://localhost:3000"
echo "==================================="
echo ""
echo "To start development mode instead, run:"
echo "  npm run dev"
echo ""

# Start the server
npm start
