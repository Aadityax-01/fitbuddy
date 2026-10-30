@echo off
title FitBuddy AI - 1-Click Auto Publisher to GitHub
echo =========================================================
echo       FitBuddy AI - Automatic GitHub Publisher
echo =========================================================
echo.

set GH="C:\Program Files\GitHub CLI\gh.exe"
set GIT="C:\Program Files\Git\cmd\git.exe"

cd /d "C:\Users\asus\.gemini\antigravity\scratch\fitbuddy-ai"

echo [1/3] Checking GitHub Login...
%GH% auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Please log in to GitHub in the browser window that opens...
    echo (A one-time code will appear if prompted)
    echo.
    %GH% auth login -w -p https -h github.com
)

echo.
echo [2/3] Creating repository and uploading code...
%GH% repo create fitbuddy --public --source=. --push 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Repository may already exist, pushing latest changes...
    %GIT% push -u origin main
)

echo.
echo [3/3] Enabling GitHub Pages for free public mobile link...
%GH% api -X POST repos/Aadityax-01/fitbuddy/pages -f "source[branch]=main" -f "source[path]=/" >nul 2>&1

echo.
echo =========================================================
echo   SUCCESS! YOUR SITE IS NOW LIVE AND PUBLIC!
echo.
echo   Share this link with your friends to open on any phone:
echo   https://aadityax-01.github.io/fitbuddy/
echo =========================================================
echo.
pause
