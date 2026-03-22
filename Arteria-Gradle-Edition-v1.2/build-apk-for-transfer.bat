@echo off
REM Build APK and copy to dist\ with a timestamp — for Google Drive / sideload transfer.
REM Usage: build-apk-for-transfer.bat
REM        build-apk-for-transfer.bat release
REM        build-apk-for-transfer.bat clean
REM        build-apk-for-transfer.bat clean release

setlocal
cd /d "%~dp0"

set CLEAN=
set VARIANT=debug

:parse
if "%~1"=="" goto run
if /i "%~1"=="clean" set CLEAN=1& shift& goto parse
if /i "%~1"=="debug" set VARIANT=debug& shift& goto parse
if /i "%~1"=="release" set VARIANT=release& shift& goto parse
shift
goto parse

:run
set PS_ARGS=-NoProfile -ExecutionPolicy Bypass -File "%~dp0build-apk-for-transfer.ps1" -Variant %VARIANT%
if defined CLEAN set PS_ARGS=%PS_ARGS% -Clean

powershell %PS_ARGS%
set EXIT=%ERRORLEVEL%
if not "%EXIT%"=="0" exit /b %EXIT%
exit /b 0
