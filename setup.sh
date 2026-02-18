#!/bin/bash

# AI-DocuMind Assistant Setup Script
# This script helps set up both backend and frontend

set -e

echo "========================================="
echo "AI-DocuMind Assistant Setup"
echo "========================================="
echo ""

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi
echo "✓ Python 3 found"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi
echo "✓ Node.js found"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi
echo "✓ npm found"

echo ""
echo "========================================="
echo "Setting up Backend"
echo "========================================="
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✓ Backend setup complete!"

cd ..

echo ""
echo "========================================="
echo "Setting up Frontend"
echo "========================================="
cd frontend

# Install dependencies
echo "Installing Node dependencies..."
npm install

echo "✓ Frontend setup complete!"

cd ..

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python -m uvicorn app.main:app --reload"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser and navigate to http://localhost:3000"
echo ""
echo "========================================="
