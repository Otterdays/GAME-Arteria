@echo off
chcp 65001 >nul 2>&1
title Arteria Local APK Build (Shareable)
color 0e
REM [TRACE: DOCU/EXPO_GUIDE.md — Dev/Prod Coexistence]
REM Prod build: "Arteria", com.anonymous.arteria. Dev uses "Arteria-dev" (1_Run_Local_Android_Build.bat).
REM We use Gradle directly from apps\mobile\android so the APK is built WITHOUT
REM a connected device. "npx expo run:android --variant release" requires a
REM device/emulator to install; gradlew.bat assembleRelease does not.
echo ===================================================
echo Arteria - Local APK Build ^(No EAS Credits^)
echo ===================================================
echo.
echo Builds a release APK on your machine for sharing.
echo App name: Arteria ^(prod^). Dev testing uses Arteria-dev separately.
echo Requires: Android Studio + Android SDK ^(same as 1_Run_Local_Android_Build.bat^)
echo.
echo Output folder: apps\mobile\android\app\build\outputs\apk\release\
echo Output: app-arm64-v8a-release.apk ^(~30 MB^) + app-armeabi-v7a-release.apk ^(~25 MB^)
echo Lean mode + ABI splits + R8 minify/shrink. Share the arm64 APK for most devices.
echo.
pause

set "NODE_ENV=production"
set "ARTERIA_LEAN_PROD=1"

REM Prebuild with prod config if android was last built for dev (or missing).
set "MODE_FILE=%~dp0apps\mobile\android\.arteria-build-mode"
if exist "%MODE_FILE%" (
    set /p CURRENT_MODE=<"%MODE_FILE%" 2>nul
) else (
    set "CURRENT_MODE="
)
if not "%CURRENT_MODE%"=="prod" (
    echo Regenerating native project for PROD ^(Arteria^)...
    cd /d "%~dp0\apps\mobile"
    npx expo prebuild --clean --platform android
    if errorlevel 1 (
        echo ERROR: Prebuild failed.
        cd /d "%~dp0"
        pause
        exit /b 1
    )
    echo prod>"%MODE_FILE%"
    echo Prebuild complete. Proceeding to Gradle build...
) else (
    echo Native project already in PROD mode. Skipping prebuild.
)

REM Always refresh local.properties so a bad sdk.dir ^(e.g. stale placeholder^) is fixed.
call "%~dp0Ensure_Android_LocalProps.bat"
if errorlevel 1 (
    cd /d "%~dp0"
    pause
    exit /b 1
)

call "%~dp0Invalidate_RN_Autolinking_Cache.bat"

cd /d "%~dp0\apps\mobile\android"
if errorlevel 1 (
    echo ERROR: Could not cd to apps\mobile\android
    pause
    exit /b 1
)

REM Stop stale Gradle daemons so we start fresh (avoids "6 incompatible" buildup).
call gradlew.bat --stop
if errorlevel 1 (
    echo Note: gradlew --stop had an issue. Continuing...
)

REM Gradle only (no device). Root index.js redirects Metro when it resolves from Arteria.
echo Building release APK via Gradle ^(no device required^)...
echo Using ARTERIA_LEAN_PROD=1 ^(lean production autolinking^)
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

REM ABI splits: gradle.properties arm-only + splits in build.gradle → two APKs.
set "APK_DIR=%~dp0apps\mobile\android\app\build\outputs\apk\release"
set "APK_ARM64=%APK_DIR%\app-arm64-v8a-release.apk"
set "APK_ARM32=%APK_DIR%\app-armeabi-v7a-release.apk"
set "APK_PATH="
if exist "%APK_ARM64%" set "APK_PATH=%APK_ARM64%"
if "%APK_PATH%"=="" if exist "%APK_ARM32%" set "APK_PATH=%APK_ARM32%"
if "%APK_PATH%"=="" if exist "%APK_DIR%\app-release.apk" set "APK_PATH=%APK_DIR%\app-release.apk"

echo.
echo ===================================================
echo BUILD SUCCESS
echo ===================================================
echo.
echo APK output folder:
echo   %APK_DIR%
echo.
echo APKs to share ^(use arm64 for most phones^):
if exist "%APK_ARM64%" echo   app-arm64-v8a-release.apk
if exist "%APK_ARM32%" echo   app-armeabi-v7a-release.apk
echo.
echo Primary: %APK_PATH%
echo.
echo Copy the desired APK to share. Recipients may need to enable
echo "Install from unknown sources" to sideload.
echo.
pause
