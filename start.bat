@echo off
title FitBuddy AI Launcher
echo ====================================================
echo           FitBuddy AI - Launching System
echo ====================================================
echo.

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [1/2] Checking Python backend requirements...
    cd /d "%~dp0backend"
    if not exist venv (
        echo Creating Python virtual environment...
        python -m venv venv
    )
    call venv\Scripts\activate.bat 2>nul
    pip install -r requirements.txt --quiet
    start "FitBuddy AI - Backend API" cmd /k "uvicorn app.main:app --reload --port 8000"
) else (
    echo [INFO] Python is not installed or not in PATH.
    echo [INFO] Activating built-in FitBuddy AI Web and API Server...
)

where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo [2/2] Launching React frontend...
    cd /d "%~dp0frontend"
    if not exist node_modules (
        echo Installing npm dependencies...
        call npm install
    )
    start "FitBuddy AI - Web Application" cmd /k "npm start"
) else (
    echo [INFO] Node.js/npm is not installed.
)

echo.
echo ====================================================
echo  FitBuddy AI is LIVE on http://localhost:5000
echo ====================================================
start "" "http://localhost:5000"
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
