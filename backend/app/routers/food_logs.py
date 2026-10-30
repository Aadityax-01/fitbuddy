"""
Food logs router: log meals, daily summaries, food search.
Built-in database of 50 common Indian foods with nutrition data.
"""

from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.fitness import FoodLog
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/food", tags=["Food Logs"])


# ── Built-in Indian food database ─────────────────────────────────────────────
INDIAN_FOODS: List[Dict[str, Any]] = [
    {"name": "Dal Tadka",            "calories": 150, "protein_g": 9.0,  "carbs_g": 20.0, "fats_g": 4.0,  "unit": "katori (150ml)"},
    {"name": "Chicken Curry",        "calories": 230, "protein_g": 25.0, "carbs_g": 8.0,  "fats_g": 10.0, "unit": "katori (150g)"},
    {"name": "Paneer Butter Masala", "calories": 280, "protein_g": 14.0, "carbs_g": 12.0, "fats_g": 19.0, "unit": "katori (150g)"},
    {"name": "Rajma Chawal",         "calories": 370, "protein_g": 14.0, "carbs_g": 60.0, "fats_g": 7.0,  "unit": "plate"},
    {"name": "Chole Bhature",        "calories": 500, "protein_g": 15.0, "carbs_g": 70.0, "fats_g": 18.0, "unit": "plate"},
    {"name": "Idli",                 "calories": 58,  "protein_g": 2.0,  "carbs_g": 12.0, "fats_g": 0.4,  "unit": "piece"},
    {"name": "Dosa (plain)",         "calories": 120, "protein_g": 3.0,  "carbs_g": 22.0, "fats_g": 2.5,  "unit": "piece"},
    {"name": "Masala Dosa",          "calories": 210, "protein_g": 5.0,  "carbs_g": 34.0, "fats_g": 6.0,  "unit": "piece"},
    {"name": "Sambar",               "calories": 55,  "protein_g": 3.0,  "carbs_g": 8.0,  "fats_g": 1.5,  "unit": "katori (150ml)"},
    {"name": "Upma",                 "calories": 190, "protein_g": 5.0,  "carbs_g": 32.0, "fats_g": 5.0,  "unit": "bowl (200g)"},
    {"name": "Poha",                 "calories": 200, "protein_g": 4.0,  "carbs_g": 36.0, "fats_g": 5.0,  "unit": "bowl (200g)"},
    {"name": "Aloo Paratha",         "calories": 300, "protein_g": 6.0,  "carbs_g": 44.0, "fats_g": 11.0, "unit": "piece"},
    {"name": "Plain Roti",           "calories": 100, "protein_g": 3.0,  "carbs_g": 18.0, "fats_g": 1.5,  "unit": "piece"},
    {"name": "Multigrain Roti",      "calories": 90,  "protein_g": 3.5,  "carbs_g": 16.0, "fats_g": 1.5,  "unit": "piece"},
    {"name": "Naan",                 "calories": 260, "protein_g": 8.0,  "carbs_g": 45.0, "fats_g": 5.0,  "unit": "piece"},
    {"name": "Steamed Rice",         "calories": 206, "protein_g": 4.3,  "carbs_g": 44.5, "fats_g": 0.4,  "unit": "cup cooked"},
    {"name": "Brown Rice",           "calories": 216, "protein_g": 5.0,  "carbs_g": 45.0, "fats_g": 1.8,  "unit": "cup cooked"},
    {"name": "Biryani (Chicken)",    "calories": 490, "protein_g": 28.0, "carbs_g": 55.0, "fats_g": 16.0, "unit": "plate"},
    {"name": "Biryani (Veg)",        "calories": 380, "protein_g": 9.0,  "carbs_g": 60.0, "fats_g": 11.0, "unit": "plate"},
    {"name": "Khichdi",              "calories": 250, "protein_g": 9.0,  "carbs_g": 42.0, "fats_g": 5.0,  "unit": "bowl"},
    {"name": "Curd / Dahi",          "calories": 60,  "protein_g": 3.5,  "carbs_g": 5.0,  "fats_g": 2.0,  "unit": "katori (100g)"},
    {"name": "Raita (veg)",          "calories": 75,  "protein_g": 4.0,  "carbs_g": 7.0,  "fats_g": 2.5,  "unit": "katori"},
    {"name": "Lassi (sweet)",        "calories": 180, "protein_g": 6.0,  "carbs_g": 26.0, "fats_g": 5.0,  "unit": "glass (250ml)"},
    {"name": "Masala Chai",          "calories": 50,  "protein_g": 1.5,  "carbs_g": 6.0,  "fats_g": 2.0,  "unit": "cup"},
    {"name": "Protein Shake",        "calories": 150, "protein_g": 25.0, "carbs_g": 8.0,  "fats_g": 2.0,  "unit": "scoop"},
    {"name": "Egg (boiled)",         "calories": 70,  "protein_g": 6.0,  "carbs_g": 0.6,  "fats_g": 4.5,  "unit": "piece"},
    {"name": "Omelette (2 egg)",     "calories": 180, "protein_g": 12.0, "carbs_g": 1.0,  "fats_g": 14.0, "unit": "serving"},
    {"name": "Banana",               "calories": 90,  "protein_g": 1.1,  "carbs_g": 23.0, "fats_g": 0.3,  "unit": "medium"},
    {"name": "Apple",                "calories": 72,  "protein_g": 0.4,  "carbs_g": 19.0, "fats_g": 0.2,  "unit": "medium"},
    {"name": "Orange",               "calories": 62,  "protein_g": 1.2,  "carbs_g": 15.4, "fats_g": 0.2,  "unit": "medium"},
    {"name": "Mixed Nuts",           "calories": 180, "protein_g": 5.0,  "carbs_g": 6.0,  "fats_g": 15.0, "unit": "30g"},
    {"name": "Peanuts (roasted)",    "calories": 166, "protein_g": 7.5,  "carbs_g": 6.0,  "fats_g": 14.0, "unit": "30g"},
    {"name": "Palak Sabzi",          "calories": 90,  "protein_g": 4.0,  "carbs_g": 8.0,  "fats_g": 4.0,  "unit": "katori"},
    {"name": "Aloo Gobi",            "calories": 130, "protein_g": 3.0,  "carbs_g": 18.0, "fats_g": 5.0,  "unit": "katori"},
    {"name": "Baingan Bharta",       "calories": 110, "protein_g": 3.0,  "carbs_g": 12.0, "fats_g": 5.0,  "unit": "katori"},
    {"name": "Mixed Veg Curry",      "calories": 120, "protein_g": 4.0,  "carbs_g": 15.0, "fats_g": 5.0,  "unit": "katori"},
    {"name": "Pav Bhaji",            "calories": 380, "protein_g": 10.0, "carbs_g": 58.0, "fats_g": 12.0, "unit": "plate"},
    {"name": "Vada Pav",             "calories": 290, "protein_g": 7.0,  "carbs_g": 42.0, "fats_g": 10.0, "unit": "piece"},
    {"name": "Sabudana Khichdi",     "calories": 250, "protein_g": 3.0,  "carbs_g": 44.0, "fats_g": 7.0,  "unit": "bowl"},
    {"name": "Dhokla",               "calories": 75,  "protein_g": 4.0,  "carbs_g": 12.0, "fats_g": 1.5,  "unit": "piece"},
    {"name": "Halwa (Atta)",         "calories": 280, "protein_g": 4.0,  "carbs_g": 40.0, "fats_g": 12.0, "unit": "katori"},
    {"name": "Kheer",                "calories": 200, "protein_g": 5.0,  "carbs_g": 32.0, "fats_g": 6.0,  "unit": "katori"},
    {"name": "Gajar Halwa",          "calories": 250, "protein_g": 4.5,  "carbs_g": 38.0, "fats_g": 9.0,  "unit": "katori"},
    {"name": "Fish Curry",           "calories": 190, "protein_g": 22.0, "carbs_g": 6.0,  "fats_g": 8.0,  "unit": "katori"},
    {"name": "Mutton Curry",         "calories": 280, "protein_g": 26.0, "carbs_g": 5.0,  "fats_g": 17.0, "unit": "katori"},
    {"name": "Prawn Masala",         "calories": 170, "protein_g": 20.0, "carbs_g": 5.0,  "fats_g": 7.0,  "unit": "katori"},
    {"name": "Sprouts Salad",        "calories": 90,  "protein_g": 7.0,  "carbs_g": 14.0, "fats_g": 0.5,  "unit": "bowl"},
    {"name": "Vegetable Soup",       "calories": 80,  "protein_g": 3.0,  "carbs_g": 12.0, "fats_g": 2.0,  "unit": "bowl"},
    {"name": "Panner Bhurji",        "calories": 210, "protein_g": 12.0, "carbs_g": 5.0,  "fats_g": 15.0, "unit": "katori"},
    {"name": "Oats Porridge",        "calories": 150, "protein_g": 5.0,  "carbs_g": 27.0, "fats_g": 2.5,  "unit": "bowl"},
]


