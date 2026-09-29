@echo off
title SkillPulse - Evidence-to-Action Intelligence Layer
echo ====================================================================
echo               LAUNCHING SKILLPULSE FULL-STACK PLATFORM
echo ====================================================================
echo.
echo Starting FastAPI Backend & UI Server on port 8000...
cd /d "%~dp0backend"
start "" http://127.0.0.1:8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause

