#!/bin/bash

# LuckyLens Quick Start Script
# This script helps you quickly set up and run LuckyLens on your dev server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo " _       _       _            _     _         "
echo "| |     | |     | |          | |   | |        "
echo "| | __ _| |_   _| | ___   ___| | __| |        "
echo "| |/ _\` | | | | | |/ _ \ / __| |/ _\` |        "
echo "| | (_| | | |_| | | (_) | (__| | (_| |        "
echo "|_|\__,_|_|\__, |_|\___/ \___|_|\__,_|        "
echo "            __/ |                             "
echo "           |___/                              "
echo -e "${NC}"
echo "Dev Server Setup"
echo "================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js 18+ first:"
    echo "  https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version is too old (found $(node --version), need 18+)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm $(npm --version) found${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo "Please run this script from the luckylens directory."
    exit 1
fi

echo -e "${BLUE}📦 Step 1/4: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo -e "${BLUE}⚙️  Step 2/4: Creating environment file...${NC}"
    cat > .env.local << 'EOF'
# LuckyLens Environment Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LuckyLens
EOF
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local already exists, skipping${NC}"
fi
echo ""

echo -e "${BLUE}🏗️  Step 3/4: Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Detect IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}' || echo "localhost")

echo -e "${GREEN}"
echo "========================================"
echo "  🎉 LuckyLens is ready!"
echo "========================================"
echo -e "${NC}"
echo ""
echo -e "${BLUE}Choose how to run:${NC}"
echo ""
echo "1) ${YELLOW}Static Server (Recommended for production)${NC}"
echo "   npx serve dist -p 3000"
echo ""
echo "2) ${YELLOW}Development Mode (with hot reload)${NC}"
echo "   npm run dev"
echo ""
echo "3) ${YELLOW}Docker${NC}"
echo "   docker-compose up -d"
echo ""
echo "4) ${YELLOW}Using Makefile${NC}"
echo "   make start"
echo ""
echo "Access URLs:"
echo "  Local:    http://localhost:3000"
echo "  Network:  http://$IP_ADDRESS:3000"
echo ""
echo -e "${BLUE}PWA Testing:${NC}"
echo "  1. Open Chrome DevTools (F12)"
echo "  2. Go to Application tab"
echo "  3. Check Manifest and Service Workers"
echo "  4. Test 'Add to home screen'"
echo ""
echo -e "${YELLOW}Press Enter to start Static Server, or Ctrl+C to exit...${NC}"
read -r

echo -e "${GREEN}Starting LuckyLens on http://localhost:3000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""
npx serve dist -p 3000
