@echo off
REM React Native settings plugin caches autolinking.json from lockfiles only — not from
REM ARTERIA_LEAN_PROD. Deleting this folder forces Gradle to re-run expo-modules-autolinking
REM so app.config.js lean excludes apply. [TRACE: DOCU/EXPO_GUIDE.md §4b]
set "AUTOLINK_DIR=%~dp0apps\mobile\android\build\generated\autolinking"
if exist "%AUTOLINK_DIR%" (
    rd /s /q "%AUTOLINK_DIR%" 2>nul
    echo Cleared React Native autolinking cache ^(fresh graph for current env^).
)
exit /b 0
