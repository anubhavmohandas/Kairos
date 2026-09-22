#!/usr/bin/env bash

# ==============================================================================
# Script: pull_updates.sh
# Purpose: Pull all new commits & updates from the remote repository
# Platform: macOS / Linux / Git Bash / WSL
# ==============================================================================

set -e

# ANSI Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}       Kairos - Pull Latest Updates       ${NC}"
echo -e "${BLUE}=========================================${NC}"

# 1. Verify Git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Error: 'git' is not installed or not found in PATH.${NC}"
    exit 1
fi

# 2. Verify current directory is inside a Git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo -e "${RED}❌ Error: Current directory is not a Git repository.${NC}"
    exit 1
fi

# 3. Detect current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ -z "$CURRENT_BRANCH" ] || [ "$CURRENT_BRANCH" = "HEAD" ]; then
    echo -e "${YELLOW}⚠️  Notice: Detached HEAD or no commits yet. Defaulting to 'main'...${NC}"
    CURRENT_BRANCH="main"
fi

echo -e "📌 Current branch: ${GREEN}${CURRENT_BRANCH}${NC}"

# 4. Check for uncommitted changes
STASHED=0
CHANGES=$(git status --porcelain)

if [ -n "$CHANGES" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted local changes detected!${NC}"
    echo -e "${YELLOW}📦 Stashing your uncommitted work temporarily...${NC}"
    git stash push -u -m "Auto-stash before pull_updates.sh on $(date)"
    STASHED=1
fi

# 5. Fetch all latest changes and prune deleted branches
echo -e "\n${BLUE}🔄 Fetching latest updates from remote...${NC}"
git fetch --all --prune

# 6. Pull updates from origin into the current branch
echo -e "${BLUE}⬇️  Pulling latest changes for branch '${CURRENT_BRANCH}'...${NC}"
if git pull origin "$CURRENT_BRANCH"; then
    echo -e "\n${GREEN}✅ Successfully pulled latest changes!${NC}"
else
    echo -e "\n${RED}⚠️  'git pull origin ${CURRENT_BRANCH}' encountered an issue.${NC}"
    echo -e "${YELLOW}Trying generic 'git pull'...${NC}"
    git pull || true
fi

# 7. Restore stashed work if any was saved
if [ "$STASHED" -eq 1 ]; then
    echo -e "\n${YELLOW}📦 Restoring your stashed local changes...${NC}"
    if git stash pop; then
        echo -e "${GREEN}✅ Local changes restored successfully.${NC}"
    else
        echo -e "${RED}⚠️  Merge conflict detected when restoring your changes!${NC}"
        echo -e "${YELLOW}Your changes remain safely in git stash. Run 'git stash list' and resolve conflicts.${NC}"
    fi
fi

# 8. Show recent commit log
echo -e "\n${BLUE}📜 Recent Commits:${NC}"
git log -n 5 --oneline --decorate --color || true

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}   ✨ Your local codebase is up to date!  ${NC}"
echo -e "${GREEN}=========================================${NC}"
