@echo off
title Arteria Local APK Build (Shareable)
color 0e
REM [TRACE: DOCU/SCRATCHPAD.md]
REM We use Gradle directly from apps\mobile\android so the APK is built WITHOUT
REM a connected device. "npx expo run:android --variant release" requires a
REM device/emulator to install; gradlew.bat assembleRelease does not.
REM In PowerShell you must use .\gradlew.bat (current dir not on PATH).
echo ===================================================
echo Arteria - Local APK Build (No EAS Credits)
echo ===================================================
echo.
echo Builds a release APK on your machine for sharing.
echo Requires: Android Studio + Android SDK (same as 1_Run_Local_Android_Build.bat)
echo.
echo Output folder: apps\mobile\android\app\build\outputs\apk\release\
echo Preferred file: app-arm64-v8a-release.apk (smaller than universal APK)
echo Lean mode: excludes Expo dev-client native modules for smaller prod APKs
echo.
pause

cd /d "%~dp0\apps\mobile\android"
if errorlevel 1 (
    echo ERROR: Could not cd to apps\mobile\android
    pause
    exit /b 1
)

set "NODE_ENV=production"
set "ARTERIA_LEAN_PROD=1"

REM Stop stale Gradle daemons so we start fresh (avoids "6 incompatible" buildup).
call gradlew.bat --stop
if errorlevel 1 (
    echo Note: gradlew --stop had an issue. Continuing...
)

REM Gradle only (no device). Root index.js redirects Metro when it resolves from Arteria.
echo Building release APK via Gradle (no device required)...
echo Using ARTERIA_LEAN_PROD=1 (lean production autolinking)
echo This might take a few minutes...
call gradlew.bat assembleRelease

if %ERRORLEVEL% neq 0 (
    echo.
    echo Build FAILED. Check errors above.
    echo Ensure Android SDK and JAVA_HOME are correctly set.
    cd /d "%~dp0"
    pause
    exit /b 1
)

cd /d "%~dp0"

set "APK_DIR=%~dp0apps\mobile\android\app\build\outputs\apk\release"
set "APK_PATH="
if exist "%APK_DIR%\app-arm64-v8a-release.apk" set "APK_PATH=%APK_DIR%\app-arm64-v8a-release.apk"
if "%APK_PATH%"=="" if exist "%APK_DIR%\app-armeabi-v7a-release.apk" set "APK_PATH=%APK_DIR%\app-armeabi-v7a-release.apk"
if "%APK_PATH%"=="" if exist "%APK_DIR%\app-release.apk" set "APK_PATH=%APK_DIR%\app-release.apk"

echo.
echo ===================================================
echo BUILD SUCCESS
echo ===================================================
echo.
echo APK output folder:
echo   %APK_DIR%
echo.
echo Preferred APK to share:
echo   %APK_PATH%
echo.
echo Copy this file to share. Recipients may need to enable
echo "Install from unknown sources" to sideload.
echo.
pause
