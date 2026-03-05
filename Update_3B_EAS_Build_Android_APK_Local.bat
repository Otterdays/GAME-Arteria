@echo off
title EAS Android Internal APK Build (Local)
color 0e
echo ================================================
echo 3B. EAS Android Internal APK Build (Local)
echo ================================================
echo.
echo This script creates a shareable APK locally using EAS local mode.
echo Profile: internal-apk
echo Output: APK on this machine
echo.
echo Requirements:
echo - Android Studio + Android SDK
echo - Java/JDK configured
echo - Logged into Expo account (if prompted)
echo.
echo This is cleaner than raw Gradle scripts and keeps parity with EAS profiles.
echo.
cd /d "%~dp0\apps\mobile"
npx eas-cli build --local -p android --profile internal-apk
echo.
echo [COMPLETE] Local EAS build finished. See output path in command logs.
pause
