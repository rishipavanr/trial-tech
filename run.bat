@echo off
title TECH TRIVIA
cd /d "%~dp0"
echo ============================================
echo   TECH TRIVIA - Local Launcher
echo ============================================

set SRV=
where py >nul 2>nul && set SRV=py
if not defined SRV ( where python >nul 2>nul && set SRV=python )

if defined SRV (
  start "TECH TRIVIA Server" /min cmd /c "%SRV% -m http.server 8080"
  timeout /t 2 /nobreak >nul
  start "" http://localhost:8080
  echo.
  echo   Site running at: http://localhost:8080
  echo   Close the minimized "TECH TRIVIA Server" window to stop it.
  echo.
  pause
  goto :eof
)

echo Python not found - opening site directly.
echo NOTE: Round 4 Python engine needs the server.
echo Install Python from python.org (tick "Add to PATH") for full power.
start "" "%~dp0index.html"
pause