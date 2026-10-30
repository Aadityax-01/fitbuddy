@echo off
title FitBuddy AI Launcher
echo ====================================================
echo           FitBuddy AI - Launching System
echo ====================================================
echo.

echo [1/2] Checking backend requirements...
cd /d "%~dp0backend"
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
start "FitBuddy AI - Backend API" cmd /k "uvicorn app.main:app --reload --port 8000"

echo.
echo [2/2] Launching React frontend...
cd /d "%~dp0frontend"
if not exist node_modules (
    echo Installing npm dependencies (this may take 1-2 minutes)...
    call npm install
)
start "FitBuddy AI - Web Application" cmd /k "npm start"

echo.
echo ====================================================
echo  FitBuddy AI is starting up!
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:8000/docs
echo ====================================================
pause
