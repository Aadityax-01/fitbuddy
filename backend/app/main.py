"""
FitBuddy AI - FastAPI Main Application Entrypoint
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.config import settings
from app.database import create_all_tables
from app.routers import (
    auth,
    chat,
    diet,
    food_logs,
    progress,
    users,
    water_logs,
    workout,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events: initialize database tables on startup.
    """
    create_all_tables()
    yield


app = FastAPI(
    title="FitBuddy AI API",
    description="Backend API for FitBuddy AI - AI-powered personal fitness and nutrition assistant",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Middleware ─────────────────────────────────────────────────────────
origins = list(settings.ALLOWED_ORIGINS)
for o in [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    "https://aadityax-01.github.io",
]:
    if o not in origins:
        origins.append(o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Include Routers ─────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(diet.router)
app.include_router(workout.router)
app.include_router(chat.router)
app.include_router(food_logs.router)
app.include_router(water_logs.router)
app.include_router(progress.router)


# ── Health & Root Endpoints ─────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "app": "FitBuddy AI API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "model": settings.OPENAI_MODEL,
        "openai_configured": bool(settings.OPENAI_API_KEY),
    }


# ── Global Exception Handler ───────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred", "error": str(exc)},
    )


if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
