@echo off
title Push FitBuddy AI to GitHub
echo =========================================================
echo       Upload FitBuddy AI to Your GitHub Account
echo =========================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/fitbuddy-ai.git): "

if "%REPO_URL%"=="" (
    echo No URL entered. Exiting.
    pause
    exit /b
)

echo.
echo [1/3] Setting remote origin...
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin %REPO_URL%

echo [2/3] Renaming branch to main...
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo [3/3] Pushing code to GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo =========================================================
echo  Upload complete! 
echo  Now enable GitHub Pages in your repo Settings -> Pages
echo  to get a free public link for your friends!
echo =========================================================
pause
