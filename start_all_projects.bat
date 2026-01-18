@echo off
echo Starting Projeto 2 Backend...
start /B cmd /C "cd Projetos\Projeto 2\backend && npm start"

echo Starting Projeto 2 Frontend...
start /B cmd /C "cd Projetos\Projeto 2\frontend && npm start"

echo Starting Projeto 3...
start /B cmd /C "cd Projetos\Projeto 3 && python app.py"

echo All projects started in background.
pause
