@echo off
title LABMAKER - IFES Campus Serra
set "PATH=%~dp0.runtime\node-v22.14.0-win-x64;%PATH%"
echo Iniciando servidor Backend (porta 3001) e Frontend Vite (porta 5173)...
start "" "http://localhost:5173"
npm run dev
