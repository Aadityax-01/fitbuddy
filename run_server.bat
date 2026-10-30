@echo off
title FitBuddy AI Web Server
echo =========================================================
echo   FitBuddy AI Server Starting on http://localhost:5000
echo =========================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
