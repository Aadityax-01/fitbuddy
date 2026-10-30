Write-Host "====================================================" -ForegroundColor Green
Write-Host "          FitBuddy AI - Launching System" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Backend
Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Cyan
$backendDir = Join-Path $baseDir "backend"
Set-Location $backendDir

if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt; uvicorn app.main:app --reload --port 8000"

# 2. Frontend
Write-Host "[2/2] Starting Frontend Application..." -ForegroundColor Cyan
$frontendDir = Join-Path $baseDir "frontend"
Set-Location $frontendDir

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies (first time only)..." -ForegroundColor Yellow
    npm install
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm start"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host " FitBuddy AI is launching!" -ForegroundColor Green
Write-Host " Frontend: http://localhost:3000" -ForegroundColor White
Write-Host " Backend:  http://localhost:8000/docs" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor Green
