"""
Diet router: AI-generated diet plans, daily plan retrieval, history.
"""

import json
from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.fitness import DietPlan
from app.models.user import User
from app.services.ai_service import generate_diet_plan
from app.utils.auth import get_current_user

router = APIRouter(prefix="/diet", tags=["Diet"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class DietGenerateRequest(BaseModel):
    goal: Optional[str] = None                      # lose_weight / gain_muscle / maintain
    diet_type: Optional[str] = "non_vegetarian"     # vegetarian / non_vegetarian / vegan / eggetarian
    cuisine: str = "Indian"
    calories_target: int = 2000
    allergies: Optional[str] = None                 # comma-separated
    budget: Optional[str] = "medium"               # low / medium / high


class DietPlanResponse(BaseModel):
    id: int
    date: date
    calories_target: float
    plan: Dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _serialize_plan(plan: DietPlan) -> DietPlanResponse:
    return DietPlanResponse(
        id=plan.id,
        date=plan.date,
        calories_target=plan.calories_target,
        plan=json.loads(plan.plan_json),
        created_at=plan.created_at,
    )


def _profile_dict(user: User) -> Dict[str, Any]:
    if user.profile:
        p = user.profile
        return {
            "age": p.age,
            "gender": p.gender,
            "weight_kg": p.weight_kg,
            "height_cm": p.height_cm,
            "activity_level": p.activity_level,
            "fitness_goal": p.fitness_goal,
            "diet_type": p.diet_type,
            "dietary_restrictions": p.dietary_restrictions,
        }
    return {}


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/generate", response_model=DietPlanResponse, status_code=status.HTTP_201_CREATED)
def generate_diet(
    payload: DietGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Generate an AI-powered personalised Indian diet plan and persist it.
    Uses user's fitness profile for additional context.
    """
    preferences = payload.model_dump()
    profile = _profile_dict(current_user)

    plan_data = generate_diet_plan(profile, preferences)

    diet_plan = DietPlan(
        user_id=current_user.id,
        date=datetime.now(timezone.utc).date(),
        plan_json=json.dumps(plan_data),
        calories_target=payload.calories_target,
    )
    db.add(diet_plan)
    db.commit()
    db.refresh(diet_plan)
    return _serialize_plan(diet_plan)


@router.get("/today", response_model=Optional[DietPlanResponse])
def get_today_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the most recent diet plan generated today, or null."""
    today = datetime.now(timezone.utc).date()
    plan = (
        db.query(DietPlan)
        .filter(DietPlan.user_id == current_user.id, DietPlan.date == today)
        .order_by(DietPlan.created_at.desc())
        .first()
    )
    return _serialize_plan(plan) if plan else None


@router.get("/history", response_model=List[DietPlanResponse])
def get_diet_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the last N diet plans (default 10), newest first."""
    plans = (
        db.query(DietPlan)
        .filter(DietPlan.user_id == current_user.id)
        .order_by(DietPlan.created_at.desc())
        .limit(limit)
        .all()
    )
    return [_serialize_plan(p) for p in plans]
