@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: Script: push_updates.bat
:: Purpose: Stage changes, commit cleanly, and push to GitHub
:: Platform: Windows (Command Prompt / PowerShell / Double-Click)
:: ==============================================================================

title Kairos - Push Updates to GitHub

echo =========================================
echo       Kairos - Push Updates to GitHub
echo =========================================
echo.

:: 1. Verify Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 'git' is not installed or not found in system PATH.
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

if "%CURRENT_BRANCH%"=="" set CURRENT_BRANCH=main
if "%CURRENT_BRANCH%"=="HEAD" set CURRENT_BRANCH=main

echo [INFO] Current branch: %CURRENT_BRANCH%
echo.

:: 4. Check for changes
set HAS_CHANGES=
for /f "tokens=*" %%i in ('git status --porcelain 2^>nul') do (
    set HAS_CHANGES=1
)

if not defined HAS_CHANGES (
    echo [INFO] No changes to commit. Working tree is clean.
    goto :END
)

echo [INFO] Modified files:
git status --short
echo.

:: 5. Get commit message
set /p COMMIT_MSG="Enter commit message: "
if "%COMMIT_MSG%"=="" (
    echo [ERROR] Commit message cannot be empty.
    goto :END
)

:: 6. Stage and commit
echo.
echo [INFO] Staging changes...
git add .

echo [INFO] Committing changes...
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo [ERROR] Commit failed.
    goto :END
)

:: 7. Push to remote
echo.
echo [INFO] Pushing to origin/%CURRENT_BRANCH%...
git push origin %CURRENT_BRANCH%
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. Please check network or git permissions.
    goto :END
)

echo.
echo =========================================
echo    [SUCCESS] Changes pushed to GitHub!
echo =========================================

:END
echo.
pause
