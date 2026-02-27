@echo off
title Arteria Local Android Build 📱
color 0b
echo ===================================================
echo 📱 Arteria - Local Native Android Build
echo ===================================================
echo.
echo THIS SCRIPT REQUIRES ANDROID STUDIO AND THE ANDROID SDK.
echo It bypasses Expo's cloud servers (EAS) and builds the custom
echo native development client (with MMKV C++ bindings) directly 
echo on your machine.
echo.
echo 1. Ensure Android Studio is installed.
echo 2. Ensure an Android Emulator is running OR your physical phone 
echo    is plugged in via USB (with USB Debugging enabled).
echo.
pause

cd /d "%~dp0\apps\mobile"
npx expo run:android

echo.
echo Build complete. If successful, the app is now on your device!
echo You can now use the `0_Start_Dev_Server.bat` to update code instantly.
pause
