@echo off
title EAS Android Production Build (Play Store)
color 0a
echo ===================================================
echo 4. EAS Android Production Build (Play Store)
echo ===================================================
echo.
echo Builds an AAB (Android App Bundle) in Expo's CLOUD.
echo - No phone connected required
echo - No local Android SDK required
echo - Output: AAB file for Google Play Console upload
echo.
echo Profile: production (buildType: app-bundle)
echo.
echo First run: EAS will prompt for credentials.
echo Let EAS manage your keystore (recommended).
echo.
echo After build: Download AAB from EAS dashboard or link in output.
echo Upload to: https://play.google.com/console
echo.
pause

cd /d "%~dp0\apps\mobile"
npx eas-cli build -p android --profile production

echo.
echo [COMPLETE] Check the output URL for your AAB download.
echo Upload the .aab file to Google Play Console.
pause
