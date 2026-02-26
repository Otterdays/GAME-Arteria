@echo off
title EAS OTA Update (Arteria)
color 0e
echo ================================================
echo 2. EAS OTA Update (Over The Air)
echo ================================================
echo.
echo This script will push a live update to players' phones WITHOUT an app store update.
echo ONLY use this if you changed JavaScript/TypeScript/UI code.
echo.
cd /d "%~dp0\apps\mobile"
set /p msg="Enter update message (e.g., 'Fixed minor XP bug'): "
if "%msg%"=="" (
    echo Update message cannot be empty. Aborting.
    pause
    exit /b
)
echo Executing EAS Update...
eas update --branch production --message "%msg%"
echo.
echo [COMPLETE] Players will download this update the next time they open the app!
pause
