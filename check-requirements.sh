#!/bin/bash

# LuckyLens System Requirements Check

echo "🔍 Checking system requirements for LuckyLens..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ALL_GOOD=true

# Check Node.js
echo -n "Node.js 18+ ... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        echo -e "${GREEN}✓ $(node --version)${NC}"
    else
        echo -e "${RED}✗ $(node --version) - Need 18+${NC}"
        ALL_GOOD=false
    fi
else
    echo -e "${RED}✗ Not installed${NC}"
    ALL_GOOD=false
fi

# Check npm
echo -n "npm ... "
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓ $(npm --version)${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
    ALL_GOOD=false
fi

# Check Git
echo -n "Git ... "
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ $(git --version | cut -d' ' -f3)${NC}"
else
    echo -e "${YELLOW}⚠ Not installed (optional)${NC}"
fi

# Check Docker (optional)
echo -n "Docker ... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ $(docker --version | cut -d' ' -f3 | tr -d ',')${NC}"
else
    echo -e "${YELLOW}⚠ Not installed (optional)${NC}"
fi

# Check Docker Compose (optional)
echo -n "Docker Compose ... "
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ $(docker-compose --version | cut -d' ' -f3 | tr -d ',')${NC}"
else
    echo -e "${YELLOW}⚠ Not installed (optional)${NC}"
fi

echo ""

# Check disk space
echo -n "Available disk space ... "
AVAILABLE=$(df . | tail -1 | awk '{print $4}')
AVAILABLE_GB=$((AVAILABLE / 1024 / 1024))
if [ "$AVAILABLE_GB" -ge 1 ]; then
    echo -e "${GREEN}✓ ${AVAILABLE_GB}GB${NC}"
else
    echo -e "${YELLOW}⚠ ${AVAILABLE_GB}GB (recommend 1GB+)${NC}"
fi

echo -n "Available memory ... "
if command -v free &> /dev/null; then
    MEM_GB=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$MEM_GB" -ge 1 ]; then
        echo -e "${GREEN}✓ ${MEM_GB}GB${NC}"
    else
        echo -e "${YELLOW}⚠ ${MEM_GB}GB (recommend 1GB+)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Cannot detect${NC}"
fi

echo ""

# Summary
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✅ All required components are installed!${NC}"
    echo ""
    echo "You're ready to run:"
    echo "  ./quickstart.sh"
    exit 0
else
    echo -e "${RED}❌ Some required components are missing.${NC}"
    echo ""
    echo "Please install Node.js 18+ from:"
    echo "  https://nodejs.org/"
    echo ""
    echo "Or use a package manager:"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  macOS: brew install node"
    exit 1
fi