# ── Schemas ───────────────────────────────────────────────────────────────────

class FoodLogCreate(BaseModel):
    food_name: str
    meal_type: str                    # breakfast / lunch / snack / dinner
    calories: float
    protein_g: float = 0.0
    carbs_g: float = 0.0
    fats_g: float = 0.0
    quantity: float = 1.0
    unit: str = "serving"
    date: Optional[date] = None


class FoodLogOut(BaseModel):
    id: int
    date: date
    meal_type: str
    food_name: str
    calories: float
    protein_g: float
    carbs_g: float
    fats_g: float
    quantity: float
    unit: str
    created_at: datetime

    model_config = {"from_attributes": True}


class NutritionSummary(BaseModel):
    date: date
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fats_g: float
    meal_breakdown: Dict[str, float]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/log", response_model=FoodLogOut, status_code=status.HTTP_201_CREATED)
def log_food(
    payload: FoodLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log a food item for the current user."""
    log_date = payload.date or datetime.now(timezone.utc).date()
    entry = FoodLog(
        user_id=current_user.id,
        date=log_date,
        meal_type=payload.meal_type,
        food_name=payload.food_name,
        calories=payload.calories,
        protein_g=payload.protein_g,
        carbs_g=payload.carbs_g,
        fats_g=payload.fats_g,
        quantity=payload.quantity,
        unit=payload.unit,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/logs", response_model=List[FoodLogOut])
def get_logs(
    date: Optional[date] = Query(default=None, description="Filter by date YYYY-MM-DD"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return food logs for the authenticated user. Defaults to today."""
    filter_date = date or datetime.now(timezone.utc).date()
    logs = (
        db.query(FoodLog)
        .filter(FoodLog.user_id == current_user.id, FoodLog.date == filter_date)
        .order_by(FoodLog.created_at.asc())
        .all()
    )
    return logs


@router.delete("/logs/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_log(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a specific food log entry."""
    entry = db.query(FoodLog).filter(
        FoodLog.id == log_id,
        FoodLog.user_id == current_user.id,
    ).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Log entry not found.")
    db.delete(entry)
    db.commit()


@router.get("/summary", response_model=NutritionSummary)
def nutrition_summary(
    date: Optional[date] = Query(default=None, description="Date YYYY-MM-DD (defaults to today)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return total calories, protein, carbs, fats for a given day."""
    filter_date = date or datetime.now(timezone.utc).date()
    logs = (
        db.query(FoodLog)
        .filter(FoodLog.user_id == current_user.id, FoodLog.date == filter_date)
        .all()
    )

    meal_breakdown: Dict[str, float] = {}
    total_cal = total_prot = total_carbs = total_fats = 0.0

    for log in logs:
        total_cal += log.calories
        total_prot += log.protein_g
        total_carbs += log.carbs_g
        total_fats += log.fats_g
        meal_breakdown[log.meal_type] = meal_breakdown.get(log.meal_type, 0.0) + log.calories

    return NutritionSummary(
        date=filter_date,
        total_calories=round(total_cal, 2),
        total_protein_g=round(total_prot, 2),
        total_carbs_g=round(total_carbs, 2),
        total_fats_g=round(total_fats, 2),
        meal_breakdown=meal_breakdown,
    )


@router.get("/search", response_model=List[Dict[str, Any]])
def search_food(
    q: str = Query(..., min_length=1, description="Search term"),
    _: User = Depends(get_current_user),
):
    """
    Search the built-in database of 50 common Indian foods.
    Returns items whose name contains the query string (case-insensitive).
    """
    query_lower = q.strip().lower()
    results = [food for food in INDIAN_FOODS if query_lower in food["name"].lower()]
    return results
