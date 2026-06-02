@echo off
title DB1 Faturamento App

echo.
echo ================================================
echo   DB1 Faturamento - Iniciando aplicacao...
echo ================================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado.
    echo Instale em: https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Install deps if needed
echo Verificando dependencias...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias...
    pip install -r requirements.txt
)

echo.
echo Acesse: http://localhost:5000
echo Pressione Ctrl+C para encerrar.
echo.

python app.py

pause
