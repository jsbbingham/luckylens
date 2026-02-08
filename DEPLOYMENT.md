# LuckyLens Dev Server Deployment Guide

## Quick Start (3 Options)

### Option 1: Direct Node.js (Simplest)

```bash
cd /path/to/luckylens

# Make setup script executable
chmod +x setup-dev-server.sh

# Run setup
./setup-dev-server.sh
```

The app will be available at `http://localhost:3000`

---

### Option 2: Docker (Recommended for Isolation)

```bash
cd /path/to/luckylens

# Build and run with Docker
docker build -t luckylens .
docker run -d -p 3000:3000 --name luckylens-dev luckylens
```

Or using Docker Compose:

```bash
cd /path/to/luckylens

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 3: Static Files + Nginx (Best for Production-like)

```bash
cd /path/to/luckylens

# Build static files
npm install
npm run build

# The 'dist' folder now contains static files
# Serve with any web server

# Example with Python
python3 -m http.server 3000 --directory dist

# Example with Node.js serve
npx serve -s dist -p 3000

# Example with Nginx
sudo cp -r dist/* /var/www/html/
```

---

## Development Mode

For active development with hot reload:

```bash
cd /path/to/luckylens
npm install
npm run dev
```

Access at `http://localhost:3000`

---

## Accessing the App

Once running, access via:
- **Local**: `http://localhost:3000`
- **Network**: `http://YOUR_SERVER_IP:3000`

For external access, ensure firewall allows port 3000:

```bash
# Ubuntu/Debian with UFW
sudo ufw allow 3000/tcp

# Or iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

---

## PWA Testing

To test PWA features (service worker, installability):

1. Open Chrome DevTools → Application tab
2. Check "Manifest" section shows valid data
3. Check "Service Workers" shows active SW
4. Use "Add to home screen" in Chrome menu to test install

---

## Environment Variables

Create `.env.local` for local overrides:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LuckyLens
```

---

## Troubleshooting

### Port 3000 already in use
```bash
# Find and kill process
sudo lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### Permission denied
```bash
chmod +x setup-dev-server.sh
```

### Build errors
```bash
# Clear cache and rebuild
rm -rf node_modules .next dist
npm install
npm run build
```

### Out of memory during build
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## Updating the App

After making changes:

```bash
# Development: Changes auto-reload

# Production: Rebuild
cd /path/to/luckylens
npm run build

# If using Docker
docker-compose down
docker-compose up -d --build
```

---

## File Locations After Build

```
luckylens/
├── dist/              # Static export output
│   ├── index.html     # Main entry
│   ├── _next/         # JS/CSS assets
│   ├── icons/         # PWA icons
│   ├── manifest.json  # PWA manifest
│   └── sw.js          # Service worker
├── node_modules/      # Dependencies
└── ...
```

---

## Security Notes for Dev Server

- Dev server runs on all interfaces (0.0.0.0) by default
- No authentication - anyone with IP can access
- Use firewall rules to restrict access if needed
- For production, use proper reverse proxy (Nginx/Caddy)

---

## Production Deployment Checklist

Before production deployment:

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Generate proper PWA icons (run icon generation script)
- [ ] Update manifest.json with production values
- [ ] Review Terms and Privacy Policy content
- [ ] Set up proper HTTPS (Let's Encrypt)
- [ ] Configure CDN for static assets
- [ ] Set up monitoring/analytics (optional)

---

Need help? Check the README.md or contact support.
