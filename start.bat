@echo off
echo Запуск локального сервера для ЭлектроСхема...
start http://localhost:8080
python -m http.server 8080
pause
