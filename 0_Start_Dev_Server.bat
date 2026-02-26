@echo off
title Arteria Development Server ⚡
color 0e
echo ================================================
echo 0. Start Fast Refresh Development Server
echo ================================================
echo.
echo This script starts the local Metro Bundler.
echo You DO NOT need to build the app to test changes!
echo 
echo 1. Ensure you have the Development Client APK installed on your phone.
echo 2. Open the app on your phone.
echo 3. It will connect to this server and update instantly when you save code.
echo.
cd /d "%~dp0"
npm run mobile -- --clear
pause
