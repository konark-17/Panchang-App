# Panchang App — Start Script
# Run this file to start both backend and frontend together

Write-Host "Starting Panchang Backend (Go)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-Command',
  'cd "' + $PSScriptRoot + '\backend"; Write-Host "Go Backend starting on :8080" -ForegroundColor Green; go run .'
)

Start-Sleep -Seconds 3

Write-Host "Starting Panchang Frontend (React)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-Command',
  'cd "' + $PSScriptRoot + '\frontend"; Write-Host "React Frontend starting on :5173" -ForegroundColor Green; npm run dev'
)

Write-Host ""
Write-Host "Both servers launching in separate windows." -ForegroundColor Yellow
Write-Host "Open your browser at: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
