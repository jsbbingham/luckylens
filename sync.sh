#!/bin/bash
# Quick GitHub Sync Script
# Usage: ./sync.sh [push|pull|status]
# Set GITHUB_TOKEN environment variable before running

GITHUB_TOKEN="${GITHUB_TOKEN:-}"
REPO_NAME="luckylens"
PROJECT_DIR="/home/syebrex/.openclaw/workspace/luckylens"

# Get username using jq for better JSON parsing
USERNAME=$(curl -s -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user | jq -r '.login')

if [ -z "$USERNAME" ]; then
    echo "❌ Authentication failed"
    exit 1
fi

cd "$PROJECT_DIR"

# Setup remote
git remote remove origin 2>/dev/null || true
git remote add origin "https://${USERNAME}:${GITHUB_TOKEN}@github.com/${USERNAME}/${REPO_NAME}.git" 2>/dev/null || true

case "${1:-push}" in
    push)
        echo "🚀 Pushing to GitHub..."
        git add .
        if ! git diff --cached --quiet; then
            git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" || true
        fi
        git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || git push -u origin main --force
        echo "✅ Done! https://github.com/$USERNAME/$REPO_NAME"
        ;;
    pull)
        echo "📥 Pulling from GitHub..."
        git pull origin main 2>/dev/null || git pull origin master
        echo "✅ Done!"
        ;;
    status)
        echo "🔍 Checking status..."
        echo "User: $USERNAME"
        echo "Repo: https://github.com/$USERNAME/$REPO_NAME"
        git status
        ;;
    *)
        echo "Usage: ./sync.sh [push|pull|status]"
        exit 1
        ;;
esac
