@echo off
echo ===================================================
echo 🚀 Arteria - Sending Development Client to the Cloud
echo ===================================================
echo.
echo Make sure you are logged into your Expo account.
echo This will take ~5 minutes. When it's done, scan the QR code!
echo.

:: We run EAS from the mobile app directory where eas.json lives.
:: Because we now have a `git` repository initialized at the root, 
:: EAS will detect the monorepo and automatically upload the engine package too!
cd /d "%~dp0\apps\mobile"

npx eas-cli build --profile development --platform android
pause
