@echo off
REM Writes apps\mobile\android\local.properties with a valid sdk.dir.
REM Resolution order: ANDROID_HOME, ANDROID_SDK_ROOT, default Studio path,
REM then reuse sdk.dir from existing local.properties only if that folder exists.
REM [TRACE: DOCU/EXPO_GUIDE.md — local Android builds]
setlocal EnableDelayedExpansion
set "REPO_ROOT=%~dp0"
set "LOCAL_PROPS=%REPO_ROOT%apps\mobile\android\local.properties"
set "SDK_DIR="

if defined ANDROID_HOME (
  if exist "!ANDROID_HOME!\platform-tools\adb.exe" set "SDK_DIR=!ANDROID_HOME!"
)
if not defined SDK_DIR if defined ANDROID_SDK_ROOT (
  if exist "!ANDROID_SDK_ROOT!\platform-tools\adb.exe" set "SDK_DIR=!ANDROID_SDK_ROOT!"
)
if not defined SDK_DIR (
  if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
    set "SDK_DIR=%LOCALAPPDATA%\Android\Sdk"
  )
)

if not defined SDK_DIR if exist "%LOCAL_PROPS%" (
  set "SDKLINE="
  for /f "usebackq tokens=* delims=" %%L in (`type "%LOCAL_PROPS%" ^| findstr /b /c:"sdk.dir="`) do set "SDKLINE=%%L"
  if defined SDKLINE (
    for /f "tokens=1,* delims==" %%A in ("!SDKLINE!") do set "CAND=%%B"
    if defined CAND (
      if exist "!CAND!\platform-tools\adb.exe" set "SDK_DIR=!CAND!"
    )
  )
)

if not defined SDK_DIR (
  echo.
  echo ERROR: Android SDK not found. Gradle needs sdk.dir in:
  echo   %LOCAL_PROPS%
  echo.
  echo Fix one of:
  echo   1. Set ANDROID_HOME to the SDK root ^(folder that contains platform-tools^).
  echo   2. Install Android Studio and the Android SDK ^(default: %LOCALAPPDATA%\Android\Sdk^).
  echo   3. Manually set sdk.dir in local.properties to your SDK path ^(use forward slashes^).
  echo.
  endlocal
  exit /b 1
)

set "SDK_FWD=!SDK_DIR:\=/!"
> "%LOCAL_PROPS%" echo sdk.dir=!SDK_FWD!

echo Using Android SDK: !SDK_DIR!
endlocal
exit /b 0
