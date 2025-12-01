# PowerShell script to start the backend server
Set-Location $PSScriptRoot
Write-Host "Starting AI Resume Screener Backend Server..." -ForegroundColor Green
Write-Host "Server will run on http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
