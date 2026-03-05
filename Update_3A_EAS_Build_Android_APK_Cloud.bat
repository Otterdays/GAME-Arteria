@echo off
title EAS Android Internal APK Build (Cloud)
color 0a
echo ================================================
echo 3A. EAS Android Internal APK Build (Cloud)
echo ================================================
echo.
echo This script creates a shareable APK using EAS cloud builds.
echo Profile: internal-apk
echo Output: APK (installable file for testers)
echo.
echo Use this for tester distribution without touching local Gradle.
echo.
cd /d "%~dp0\apps\mobile"
npx eas-cli build -p android --profile internal-apk
echo.
echo [COMPLETE] Check EAS dashboard or the URL/QR from the command output.
pause
