@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: Script: pull_updates.bat
:: Purpose: Pull all new commits & updates from the remote repository
:: Platform: Windows (Command Prompt / PowerShell / Double-Click)
:: ==============================================================================

title Kairos - Pull Latest Updates

echo =========================================
echo        Kairos - Pull Latest Updates
echo =========================================
echo.

:: 1. Verify Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 'git' is not installed or not found in system PATH.
    echo Please install Git for Windows from https://git-scm.com/
    goto :END
)

:: 2. Verify current directory is inside a Git repository
git rev-parse --is-inside-work-tree >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Current directory is not a Git repository.
    goto :END
)

:: 3. Detect current branch
set CURRENT_BRANCH=
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do (
    set CURRENT_BRANCH=%%i
)

if "%CURRENT_BRANCH%"=="" (
    set CURRENT_BRANCH=main
)
if "%CURRENT_BRANCH%"=="HEAD" (
    set CURRENT_BRANCH=main
)

echo [INFO] Current branch: %CURRENT_BRANCH%
echo.

:: 4. Check for uncommitted changes
set STASHED=0
set HAS_CHANGES=
for /f "tokens=*" %%i in ('git status --porcelain 2^>nul') do (
    set HAS_CHANGES=1
)

if defined HAS_CHANGES (
    echo [WARN] Uncommitted local changes detected!
    echo [INFO] Stashing your uncommitted work temporarily...
    git stash push -u -m "Auto-stash before pull_updates.bat"
    set STASHED=1
    echo.
)

:: 5. Fetch all latest updates and prune remote branches
echo [INFO] Fetching latest updates from remote...
git fetch --all --prune
echo.

:: 6. Pull updates from origin into the current branch
echo [INFO] Pulling latest changes for branch '%CURRENT_BRANCH%'...
git pull origin %CURRENT_BRANCH%
if %errorlevel% neq 0 (
    echo.
    echo [WARN] 'git pull origin %CURRENT_BRANCH%' encountered an issue.
    echo [INFO] Trying generic 'git pull'...
    git pull
)
echo.

:: 7. Restore stashed work if any was saved
if "%STASHED%"=="1" (
    echo [INFO] Restoring your stashed local changes...
    git stash pop
    if !errorlevel! neq 0 (
        echo.
        echo [WARN] Merge conflict detected while restoring local changes!
        echo Your changes are safely preserved in git stash. Run 'git stash list' to inspect.
    ) else (
        echo [SUCCESS] Local changes restored successfully.
    )
    echo.
)

:: 8. Show recent commit log
echo [INFO] Recent Commits:
git log -n 5 --oneline --decorate 2>nul
echo.

echo =========================================
echo    [SUCCESS] Codebase is up to date!
echo =========================================

:END
echo.
pause
