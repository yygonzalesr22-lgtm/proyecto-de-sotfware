#!/usr/bin/env pwsh

Write-Host "🔴 Deteniendo todos los servidores Node..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "🟢 Iniciando backend..." -ForegroundColor Green
pushd "C:\Users\User\Desktop\proyecto\cafe-bar\cafe-bar-backend"
Start-Process node -ArgumentList "server.js" -NoNewWindow -PassThru
popd

Start-Sleep -Seconds 3

Write-Host "🟢 Iniciando frontend..." -ForegroundColor Green
pushd "C:\Users\User\Desktop\proyecto\cafe-bar\cafe-bar-frontend"
Start-Process npm -ArgumentList "run dev" -NoNewWindow -PassThru
popd

Start-Sleep -Seconds 3

Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
