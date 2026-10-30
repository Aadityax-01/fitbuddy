"""
Workout router: AI-generated workout plans, today's plan, completion tracking.
"""

import json
from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.fitness import WorkoutLog
from app.models.user import User
from app.services.ai_service import generate_workout_plan
from app.utils.auth import get_current_user

router = APIRouter(prefix="/workout", tags=["Workout"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class WorkoutGenerateRequest(BaseModel):
    level: str = "beginner"          # beginner / intermediate / advanced
    type: str = "home"               # home / gym
    equipment: Optional[str] = None  # comma-separated; overrides profile
    duration_mins: int = 45
    goal: Optional[str] = None       # lose_weight / gain_muscle / endurance / maintain


class WorkoutResponse(BaseModel):
    id: int
    date: date
    workout_name: str
    duration_mins: int
    exercises: List[Dict[str, Any]]
    completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _serialize(log: WorkoutLog) -> WorkoutResponse:
    return WorkoutResponse(
        id=log.id,
        date=log.date,
        workout_name=log.workout_name,
        duration_mins=log.duration_mins,
        exercises=json.loads(log.exercises_json),
        completed=log.completed,
        created_at=log.created_at,
    )


def _profile_dict(user: User) -> Dict[str, Any]:
    if user.profile:
        p = user.profile
        return {
            "age": p.age,
            "gender": p.gender,
            "available_equipment": p.available_equipment,
            "fitness_goal": p.fitness_goal,
        }
    return {}


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/generate", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
def generate_workout(
    payload: WorkoutGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate an AI workout plan and persist it as a WorkoutLog."""
    preferences = payload.model_dump()
    profile = _profile_dict(current_user)

    plan_data = generate_workout_plan(profile, preferences)

    # Flatten full plan into exercises_json for storage; keep full plan too
    exercises = (
        plan_data.get("exercises", [])
        + [{"section": "warm_up", **e} for e in plan_data.get("warm_up", [])]
        + [{"section": "cool_down", **e} for e in plan_data.get("cool_down", [])]
    )

    log = WorkoutLog(
        user_id=current_user.id,
        date=datetime.now(timezone.utc).date(),
        workout_name=plan_data.get("workout_name", "Custom Workout"),
        duration_mins=plan_data.get("duration_mins", payload.duration_mins),
        exercises_json=json.dumps(exercises),
        completed=False,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return _serialize(log)


@router.get("/today", response_model=Optional[WorkoutResponse])
def get_today_workout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the most recent workout log for today, or null."""
    today = datetime.now(timezone.utc).date()
    log = (
        db.query(WorkoutLog)
        .filter(WorkoutLog.user_id == current_user.id, WorkoutLog.date == today)
        .order_by(WorkoutLog.created_at.desc())
        .first()
    )
    return _serialize(log) if log else None


@router.put("/{workout_id}/complete", response_model=WorkoutResponse)
def mark_complete(
    workout_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a workout log as completed."""
    log: Optional[WorkoutLog] = db.query(WorkoutLog).filter(
        WorkoutLog.id == workout_id,
        WorkoutLog.user_id == current_user.id,
    ).first()
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found.")

    log.completed = True
    db.commit()
    db.refresh(log)
    return _serialize(log)
