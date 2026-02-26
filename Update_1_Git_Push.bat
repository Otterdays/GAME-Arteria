@echo off
title Git Push (Arteria)
color 0b
echo ================================================
echo 1. Git Push (Save Progress)
echo ================================================
echo.
echo This script will save your code to GitHub.
echo Ensure you have reviewed your changes!
echo.
cd /d "%~dp0"
set /p msg="Enter commit message (e.g., 'Added combat UI'): "
if "%msg%"=="" (
    echo Commit message cannot be empty. Aborting.
    pause
    exit /b
)
git add .
git commit -m "%msg%"
git push
echo.
echo [COMPLETE] Source code successfully pushed to GitHub!
pause
