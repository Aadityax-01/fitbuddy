"""
Water logs router: log water intake, daily totals.
"""

from datetime import date, datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.fitness import WaterLog
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/water", tags=["Water Logs"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class WaterLogCreate(BaseModel):
    amount_ml: float
    date: Optional[date] = None


class WaterLogOut(BaseModel):
    id: int
    date: date
    amount_ml: float
    created_at: datetime

    model_config = {"from_attributes": True}


class WaterSummary(BaseModel):
    date: date
    total_ml: float
    glasses_approx: float   # 1 glass ≈ 250 ml
    goal_met: bool           # goal is 2500 ml / day


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/log", response_model=WaterLogOut, status_code=201)
def log_water(
    payload: WaterLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log a water intake entry."""
    log_date = payload.date or datetime.now(timezone.utc).date()
    entry = WaterLog(user_id=current_user.id, date=log_date, amount_ml=payload.amount_ml)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/logs", response_model=List[WaterLogOut])
def get_water_logs(
    date: Optional[date] = Query(default=None, description="Date YYYY-MM-DD (defaults to today)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all water log entries for a given day (defaults to today)."""
    filter_date = date or datetime.now(timezone.utc).date()
    logs = (
        db.query(WaterLog)
        .filter(WaterLog.user_id == current_user.id, WaterLog.date == filter_date)
        .order_by(WaterLog.created_at.asc())
        .all()
    )
    return logs


@router.get("/summary", response_model=WaterSummary)
def water_summary(
    date: Optional[date] = Query(default=None, description="Date YYYY-MM-DD (defaults to today)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return total water intake for the day and whether the 2500 ml goal is met."""
    filter_date = date or datetime.now(timezone.utc).date()
    logs = (
        db.query(WaterLog)
        .filter(WaterLog.user_id == current_user.id, WaterLog.date == filter_date)
        .all()
    )
    total_ml = sum(log.amount_ml for log in logs)
    return WaterSummary(
        date=filter_date,
        total_ml=round(total_ml, 1),
        glasses_approx=round(total_ml / 250, 1),
        goal_met=total_ml >= 2500,
    )
