#!/bin/bash

# AI-DocuMind Assistant - Quick Start Script

echo "🧠 AI-DocuMind Assistant Setup"
echo "=============================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python main.py"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
