@echo off
title Uploading FitBuddy AI to GitHub
echo =========================================================
echo    Uploading FitBuddy to:
echo    https://github.com/Aadityax-01/fitbuddy.git
echo =========================================================
echo.

cd /d "C:\Users\asus\.gemini\antigravity\scratch\fitbuddy-ai"

"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/Aadityax-01/fitbuddy.git
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo Pushing code to main branch...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo =========================================================
    echo   SUCCESS! Code uploaded to GitHub!
    echo.
    echo   Next step to make it live for your friends:
    echo   1. Open: https://github.com/Aadityax-01/fitbuddy/settings/pages
    echo   2. Set Branch to 'main' and Folder to '/ (root)'
    echo   3. Click Save!
    echo.
    echo   Your Public Live URL will be:
    echo   https://aadityax-01.github.io/fitbuddy/
    echo =========================================================
) else (
    echo If GitHub opened a browser window to authenticate, please click "Authorize git-credential-manager" to complete the push.
)
echo.
pause
