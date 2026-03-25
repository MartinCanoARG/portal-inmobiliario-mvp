@echo off
setlocal

start "Portal Backend" cmd /k ""%~dp0start-backend.cmd""
start "Portal Frontend" cmd /k ""%~dp0start-frontend.cmd""
