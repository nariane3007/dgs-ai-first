@echo off
title DB1 Faturamento App

echo.
echo ================================================
echo   DB1 Faturamento - Iniciando aplicacao...
echo ================================================
echo.

set PY=%LOCALAPPDATA%\Programs\Python\Python314\python.exe

:: Check Python
"%PY%" --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado em %PY%
    echo Instale em: https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Install deps if needed
echo Verificando dependencias...
"%PY%" -m pip show flask >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias...
    "%PY%" -m pip install -r requirements.txt
)

echo.
echo Acesse: http://localhost:5000
echo Pressione Ctrl+C para encerrar.
echo.

"%PY%" app.py

pause
