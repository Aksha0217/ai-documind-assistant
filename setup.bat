@echo off
REM AI-DocuMind Assistant - Quick Start Script for Windows

echo 🧠 AI-DocuMind Assistant Setup
echo ==============================
echo.

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

echo ✅ Python found
python --version

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 14 or higher.
    exit /b 1
)

echo ✅ Node.js found
node --version
echo.

REM Backend setup
echo 📦 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

cd ..

REM Frontend setup
echo.
echo 📦 Setting up frontend...
cd frontend

REM Install Node dependencies
echo Installing Node.js dependencies...
call npm install

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo.
echo 1. Start the backend (in one terminal):
echo    cd backend
echo    venv\Scripts\activate
echo    python main.py
echo.
echo 2. Start the frontend (in another terminal):
echo    cd frontend
echo    npm start
echo.
echo 3. Open http://localhost:3000 in your browser
echo.

pause
