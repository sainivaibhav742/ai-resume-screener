# Quick Start Script for AI Resume Screener
# Run this script to start both backend and frontend servers

Write-Host "🚀 Starting AI Resume Screener - Smart Hiring OS" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.9+ first." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Select an option:" -ForegroundColor Cyan
Write-Host "1. Full Setup (First time)" -ForegroundColor White
Write-Host "2. Start Backend Only" -ForegroundColor White
Write-Host "3. Start Frontend Only" -ForegroundColor White
Write-Host "4. Start Both (Quick Start)" -ForegroundColor White
Write-Host "5. Initialize Database" -ForegroundColor White
Write-Host "6. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔧 Running Full Setup..." -ForegroundColor Cyan
        
        # Backend setup
        Write-Host ""
        Write-Host "Setting up Backend..." -ForegroundColor Yellow
        Write-Host "Creating virtual environment..." -ForegroundColor Gray
        python -m venv venv
        
        Write-Host "Activating virtual environment..." -ForegroundColor Gray
        & .\venv\Scripts\Activate.ps1
        
        Write-Host "Installing Python dependencies..." -ForegroundColor Gray
        pip install --upgrade pip
        pip install -r requirements.txt
        pip install email-validator
        
        Write-Host "Downloading spaCy model..." -ForegroundColor Gray
        python -m spacy download en_core_web_sm
        
        # Check for .env file
        if (-not (Test-Path ".env")) {
            Write-Host "Creating .env file from template..." -ForegroundColor Gray
            Copy-Item .env.example .env
            Write-Host "⚠️  Please edit .env file with your configuration!" -ForegroundColor Yellow
        }
        
        # Initialize database
        Write-Host "Initializing database..." -ForegroundColor Gray
        Set-Location backend
        python init_db.py
        Set-Location ..
        
        # Frontend setup
        Write-Host ""
        Write-Host "Setting up Frontend..." -ForegroundColor Yellow
        Set-Location frontend
        
        Write-Host "Installing Node dependencies..." -ForegroundColor Gray
        npm install
        
        Set-Location ..
        
        Write-Host ""
        Write-Host "✅ Setup Complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Edit .env file with your configuration" -ForegroundColor White
        Write-Host "2. Run this script again and select option 4 to start servers" -ForegroundColor White
        Write-Host ""
    }
    
    "2" {
        Write-Host ""
        Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
        Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Green
        Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Green
        Write-Host ""
        
        & .\venv\Scripts\Activate.ps1
        Set-Location backend
        python main.py
    }
    
    "3" {
        Write-Host ""
        Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Cyan
        Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        
        Set-Location frontend
        npm run dev
    }
    
    "4" {
        Write-Host ""
        Write-Host "🚀 Starting Both Servers..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Backend: http://localhost:8000" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
        Write-Host "Candidate Portal: http://localhost:3000/candidate" -ForegroundColor Green
        Write-Host "Recruiter Portal: http://localhost:3000/recruiter" -ForegroundColor Green
        Write-Host ""
        Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
        Write-Host ""
        
        # Start backend in a new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\venv\Scripts\Activate.ps1; cd backend; python main.py"
        
        # Wait a moment for backend to start
        Start-Sleep -Seconds 3
        
        # Start frontend in a new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"
        
        Write-Host "✅ Both servers started in separate windows!" -ForegroundColor Green
        Write-Host ""
    }
    
    "5" {
        Write-Host ""
        Write-Host "🔧 Initializing Database..." -ForegroundColor Cyan
        Write-Host "⚠️  This will create/reset all database tables" -ForegroundColor Yellow
        Write-Host ""
        
        $confirm = Read-Host "Continue? (y/n)"
        if ($confirm -eq "y") {
            & .\venv\Scripts\Activate.ps1
            Set-Location backend
            python init_db.py
            Set-Location ..
            Write-Host ""
            Write-Host "✅ Database initialized!" -ForegroundColor Green
        }
    }
    
    "6" {
        Write-Host "Goodbye! 👋" -ForegroundColor Cyan
        exit 0
    }
    
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
