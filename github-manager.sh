#!/bin/bash
# GitHub Manager for LuckyLens
# Handles all GitHub operations: check, sync, status, etc.
# Set GITHUB_TOKEN environment variable before running

set -e

# Configuration
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
REPO_NAME="luckylens"
PROJECT_DIR="/home/syebrex/.openclaw/workspace/luckylens"
API_BASE="https://api.github.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function for API calls
github_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Content-Type: application/json" \
            "${API_BASE}${endpoint}" \
            -d "$data"
    else
        curl -s -X "$method" \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "${API_BASE}${endpoint}"
    fi
}

# Get username
get_username() {
    github_api GET "/user" | jq -r '.login'
}

# Check repo exists
check_repo() {
    local username=$1
    local response=$(github_api GET "/repos/${username}/${REPO_NAME}")
    
    if echo "$response" | grep -q '"id"'; then
        echo "true"
    else
        echo "false"
    fi
}

# Show menu
show_menu() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     GitHub Manager - LuckyLens         ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo "1. Check repository status"
    echo "2. Create repository (if not exists)"
    echo "3. Sync local code to GitHub (force push)"
    echo "4. Pull latest from GitHub"
    echo "5. View repository info"
    echo "6. List all files in repo"
    echo "7. Delete repository (⚠️ DANGER)"
    echo "8. Full setup (create + push)"
    echo "q. Quit"
    echo ""
}

# Option 1: Check status
check_status() {
    echo -e "${YELLOW}🔍 Checking GitHub status...${NC}"
    
    USERNAME=$(get_username)
    if [ -z "$USERNAME" ]; then
        echo -e "${RED}❌ Invalid token or authentication failed${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Authenticated as: $USERNAME${NC}"
    
    if [ "$(check_repo $USERNAME)" = "true" ]; then
        echo -e "${GREEN}✅ Repository exists: https://github.com/$USERNAME/$REPO_NAME${NC}"
        
        # Get repo details
        local repo_info=$(github_api GET "/repos/${USERNAME}/${REPO_NAME}")
        local stars=$(echo "$repo_info" | grep -o '"stargazers_count":[0-9]*' | cut -d':' -f2)
        local forks=$(echo "$repo_info" | grep -o '"forks_count":[0-9]*' | cut -d':' -f2)
        local updated=$(echo "$repo_info" | grep -o '"updated_at":"[^"]*"' | cut -d'"' -f4)
        
        echo "   ⭐ Stars: $stars"
        echo "   🍴 Forks: $forks"
        echo "   🕐 Last updated: $updated"
    else
        echo -e "${RED}❌ Repository does not exist${NC}"
    fi
}

# Option 2: Create repo
create_repo() {
    echo -e "${YELLOW}📦 Creating repository...${NC}"
    
    USERNAME=$(get_username)
    
    if [ "$(check_repo $USERNAME)" = "true" ]; then
        echo -e "${YELLOW}⚠️  Repository already exists!${NC}"
        return 0
    fi
    
    local response=$(github_api POST "/user/repos" '{
        "name": "'"$REPO_NAME"'",
        "description": "A modern, privacy-focused Progressive Web App for generating and tracking lottery numbers. Built with Next.js, TypeScript, and Tailwind CSS.",
        "private": false,
        "has_issues": true,
        "has_projects": true,
        "has_wiki": false,
        "license_template": "mit"
    }')
    
    if echo "$response" | grep -q '"id"'; then
        echo -e "${GREEN}✅ Repository created!${NC}"
        echo "   URL: https://github.com/$USERNAME/$REPO_NAME"
    else
        echo -e "${RED}❌ Failed to create repository${NC}"
        echo "$response" | grep -o '"message":"[^"]*"' || echo "$response"
    fi
}

