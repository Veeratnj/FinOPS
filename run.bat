@echo off
echo Starting FinOPS Applications...

:: Start the FastAPI Backend in a new window
echo Starting Backend API...
start "FinOPS Backend" cmd /k "cd API && call .venv\Scripts\activate && uvicorn app.main:app --reload"

:: Start the React/Vite Frontend in a new window
echo Starting Frontend App...
start "FinOPS Frontend" cmd /k "cd App && npm run dev"

echo Both applications have been started in new windows!
