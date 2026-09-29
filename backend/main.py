"""
SkillPulse Backend Application Entry Point
FastAPI + Pydantic + SQLite/PostGIS Data Layer
Smart India Hackathon 2026 — Problem Statement 134
"""

import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.database.db import init_db
from backend.routers.api import router as api_router

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(
    title="SkillPulse Intelligence API",
    description="Evidence-to-Action Intelligence Layer for Continuous Skill Planning (SIH 2026 PS 134)",
    version="1.0.0"
)

# Enable CORS for local development and live dashboard communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: initialize database schema and seed data
@app.on_event("startup")
def on_startup():
    init_db()

# Mount API routes
init_db()
app.include_router(api_router)

# Serve Frontend static assets directly
@app.get("/")
def serve_index():
    return FileResponse(BASE_DIR / "index.html")

@app.get("/styles.css")
def serve_styles():
    return FileResponse(BASE_DIR / "styles.css")

@app.get("/app.js")
def serve_app_js():
    return FileResponse(BASE_DIR / "app.js")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillPulse Intelligence Layer",
        "cycle": "Cycle 03",
        "region": "Maharashtra Industrial Belt"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