# Option 3: Sync to GitHub
sync_to_github() {
    echo -e "${YELLOW}☁️  Syncing to GitHub...${NC}"
    
    USERNAME=$(get_username)
    
    if [ "$(check_repo $USERNAME)" != "true" ]; then
        echo -e "${RED}❌ Repository does not exist. Create it first (option 2).${NC}"
        return 1
    fi
    
    cd "$PROJECT_DIR"
    
    # Initialize git if needed
    if [ ! -d ".git" ]; then
        git init
        echo -e "${GREEN}✅ Initialized git${NC}"
    fi
    
    # Set git config
    git config user.email "jbingham@jsb-tech.com" 2>/dev/null || true
    git config user.name "Josh Bingham" 2>/dev/null || true
    
    # Add all files
    git add .
    
    # Commit
    if git diff --cached --quiet; then
        echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    else
        git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')

Changes synced from local development." || true
        echo -e "${GREEN}✅ Committed changes${NC}"
    fi
    
    # Setup remote
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://${USERNAME}:${GITHUB_TOKEN}@github.com/${USERNAME}/${REPO_NAME}.git"
    
    # Push
    git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Trying force push...${NC}"
        git push -u origin main --force 2>/dev/null || git push -u origin master --force
    }
    
    echo -e "${GREEN}✅ Synced to GitHub!${NC}"
    echo "   URL: https://github.com/$USERNAME/$REPO_NAME"
}

# Option 4: Pull from GitHub
pull_from_github() {
    echo -e "${YELLOW}📥 Pulling from GitHub...${NC}"
    
    USERNAME=$(get_username)
    cd "$PROJECT_DIR"
    
    # Setup remote
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://${USERNAME}:${GITHUB_TOKEN}@github.com/${USERNAME}/${REPO_NAME}.git"
    
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || {
        echo -e "${RED}❌ Failed to pull${NC}"
        return 1
    }
    
    echo -e "${GREEN}✅ Pulled latest changes${NC}"
}

# Option 5: View repo info
view_repo_info() {
    USERNAME=$(get_username)
    local repo_info=$(github_api GET "/repos/${USERNAME}/${REPO_NAME}")
    
    echo ""
    echo -e "${BLUE}📊 Repository Information${NC}"
    echo "─────────────────────────────────────"
    echo "$repo_info" | grep -E '("name"|"full_name"|"description"|"html_url"|"created_at"|"updated_at"|"pushed_at"|"stargazers_count"|"forks_count"|"open_issues_count"|"language"|"license")' | head -20
}

# Option 6: List files
list_files() {
    USERNAME=$(get_username)
    echo -e "${YELLOW}📁 Files in repository:${NC}"
    
    # Get file tree
    local tree=$(github_api GET "/repos/${USERNAME}/${REPO_NAME}/git/trees/main?recursive=1" 2>/dev/null || github_api GET "/repos/${USERNAME}/${REPO_NAME}/git/trees/master?recursive=1")
    
    echo "$tree" | grep -o '"path":"[^"]*"' | cut -d'"' -f4 | head -30
    
    local count=$(echo "$tree" | grep -o '"path":"[^"]*"' | wc -l)
    echo ""
    echo "Total files: $count"
}

# Option 7: Delete repo (danger!)
delete_repo() {
    USERNAME=$(get_username)
    
    echo -e "${RED}⚠️  DANGER: This will DELETE the repository!${NC}"
    echo -e "${RED}   https://github.com/$USERNAME/$REPO_NAME${NC}"
    echo ""
    read -p "Type the repo name to confirm deletion ($REPO_NAME): " confirm
    
    if [ "$confirm" != "$REPO_NAME" ]; then
        echo -e "${YELLOW}❌ Cancelled${NC}"
        return 1
    fi
    
    echo -e "${RED}🗑️  Deleting repository...${NC}"
    github_api DELETE "/repos/${USERNAME}/${REPO_NAME}"
    echo -e "${GREEN}✅ Repository deleted${NC}"
}

# Option 8: Full setup
full_setup() {
    echo -e "${BLUE}🚀 Starting full setup...${NC}"
    create_repo
    sleep 2
    sync_to_github
}

# Main loop
main() {
    while true; do
        show_menu
        read -p "Choose an option: " choice
        
        case $choice in
            1) check_status ;;
            2) create_repo ;;
            3) sync_to_github ;;
            4) pull_from_github ;;
            5) view_repo_info ;;
            6) list_files ;;
            7) delete_repo ;;
            8) full_setup ;;
            q|Q) echo "Goodbye!"; exit 0 ;;
            *) echo -e "${RED}Invalid option${NC}" ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main
main
