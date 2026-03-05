@echo off
title EAS OTA Rollback (Arteria)
color 0c
echo ================================================
echo    EAS OTA Rollback (Undo Last Update)
echo ================================================
echo.
echo This script will create a rollback on the production
echo channel, reverting players to the PREVIOUS update.
echo.
echo Use this if you pushed a bad OTA that causes crashes
echo or bugs. Players will receive the rollback on next
echo app open.
echo.
set /p confirm="Are you sure you want to ROLLBACK the last OTA? (Y/N): "
if /I "%confirm%" neq "Y" (
    echo Rollback cancelled.
    pause
    exit /b
)
cd /d "%~dp0\apps\mobile"
set CI=1
set ARTERIA_LEAN_PROD=1
echo Creating rollback on production channel...
npx eas-cli update:rollback --channel production --platform android
echo.
echo [COMPLETE] Rollback created. Players will revert on next app open.
echo NOTE: If the rollback command is unavailable on your eas-cli version,
echo       you can re-publish the previous working commit as a new OTA instead:
echo         git checkout [good-commit]
echo         Update_2_EAS_OTA_Update.bat
echo         git checkout main
pause
