"""Vercel serverless entry point for the existing SkillPulse FastAPI app."""
from backend.main import app

# Vercel detects and serves this ASGI application as a Python Function.
