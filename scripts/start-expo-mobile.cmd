@echo off
setlocal

cd /d "%~dp0.."

echo.
echo A-Tec - levantando Expo para probar en celular
echo.
echo Requisitos:
echo 1. Instalar Expo Go en el celular.
echo 2. Conectar PC y celular a la misma red WiFi.
echo 3. Escanear el QR que aparezca en esta terminal.
echo.

"C:\Program Files\nodejs\npx.cmd" expo start --lan --clear

endlocal
