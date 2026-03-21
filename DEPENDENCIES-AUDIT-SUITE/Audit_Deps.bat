@echo off
echo =========================================
echo ARTERIA DEPENDENCY AUDIT SUITE
echo Date: %DATE% %TIME%
echo =========================================

echo.
echo Running npm audit...
call npm audit > DOCU\debugs\npm_audit_latest.log

echo.
echo Running npm outdated...
call npm outdated > DOCU\debugs\npm_outdated_latest.log

echo.
echo Audit logs preserved in DOCU\debugs\
echo - npm_audit_latest.log
echo - npm_outdated_latest.log
echo.
echo [!] Please ensure the AI agent or engineer manually reviews the logs, 
echo     addresses any vulnerabilities, and updates DOCU\SBOM.md.
