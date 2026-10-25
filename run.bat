@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo Starting FinOPS Platform (Backend API ^& React Frontend)
echo ========================================================

:: 1. Start the FastAPI Backend in a new window
echo [1/2] Starting Backend API...
start "FinOPS Backend" cmd /k "cd /d "%~dp0API" && (if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) else (echo Note: No .venv found, running with system Python...)) && (where uvicorn >nul 2>nul && uvicorn app.main:app --reload --port 8000 || py -3.14 -m uvicorn app.main:app --reload --port 8000)"

:: 2. Start the React/Vite Frontend in a new window
echo [2/2] Starting Frontend App...
start "FinOPS Frontend" cmd /k "cd /d "%~dp0App" && (if not exist node_modules (echo [!] node_modules missing. Installing npm packages... && npm install)) && npm run dev"

echo.
echo ========================================================
echo Both applications launched in separate command windows!
echo Backend API : http://localhost:8000 (Swagger docs at /docs)
echo Frontend App: http://localhost:5173
echo ========================================================
