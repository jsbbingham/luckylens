#!/bin/bash
# LuckyLens GitHub Repository Setup Script
# Run this script to create the repo and push all code
# Set GITHUB_TOKEN environment variable before running

set -e  # Exit on error

echo "🚀 Setting up LuckyLens GitHub repository..."
echo ""

# Configuration
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
REPO_NAME="luckylens"
PROJECT_DIR="/home/syebrex/.openclaw/workspace/luckylens"

# Get GitHub username
echo "📋 Getting your GitHub username..."
USERNAME=$(curl -s -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user | jq -r '.login')

if [ -z "$USERNAME" ]; then
    echo "❌ Failed to get GitHub username. Check your token."
    exit 1
fi

echo "✅ Connected as: $USERNAME"
echo ""

# Check if repo already exists
echo "🔍 Checking if repository exists..."
REPO_EXISTS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/$USERNAME/$REPO_NAME" | grep '"id"' || true)

if [ -n "$REPO_EXISTS" ]; then
    echo "⚠️  Repository $USERNAME/$REPO_NAME already exists!"
    read -p "Do you want to push to the existing repo? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborting. Please choose a different repo name."
        exit 1
    fi
else
    # Create the repository
    echo "📦 Creating GitHub repository..."
    curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/user/repos \
        -d "{
            \"name\": \"$REPO_NAME\",
            \"description\": \"A modern, privacy-focused Progressive Web App for generating and tracking lottery numbers. Built with Next.js, TypeScript, and Tailwind CSS.\",
            \"private\": false,
            \"has_issues\": true,
            \"has_projects\": true,
            \"has_wiki\": false,
            \"license_template\": \"mit\"
        }"
    echo "✅ Repository created: https://github.com/$USERNAME/$REPO_NAME"
fi

echo ""

# Navigate to project directory
cd "$PROJECT_DIR"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
fi

# Configure git (if not already set)
if ! git config --global user.email >/dev/null 2>&1; then
    git config user.email "jbingham@jsb-tech.com"
fi
if ! git config --global user.name >/dev/null 2>&1; then
    git config user.name "Josh Bingham"
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "⚠️  No changes to commit (already up to date)"
else
    # Commit
    echo "💾 Committing files..."
    git commit -m "Initial commit: LuckyLens PWA v1.0.0

Features:
- 5 lottery games (Powerball, Mega Millions, Lucky for Life, Cash4Life, Lotto America)
- Random and trend-based number generation
- Self-pick mode with number grids
- History tracking with CRUD operations
- Trends analysis (hot/cold numbers, distributions)
- Full PWA support with offline capability
- Settings, Terms, Privacy Policy pages
- Error boundaries and accessibility features

Built with Next.js 14, React 18, TypeScript, Tailwind CSS, Dexie.js"
fi

# Add remote (force update if exists)
echo "🔗 Adding remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://$USERNAME:$GITHUB_TOKEN@github.com/$USERNAME/$REPO_NAME.git"

# Push to GitHub
echo "☁️  Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo ""
echo "🎉 SUCCESS! LuckyLens is now on GitHub!"
echo ""
echo "📍 Repository URL: https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo "Next steps:"
echo "  1. Visit your repo at the URL above"
echo "  2. Enable GitHub Pages (if you want)"
echo "  3. Set up branch protection rules (optional)"
echo "  4. Add collaborators (optional)"
