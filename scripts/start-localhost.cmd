@echo off
setlocal

cd /d "%~dp0.."

echo.
echo A-Tec - levantando app web en localhost
echo URL: http://localhost:8083
echo.

"C:\Program Files\nodejs\npx.cmd" expo start --web --port 8083 --clear

endlocal
