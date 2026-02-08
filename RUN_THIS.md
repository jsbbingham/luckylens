# Fix and Run LuckyLens

## The Problem
Files in .next directory are owned by root (because sudo was used before).
This prevents the app from building and running correctly.

## The Solution

Run these commands in order:

### 1. Fix permissions (run WITH sudo - only this once):
```bash
cd /home/syebrex/.openclaw/workspace/luckylens
sudo rm -rf .next
sudo chown -R syebrex:syebrex .
```

### 2. Rebuild the app (WITHOUT sudo):
```bash
npm run build
```

### 3. Start the app (WITHOUT sudo):
```bash
./quickstart.sh
```

Or manually:
```bash
npx serve -s dist -p 3000
```

## Access the app at:
- http://localhost:3000

## IMPORTANT:
- ❌ NEVER use sudo with npm commands
- ✅ Only use sudo for the permission fix above
