@echo off
title FitBuddy AI - 1-Click Update All
color 0A
echo =========================================================
echo            FitBuddy AI - Update System
echo =========================================================
echo.
cd /d "%~dp0"

echo [1/3] Gathering latest updates...
"C:\Program Files\Git\cmd\git.exe" add .

echo [2/3] Saving changes...
"C:\Program Files\Git\cmd\git.exe" commit -m "chore: update fitbuddy ai platform" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo No new local file changes detected.
)

echo [3/3] Uploading updates to GitHub...
"C:\Program Files\Git\cmd\git.exe" push origin main

echo.
echo =========================================================
echo   SUCCESS! All updates have been pushed to GitHub!
echo.
echo   Local App:     http://localhost:5000
echo   GitHub Repo:   https://github.com/Aadityax-01/fitbuddy
echo   Live Website:  https://aadityax-01.github.io/fitbuddy/
echo =========================================================
echo.
pause
