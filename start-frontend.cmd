@echo off
setlocal

cd /d "%~dp0frontend"

if not exist "node_modules" (
  echo [frontend] Instalando dependencias...
  call npm.cmd install
  if errorlevel 1 goto :error
)

echo [frontend] Limpiando cache local de Next.js...
if exist ".next" rmdir /s /q ".next"

echo [frontend] Iniciando servidor en http://127.0.0.1:3000
call npm.cmd run dev
goto :eof

:error
echo.
echo [frontend] No se pudo iniciar el frontend.
exit /b 1
