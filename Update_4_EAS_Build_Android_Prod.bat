@echo off
title EAS Android Production Build (Arteria)
color 0c
echo ================================================
echo 4. EAS Android Production Build
echo ================================================
echo.
echo This script queues a final Production AAB/APK for the Google Play Store.
echo This should only be used when ready for public release.
echo The build takes ~5-10 minutes.
echo.
set /p confirm="Are you sure you want to trigger a PRODUCTION build? (Y/N): "
if /I "%confirm%" neq "Y" (
    echo Build cancelled.
    pause
    exit /b
)
cd /d "%~dp0\apps\mobile"
eas build -p android --profile production
echo.
echo [COMPLETE] Your production build is compiling in the cloud!
pause
