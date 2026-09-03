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
  echo.
  echo   Site opening at: http://localhost:8085
  echo   [DO NOT CLOSE THIS WINDOW] This terminal is running the Python engine.
  echo   Close this window ONLY when you are completely finished.
  echo.
  start "" http://localhost:8085
  "%SRV%" -m http.server 8085
  goto :eof
)

echo Python not found - opening site directly.
echo NOTE: Round 4 Python engine needs the server.
echo Install Python from python.org (tick "Add to PATH") for full power.
start "" "%~dp0index.html"
pause