@echo off
title EAS Android Development Build (Arteria)
color 0a
echo ================================================
echo 3. EAS Android Development Build
echo ================================================
echo.
echo This script queues a cloud build for internal testing.
echo It will generate an APK tailored for the Expo Development Client.
echo The build takes ~5-10 minutes.
echo.
cd /d "%~dp0\apps\mobile"
eas build -p android --profile development
echo.
echo [COMPLETE] Please check your EAS dashboard or scan the QR code above!
pause
