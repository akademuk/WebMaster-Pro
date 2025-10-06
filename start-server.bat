@echo off
echo.
echo ========================================
echo   WebMaster Pro - Local Development
echo ========================================
echo.

echo Checking for Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python found! Starting server on port 8000...
    echo.
    echo Open your browser and go to:
    echo http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
) else (
    echo Python not found. Checking for Node.js...
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Node.js found! Installing serve...
        npm install -g serve
        echo Starting server on port 3000...
        echo.
        echo Open your browser and go to:
        echo http://localhost:3000
        echo.
        echo Press Ctrl+C to stop the server
        echo.
        serve -s . -l 3000
    ) else (
        echo.
        echo Neither Python nor Node.js found!
        echo Please install one of them to run the local server:
        echo.
        echo Python: https://www.python.org/downloads/
        echo Node.js: https://nodejs.org/
        echo.
        pause
    )
)