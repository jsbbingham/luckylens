# LuckyLens Dev Server Setup - Complete

## 🚀 Quick Start (Choose One)

### Option 1: Automatic Quick Start (Easiest)
```bash
cd /home/syebrex/.openclaw/workspace/luckylens
chmod +x quickstart.sh
./quickstart.sh
```
This interactive script installs dependencies, builds, and starts the server.

### Option 2: Using Make
```bash
cd /home/syebrex/.openclaw/workspace/luckylens
make install
make build
make start
```

### Option 3: Using Docker
```bash
cd /home/syebrex/.openclaw/workspace/luckylens
docker-compose up -d
```

### Option 4: Manual Steps
```bash
cd /home/syebrex/.openclaw/workspace/luckylens
npm install
npm run build
npx serve -s dist -p 3000
```

---

## 📁 Deployment Files Created

| File | Purpose |
|------|---------|
| `quickstart.sh` | Interactive setup and launch script |
| `setup-dev-server.sh` | Basic setup script |
| `Makefile` | Common commands (make dev, make build, etc.) |
| `Dockerfile` | Multi-stage Docker build |
| `docker-compose.yml` | Docker Compose configuration |
| `nginx.conf` | Nginx reverse proxy config |
| `DEPLOYMENT.md` | Full deployment documentation |
| `next.config.js` | Updated for static export |

---

## 🌐 Access URLs

After starting the server:
- **Local**: http://localhost:3000
- **Network**: http://YOUR_SERVER_IP:3000

---

## 🔥 Makefile Commands

```bash
make help           # Show all commands
make install        # Install dependencies
make dev            # Development server (hot reload)
make build          # Build for production
make start          # Build and start production server
make docker-build   # Build Docker image
make docker-run     # Run Docker container
make clean          # Clean build artifacts
```

---

## 🐳 Docker Commands

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) Docker & Docker Compose
- (Optional) Nginx for production

---

## 🧪 Testing Checklist

After deployment, verify:

- [ ] App loads at http://localhost:3000
- [ ] Game selector works
- [ ] Number generation works (Random mode)
- [ ] History page loads
- [ ] Settings page loads
- [ ] Dark mode toggle works
- [ ] PWA manifest valid (DevTools → Application → Manifest)
- [ ] Service Worker registered (DevTools → Application → Service Workers)
- [ ] Can install as PWA (Chrome menu → Install LuckyLens)

---

## 🔒 Security Notes

Default dev server runs on all interfaces (0.0.0.0). For security:

```bash
# Restrict to localhost only
npm run dev -- --hostname 127.0.0.1

# Or use firewall
sudo ufw allow from YOUR_IP to any port 3000
```

---

## 🔄 Updating After Changes

```bash
# Pull latest code
git pull

# Rebuild and restart
make clean
make install
make build
make start

# Or with Docker
docker-compose down
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

See `DEPLOYMENT.md` for detailed troubleshooting steps.

Common issues:
- **Port 3000 in use**: Change port with `-p 3001`
- **Permission denied**: Run `chmod +x quickstart.sh`
- **Build fails**: Run `make clean` then retry

---

## 📖 Next Steps

1. **Test the app** - Try all features
2. **Configure for production** - Update domain, SSL, etc.
3. **Generate PWA icons** - Run icon generation script
4. **Deploy to production** - Use proper hosting

---

**Ready to test!** 🎯
Run `./quickstart.sh` to get started.
