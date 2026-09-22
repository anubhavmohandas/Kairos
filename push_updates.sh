#!/usr/bin/env bash

# ==============================================================================
# Script: push_updates.sh
# Purpose: Stage changes, commit cleanly, and push to GitHub
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
echo -e "${BLUE}       Kairos - Push Updates to GitHub    ${NC}"
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
    CURRENT_BRANCH="main"
fi

echo -e "📌 Branch: ${GREEN}${CURRENT_BRANCH}${NC}\n"

# 4. Check for changes
CHANGES=$(git status --porcelain)

if [ -z "$CHANGES" ]; then
    echo -e "${YELLOW}ℹ️  No changes to commit. Working tree is clean.${NC}"
    exit 0
fi

echo -e "${BLUE}📁 Modified files:${NC}"
git status --short
echo ""

# 5. Get commit message
COMMIT_MSG="$*"
if [ -z "$COMMIT_MSG" ]; then
    read -r -p "💬 Enter commit message: " COMMIT_MSG
fi

if [ -z "$COMMIT_MSG" ]; then
    echo -e "${RED}❌ Commit aborted: Commit message cannot be empty.${NC}"
    exit 1
fi

# 6. Stage and commit
echo -e "\n${BLUE}📦 Staging changes...${NC}"
git add .

echo -e "${BLUE}📝 Committing changes...${NC}"
git commit -m "$COMMIT_MSG"

# 7. Push to remote
echo -e "\n${BLUE}🚀 Pushing to origin/${CURRENT_BRANCH}...${NC}"
git push origin "$CURRENT_BRANCH"

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}   ✨ Changes pushed successfully!        ${NC}"
echo -e "${GREEN}=========================================${NC}"
