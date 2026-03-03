@echo off
title Info Scraper
cd /d "%~dp0"
if not exist node_modules call npm install
echo Starting Info Scraper at http://localhost:3847
start http://localhost:3847
node server.js
pause
