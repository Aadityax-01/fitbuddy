"""
SQLAlchemy database setup.
Uses SQLite for easy local development; swap DATABASE_URL in .env for Postgres/MySQL.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# ── Engine ──────────────────────────────────────────────────────────────────
# connect_args is required for SQLite to allow multi-threaded access
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.DEBUG,
)

# ── Session factory ─────────────────────────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ── Declarative Base ────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    """All SQLAlchemy models inherit from this base."""
    pass


# ── FastAPI dependency ───────────────────────────────────────────────────────
def get_db():
    """Yield a database session and ensure it is closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all_tables() -> None:
    """Create all tables defined in the models (called at startup)."""
    # Import models so their metadata is registered on Base before create_all
    import app.models.user      # noqa: F401
    import app.models.fitness   # noqa: F401

    Base.metadata.create_all(bind=engine)
