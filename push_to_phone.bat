@echo off
echo ===================================================
echo 🚀 Arteria - Sending Development Client to the Cloud
echo ===================================================
echo.
echo Make sure you are logged into your Expo account.
echo This will take ~5 minutes. When it's done, scan the QR code!
echo.

:: We MUST run EAS from the root of the monorepo so the cloud server 
:: knows about our @arteria/engine package during `npm install`.
cd /d "%~dp0"

npx eas-cli build --profile development --platform android
pause
