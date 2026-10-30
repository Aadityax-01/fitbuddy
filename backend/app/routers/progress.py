"""
Progress router: weight logs, overview dashboard, weekly stats.
"""

from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.fitness import FoodLog, WeightLog, WorkoutLog
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class WeightLogCreate(BaseModel):
    weight_kg: float
    date: Optional[date] = None


class WeightLogOut(BaseModel):
    id: int
    date: date
    weight_kg: float
    created_at: datetime

    model_config = {"from_attributes": True}


class ProgressOverview(BaseModel):
    current_weight_kg: Optional[float]
    starting_weight_kg: Optional[float]
    weight_change_kg: Optional[float]
    total_food_logs: int
    total_workouts: int
    workouts_completed: int
    avg_daily_calories_7d: float
    streak_days: int                   # consecutive days with at least 1 food log


class WeeklyStats(BaseModel):
    week_start: date
    total_calories: float
    avg_calories: float
    workouts_done: int
    workouts_completed: int


# ── Helpers ───────────────────────────────────────────────────────────────────

def _compute_streak(db: Session, user_id: int) -> int:
    """Count consecutive days up to today that have at least one food log."""
    today = datetime.now(timezone.utc).date()
    streak = 0
    check_date = today
    while True:
        has_log = db.query(FoodLog).filter(
            FoodLog.user_id == user_id,
            FoodLog.date == check_date,
        ).first()
        if has_log:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break
    return streak


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/weight", response_model=WeightLogOut, status_code=201)
def log_weight(
    payload: WeightLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log a body weight measurement."""
    log_date = payload.date or datetime.now(timezone.utc).date()
    entry = WeightLog(user_id=current_user.id, date=log_date, weight_kg=payload.weight_kg)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/weight", response_model=List[WeightLogOut])
def get_weight_history(
    limit: int = Query(default=30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return weight history (newest first, default last 30 entries)."""
    logs = (
        db.query(WeightLog)
        .filter(WeightLog.user_id == current_user.id)
        .order_by(WeightLog.date.desc())
        .limit(limit)
        .all()
    )
    return logs


@router.get("/overview", response_model=ProgressOverview)
def get_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a high-level dashboard summary for the authenticated user."""
    today = datetime.now(timezone.utc).date()
    seven_days_ago = today - timedelta(days=7)

    # Weight stats
    weight_logs = (
        db.query(WeightLog)
        .filter(WeightLog.user_id == current_user.id)
        .order_by(WeightLog.date.asc())
        .all()
    )
    starting_weight = weight_logs[0].weight_kg if weight_logs else None
    current_weight = weight_logs[-1].weight_kg if weight_logs else None
    weight_change = (
        round(current_weight - starting_weight, 2)
        if (current_weight is not None and starting_weight is not None)
        else None
    )

    # Food log count
    total_food_logs = db.query(func.count(FoodLog.id)).filter(
        FoodLog.user_id == current_user.id
    ).scalar() or 0

    # Workout stats
    total_workouts = db.query(func.count(WorkoutLog.id)).filter(
        WorkoutLog.user_id == current_user.id
    ).scalar() or 0

    workouts_completed = db.query(func.count(WorkoutLog.id)).filter(
        WorkoutLog.user_id == current_user.id,
        WorkoutLog.completed == True,  # noqa: E712
    ).scalar() or 0

    # Avg daily calories last 7 days
    recent_cal_rows = (
        db.query(FoodLog.date, func.sum(FoodLog.calories).label("day_cal"))
        .filter(
            FoodLog.user_id == current_user.id,
            FoodLog.date >= seven_days_ago,
        )
        .group_by(FoodLog.date)
        .all()
    )
    avg_cal = (
        sum(row.day_cal for row in recent_cal_rows) / len(recent_cal_rows)
        if recent_cal_rows
        else 0.0
    )

    streak = _compute_streak(db, current_user.id)

    return ProgressOverview(
        current_weight_kg=current_weight,
        starting_weight_kg=starting_weight,
        weight_change_kg=weight_change,
        total_food_logs=total_food_logs,
        total_workouts=total_workouts,
        workouts_completed=workouts_completed,
        avg_daily_calories_7d=round(avg_cal, 2),
        streak_days=streak,
    )


@router.get("/weekly", response_model=List[WeeklyStats])
def get_weekly_stats(
    weeks: int = Query(default=4, ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return week-by-week calorie totals and workout counts for the last N weeks.
    Weeks start on Monday.
    """
    today = datetime.now(timezone.utc).date()
    # Start from the most recent Monday
    start_of_this_week = today - timedelta(days=today.weekday())
    results: List[WeeklyStats] = []

    for i in range(weeks):
        week_start = start_of_this_week - timedelta(weeks=i)
        week_end = week_start + timedelta(days=6)

        # Calories by day
        day_cals = (
            db.query(FoodLog.date, func.sum(FoodLog.calories).label("day_cal"))
            .filter(
                FoodLog.user_id == current_user.id,
                FoodLog.date >= week_start,
                FoodLog.date <= week_end,
            )
            .group_by(FoodLog.date)
            .all()
        )
        total_cal = sum(row.day_cal for row in day_cals)
        avg_cal = total_cal / len(day_cals) if day_cals else 0.0

        # Workouts
        wk_total = db.query(func.count(WorkoutLog.id)).filter(
            WorkoutLog.user_id == current_user.id,
            WorkoutLog.date >= week_start,
            WorkoutLog.date <= week_end,
        ).scalar() or 0

        wk_completed = db.query(func.count(WorkoutLog.id)).filter(
            WorkoutLog.user_id == current_user.id,
            WorkoutLog.date >= week_start,
            WorkoutLog.date <= week_end,
            WorkoutLog.completed == True,  # noqa: E712
        ).scalar() or 0

        results.append(
            WeeklyStats(
                week_start=week_start,
                total_calories=round(total_cal, 2),
                avg_calories=round(avg_cal, 2),
                workouts_done=wk_total,
                workouts_completed=wk_completed,
            )
        )

    return results
