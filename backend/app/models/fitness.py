"""
Fitness-related SQLAlchemy models:
FoodLog, WaterLog, WeightLog, WorkoutLog, DietPlan, ChatHistory.
"""

import uuid
from datetime import date, datetime, timezone
from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _today() -> date:
    return datetime.now(timezone.utc).date()


class FoodLog(Base):
    """Individual food item logged by the user."""

    __tablename__ = "food_logs"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    date: date = Column(Date, default=_today, nullable=False, index=True)
    meal_type: str = Column(String(16), nullable=False)   # breakfast / lunch / snack / dinner

    food_name: str = Column(String(256), nullable=False)
    calories: float = Column(Float, nullable=False, default=0.0)
    protein_g: float = Column(Float, nullable=False, default=0.0)
    carbs_g: float = Column(Float, nullable=False, default=0.0)
    fats_g: float = Column(Float, nullable=False, default=0.0)
    quantity: float = Column(Float, nullable=False, default=1.0)
    unit: str = Column(String(32), nullable=False, default="serving")

    created_at: datetime = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user = relationship("User", back_populates="food_logs")


class WaterLog(Base):
    """Single water-intake entry."""

    __tablename__ = "water_logs"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    date: date = Column(Date, default=_today, nullable=False, index=True)
    amount_ml: float = Column(Float, nullable=False)

    created_at: datetime = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user = relationship("User", back_populates="water_logs")


class WeightLog(Base):
    """Daily body-weight entry."""

    __tablename__ = "weight_logs"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    date: date = Column(Date, default=_today, nullable=False, index=True)
    weight_kg: float = Column(Float, nullable=False)

    created_at: datetime = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user = relationship("User", back_populates="weight_logs")


class WorkoutLog(Base):
    """A workout session logged by the user."""

    __tablename__ = "workout_logs"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    date: date = Column(Date, default=_today, nullable=False, index=True)
    workout_name: str = Column(String(256), nullable=False)
    duration_mins: int = Column(Integer, nullable=False, default=30)
    exercises_json: str = Column(Text, nullable=False, default="[]")  # JSON string
    completed: bool = Column(Boolean, default=False, nullable=False)

    created_at: datetime = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user = relationship("User", back_populates="workout_logs")


class DietPlan(Base):
    """AI-generated diet plan stored as JSON."""

    __tablename__ = "diet_plans"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    date: date = Column(Date, default=_today, nullable=False, index=True)
    plan_json: str = Column(Text, nullable=False, default="{}")   # Full AI-generated plan
    calories_target: float = Column(Float, nullable=False, default=2000.0)

    created_at: datetime = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user = relationship("User", back_populates="diet_plans")


class ChatHistory(Base):
    """Stores chat session messages as a JSON array."""

    __tablename__ = "chat_histories"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    session_id: str = Column(String(64), nullable=False, index=True, default=lambda: str(uuid.uuid4()))
    messages_json: str = Column(Text, nullable=False, default="[]")  # JSON array of {role, content}

    created_at: datetime = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user = relationship("User", back_populates="chat_histories")
