"""
User SQLAlchemy models: User and UserProfile.
"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    """Core authentication / identity table."""

    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String(128), nullable=False)
    email: str = Column(String(256), unique=True, index=True, nullable=False)
    hashed_password: str = Column(String(256), nullable=False)
    is_active: bool = Column(Boolean, default=True, nullable=False)
    created_at: datetime = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    food_logs = relationship("FoodLog", back_populates="user", cascade="all, delete-orphan")
    water_logs = relationship("WaterLog", back_populates="user", cascade="all, delete-orphan")
    weight_logs = relationship("WeightLog", back_populates="user", cascade="all, delete-orphan")
    workout_logs = relationship("WorkoutLog", back_populates="user", cascade="all, delete-orphan")
    diet_plans = relationship("DietPlan", back_populates="user", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    """Extended fitness profile for a user."""

    __tablename__ = "user_profiles"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    age: int | None = Column(Integer, nullable=True)
    gender: str | None = Column(String(16), nullable=True)          # male / female / other
    height_cm: float | None = Column(Float, nullable=True)
    weight_kg: float | None = Column(Float, nullable=True)

    # Lifestyle
    activity_level: str | None = Column(String(32), nullable=True)  # sedentary/light/moderate/active/very_active
    fitness_goal: str | None = Column(String(64), nullable=True)    # lose_weight/gain_muscle/maintain/endurance
    diet_type: str | None = Column(String(32), nullable=True)       # vegetarian/non_vegetarian/vegan/eggetarian

    dietary_restrictions: str | None = Column(Text, nullable=True)  # comma-separated e.g. "gluten,dairy"
    available_equipment: str | None = Column(Text, nullable=True)   # comma-separated e.g. "dumbbells,resistance_bands"

    created_at: datetime = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
    updated_at: datetime = Column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="profile")
