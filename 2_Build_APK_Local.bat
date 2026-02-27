@echo off
title Arteria Local APK Build (Shareable)
color 0e
echo ===================================================
echo Arteria - Local APK Build (No EAS Credits)
echo ===================================================
echo.
echo Builds a release APK on your machine for sharing.
echo Requires: Android Studio + Android SDK (same as 1_Run_Local_Android_Build.bat)
echo.
echo Output: apps\mobile\android\app\build\outputs\apk\release\app-release.apk
echo   (or android\app\build\outputs\apk\release\ if prebuild at root)
echo.
pause

cd /d "%~dp0"

REM Run from apps/mobile/android to use Gradle directly
REM This avoids the "No device found" error from 'npx expo run:android'
cd apps\mobile\android

echo Building release APK via Gradle (assembleRelease)...
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

REM APK may be in apps/mobile/android or root android depending on prebuild
set "APK_PATH="
if exist "apps\mobile\android\app\build\outputs\apk\release\app-release.apk" set "APK_PATH=%~dp0apps\mobile\android\app\build\outputs\apk\release\app-release.apk"
if not defined APK_PATH if exist "android\app\build\outputs\apk\release\app-release.apk" set "APK_PATH=%~dp0android\app\build\outputs\apk\release\app-release.apk"

echo.
echo ===================================================
echo BUILD SUCCESS
echo ===================================================
echo.
echo APK location:
echo   %APK_PATH%
echo.
echo Copy this file to share. Recipients may need to enable
echo "Install from unknown sources" to sideload.
echo.
pause
