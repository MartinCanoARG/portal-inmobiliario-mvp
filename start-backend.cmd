@echo off
setlocal

cd /d "%~dp0backend"

if not exist ".venv\Scripts\python.exe" (
  echo [backend] Creando entorno virtual...
  python -m venv .venv
  if errorlevel 1 goto :error
)

echo [backend] Instalando dependencias...
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto :error

echo [backend] Aplicando migraciones...
".venv\Scripts\python.exe" manage.py migrate
if errorlevel 1 goto :error

echo [backend] Cargando datos demo...
".venv\Scripts\python.exe" manage.py seed_demo
if errorlevel 1 goto :error

echo [backend] Iniciando servidor en http://127.0.0.1:8000
".venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8000
goto :eof

:error
echo.
echo [backend] No se pudo iniciar el backend.
exit /b 1
