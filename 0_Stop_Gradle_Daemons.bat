@echo off
title Arteria - Stop Gradle Daemons
REM Stops all Gradle daemons started by this project's wrapper.
REM Use this to free memory and clear "6 incompatible" daemon buildup.
cd /d "%~dp0\apps\mobile\android"
if errorlevel 1 (
    echo ERROR: Could not cd to apps\mobile\android
    pause
    exit /b 1
)
call gradlew.bat --stop
echo.
echo Done. Next build will start a fresh daemon.
pause
