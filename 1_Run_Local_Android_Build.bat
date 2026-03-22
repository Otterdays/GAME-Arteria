@echo off
chcp 65001 >nul 2>&1
title Arteria-dev Local Android Build 📱
color 0b
REM [TRACE: DOCU/EXPO_GUIDE.md — Dev/Prod Coexistence]
REM Dev build: "Arteria-dev", com.anonymous.arteria.dev. Prod uses "Arteria" (2_Build_APK_Local.bat).
echo ===================================================
echo Arteria-dev - Local Native Android Build ^(Dev Client^)
echo ===================================================
echo.
echo Builds the DEVELOPMENT client as "Arteria-dev" so it can coexist
echo with the prod APK ^(Arteria^) on the same device.
echo.
echo THIS SCRIPT REQUIRES ANDROID STUDIO AND THE ANDROID SDK.
echo It bypasses Expo's cloud servers ^(EAS^) and builds the custom
echo native development client ^(with MMKV C++ bindings^) directly 
echo on your machine.
echo.
echo 1. Ensure Android Studio is installed.
echo 2. Ensure an Android Emulator is running OR your physical phone 
echo    is plugged in via USB ^(with USB Debugging enabled^).
echo.
pause

REM Unset prod flag so app.config.js uses dev identity.
set "ARTERIA_LEAN_PROD="

REM Prebuild with dev config if android was last built for prod (or missing).
set "MODE_FILE=%~dp0apps\mobile\android\.arteria-build-mode"
if exist "%MODE_FILE%" (
    set /p CURRENT_MODE=<"%MODE_FILE%" 2>nul
) else (
    set "CURRENT_MODE="
)
if not "%CURRENT_MODE%"=="dev" (
    echo Regenerating native project for DEV ^(Arteria-dev^)...
    cd /d "%~dp0\apps\mobile"
    npx expo prebuild --clean --platform android
    if errorlevel 1 (
        echo ERROR: Prebuild failed.
        cd /d "%~dp0"
        pause
        exit /b 1
    )
    echo dev>"%MODE_FILE%"
    echo Prebuild complete. Proceeding to native build...
) else (
    echo Native project already in DEV mode. Skipping prebuild.
)

REM Always refresh local.properties so a bad sdk.dir ^(e.g. stale placeholder^) is fixed.
call "%~dp0Ensure_Android_LocalProps.bat"
if errorlevel 1 (
    cd /d "%~dp0"
    pause
    exit /b 1
)

call "%~dp0Invalidate_RN_Autolinking_Cache.bat"

cd /d "%~dp0\apps\mobile"
npx expo run:android

echo.
echo Build complete. If successful, Arteria-dev is now on your device!
echo You can now use 0_Start_Dev_Server.bat to update code instantly.
pause
