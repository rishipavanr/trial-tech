@echo off
title TECH TRIVIA - System Setup
cd /d "%~dp0"

echo ========================================================
echo        TECH TRIVIA - Dependency Installer
echo ========================================================
echo.
echo This system is built as a pure, lightweight static web app.
echo There are no heavy Node.js (npm) modules to install!
echo.
echo Checking system requirements...
echo --------------------------------------------------------

:: Check for Python (Required for the local HTTP server in run.bat)
set PYTHON_INSTALLED=0
where py >nul 2>nul && set PYTHON_INSTALLED=1
if %PYTHON_INSTALLED% equ 0 (
    where python >nul 2>nul && set PYTHON_INSTALLED=1
)

if %PYTHON_INSTALLED% equ 1 (
    echo [ OK ] Python is installed. (Required for local server)
) else (
    echo [WARN] Python was NOT found on this system!
    echo        Python is required to run the local web server via run.bat.
    echo        The Python Engine (Pyodide) in Round 4 will not work 
    echo        over the file:// protocol.
    echo.
    echo        Press any key to open the Python download page...
    pause >nul
    start "" "https://www.python.org/downloads/"
    echo        IMPORTANT: When installing, check the box that says:
    echo        "Add Python to PATH" at the bottom of the installer!
)

echo.
echo --------------------------------------------------------
echo Setup Complete! 
echo.
echo If Python is installed, you are ready to host the quiz locally.
echo Double-click 'run.bat' to start the local server and open the app.
echo.
pause
