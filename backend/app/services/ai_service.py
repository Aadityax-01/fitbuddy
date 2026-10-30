"""
AI service layer: wraps OpenAI chat completions for diet plans, workout plans,
and general fitness chat. Provides demo-data fallbacks when no API key is set.
"""

import json
import logging
from typing import Any, Dict, List

from app.config import settings

logger = logging.getLogger(__name__)

# ── OpenAI client (lazy-init) ─────────────────────────────────────────────────
_openai_client = None


def _get_client():
    global _openai_client
    if _openai_client is None:
        from openai import OpenAI  # imported lazily to avoid import error if package missing
        _openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _openai_client


def _has_api_key() -> bool:
    return bool(settings.OPENAI_API_KEY and not settings.OPENAI_API_KEY.startswith("sk-your"))


# ─────────────────────────────────────────────────────────────────────────────
# System Prompts
# ─────────────────────────────────────────────────────────────────────────────

DIET_SYSTEM_PROMPT = """You are FitBuddy AI — an expert Indian nutritionist and dietitian.
Generate meal plans focused on Indian cuisine (roti, dal, sabzi, rice, idli, dosa, etc.).
Always respond with valid JSON only — no prose, no markdown fences.
Structure:
{
  "calories_target": <number>,
  "meals": {
    "breakfast": {"items": [{"name": str, "quantity": str, "calories": int, "protein_g": float, "carbs_g": float, "fats_g": float}], "total_calories": int},
    "lunch":     {"items": [...], "total_calories": int},
    "snack":     {"items": [...], "total_calories": int},
    "dinner":    {"items": [...], "total_calories": int}
  },
  "hydration_tip": str,
  "notes": str
}
"""

WORKOUT_SYSTEM_PROMPT = """You are FitBuddy AI — an expert personal trainer.
Generate safe, structured workout plans appropriate for the user's level and equipment.
Always respond with valid JSON only — no prose, no markdown fences.
Structure:
{
  "workout_name": str,
  "duration_mins": int,
  "level": str,
  "warm_up": [{"exercise": str, "duration_secs": int, "instructions": str}],
  "exercises": [{"name": str, "sets": int, "reps": str, "rest_secs": int, "muscle_group": str, "instructions": str}],
  "cool_down": [{"exercise": str, "duration_secs": int, "instructions": str}],
  "tips": str
}
"""

CHAT_SYSTEM_PROMPT_TEMPLATE = """You are FitBuddy AI — a friendly, knowledgeable fitness coach and nutritionist.
You help users with diet, workouts, motivation, and general health questions.
Keep responses concise, practical, and encouraging.
User profile: {profile}
"""


# ─────────────────────────────────────────────────────────────────────────────
# Fallback Demo Data
# ─────────────────────────────────────────────────────────────────────────────

_DEMO_DIET_PLAN: Dict[str, Any] = {
    "calories_target": 2000,
    "meals": {
        "breakfast": {
            "items": [
                {"name": "Oats Upma", "quantity": "1 bowl (200g)", "calories": 210, "protein_g": 7.0, "carbs_g": 35.0, "fats_g": 4.0},
                {"name": "Boiled Egg", "quantity": "2 eggs", "calories": 140, "protein_g": 12.0, "carbs_g": 1.0, "fats_g": 9.0},
                {"name": "Masala Chai (less sugar)", "quantity": "1 cup", "calories": 50, "protein_g": 1.5, "carbs_g": 6.0, "fats_g": 2.0},
            ],
            "total_calories": 400,
        },
        "lunch": {
            "items": [
                {"name": "Brown Rice", "quantity": "1 cup cooked", "calories": 216, "protein_g": 5.0, "carbs_g": 45.0, "fats_g": 1.8},
                {"name": "Dal Tadka", "quantity": "1 katori (150ml)", "calories": 150, "protein_g": 9.0, "carbs_g": 20.0, "fats_g": 4.0},
                {"name": "Palak Sabzi", "quantity": "1 katori", "calories": 90, "protein_g": 4.0, "carbs_g": 8.0, "fats_g": 4.0},
                {"name": "Curd", "quantity": "1 katori (100g)", "calories": 60, "protein_g": 3.5, "carbs_g": 5.0, "fats_g": 2.0},
                {"name": "Salad", "quantity": "1 plate", "calories": 40, "protein_g": 1.5, "carbs_g": 8.0, "fats_g": 0.3},
            ],
            "total_calories": 556,
        },
        "snack": {
            "items": [
                {"name": "Mixed Nuts", "quantity": "30g", "calories": 180, "protein_g": 5.0, "carbs_g": 6.0, "fats_g": 15.0},
                {"name": "Banana", "quantity": "1 medium", "calories": 90, "protein_g": 1.1, "carbs_g": 23.0, "fats_g": 0.3},
            ],
            "total_calories": 270,
        },
        "dinner": {
            "items": [
                {"name": "Multigrain Roti", "quantity": "2 rotis", "calories": 200, "protein_g": 6.0, "carbs_g": 36.0, "fats_g": 3.0},
                {"name": "Chicken Curry (light)", "quantity": "1 katori (150g)", "calories": 230, "protein_g": 25.0, "carbs_g": 8.0, "fats_g": 10.0},
                {"name": "Vegetable Soup", "quantity": "1 bowl", "calories": 80, "protein_g": 3.0, "carbs_g": 12.0, "fats_g": 2.0},
            ],
            "total_calories": 510,
        },
    },
    "hydration_tip": "Drink at least 8-10 glasses (2.5 litres) of water throughout the day.",
    "notes": "This is a demo diet plan. Add your OpenAI API key to generate personalised plans.",
}

_DEMO_WORKOUT_PLAN: Dict[str, Any] = {
    "workout_name": "Full Body Beginner Routine",
    "duration_mins": 45,
    "level": "beginner",
    "warm_up": [
        {"exercise": "Jumping Jacks", "duration_secs": 60, "instructions": "Keep arms straight, jump lightly."},
        {"exercise": "Arm Circles", "duration_secs": 30, "instructions": "Forward and backward, 15 reps each."},
        {"exercise": "Leg Swings", "duration_secs": 30, "instructions": "Hold a wall for balance, swing each leg 10 times."},
    ],
    "exercises": [
        {"name": "Bodyweight Squats", "sets": 3, "reps": "12-15", "rest_secs": 60, "muscle_group": "Legs / Glutes", "instructions": "Keep chest up, knees over toes."},
        {"name": "Push-ups (Knee or Full)", "sets": 3, "reps": "8-12", "rest_secs": 60, "muscle_group": "Chest / Triceps", "instructions": "Lower chest to floor, keep core tight."},
        {"name": "Dumbbell Rows", "sets": 3, "reps": "10 each side", "rest_secs": 60, "muscle_group": "Back / Biceps", "instructions": "Flat back, pull elbow to hip."},
        {"name": "Plank Hold", "sets": 3, "reps": "30-45 secs", "rest_secs": 45, "muscle_group": "Core", "instructions": "Neutral spine, breathe steadily."},
        {"name": "Glute Bridges", "sets": 3, "reps": "15", "rest_secs": 45, "muscle_group": "Glutes / Hamstrings", "instructions": "Drive hips up, squeeze at the top."},
    ],
    "cool_down": [
        {"exercise": "Child's Pose", "duration_secs": 60, "instructions": "Arms stretched, breathe deeply."},
        {"exercise": "Standing Quad Stretch", "duration_secs": 30, "instructions": "Hold each leg for 30 seconds."},
        {"exercise": "Seated Hamstring Stretch", "duration_secs": 30, "instructions": "Reach toward toes, hold gently."},
    ],
    "tips": "This is a demo workout. Add your OpenAI API key to generate personalised plans.",
}


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────

def generate_diet_plan(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a personalised AI diet plan.

    Args:
        user_profile: Keys from UserProfile (age, weight_kg, height_cm, fitness_goal, diet_type, …).
        preferences: Additional request data (cuisine, calories_target, allergies, budget, goal).

    Returns:
        Parsed dict matching the plan structure defined in DIET_SYSTEM_PROMPT.
    """
    if not _has_api_key():
        logger.warning("No OpenAI API key set — returning demo diet plan.")
        demo = dict(_DEMO_DIET_PLAN)
        demo["calories_target"] = preferences.get("calories_target", demo["calories_target"])
        return demo

    user_prompt = (
        f"Generate a one-day Indian diet plan for the following user:\n"
        f"Age: {user_profile.get('age', 'unknown')}, "
        f"Gender: {user_profile.get('gender', 'unknown')}, "
        f"Weight: {user_profile.get('weight_kg', 'unknown')} kg, "
        f"Height: {user_profile.get('height_cm', 'unknown')} cm, "
        f"Activity level: {user_profile.get('activity_level', 'moderate')}, "
        f"Goal: {preferences.get('goal', user_profile.get('fitness_goal', 'maintain'))}, "
        f"Diet type: {preferences.get('diet_type', user_profile.get('diet_type', 'non_vegetarian'))}, "
        f"Cuisine: {preferences.get('cuisine', 'Indian')}, "
        f"Calories target: {preferences.get('calories_target', 2000)} kcal, "
        f"Allergies: {preferences.get('allergies', 'none')}, "
        f"Budget: {preferences.get('budget', 'medium')}."
    )

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": DIET_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=2000,
        )
        raw = response.choices[0].message.content.strip()
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse diet plan JSON: %s", exc)
        return _DEMO_DIET_PLAN
    except Exception as exc:
        logger.error("OpenAI diet plan error: %s", exc)
        return _DEMO_DIET_PLAN


def generate_workout_plan(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a personalised AI workout plan.

    Args:
        user_profile: Keys from UserProfile.
        preferences: level, type (home/gym), equipment, duration_mins, goal.

    Returns:
        Parsed dict matching the plan structure defined in WORKOUT_SYSTEM_PROMPT.
    """
    if not _has_api_key():
        logger.warning("No OpenAI API key set — returning demo workout plan.")
        demo = dict(_DEMO_WORKOUT_PLAN)
        demo["level"] = preferences.get("level", demo["level"])
        demo["duration_mins"] = preferences.get("duration_mins", demo["duration_mins"])
        return demo

    user_prompt = (
        f"Generate a workout plan for the following user:\n"
        f"Age: {user_profile.get('age', 'unknown')}, "
        f"Gender: {user_profile.get('gender', 'unknown')}, "
        f"Fitness level: {preferences.get('level', 'beginner')}, "
        f"Workout type: {preferences.get('type', 'home')}, "
        f"Available equipment: {preferences.get('equipment', user_profile.get('available_equipment', 'none'))}, "
        f"Duration: {preferences.get('duration_mins', 45)} minutes, "
        f"Goal: {preferences.get('goal', user_profile.get('fitness_goal', 'maintain'))}."
    )

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": WORKOUT_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=2000,
        )
        raw = response.choices[0].message.content.strip()
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse workout plan JSON: %s", exc)
        return _DEMO_WORKOUT_PLAN
    except Exception as exc:
        logger.error("OpenAI workout plan error: %s", exc)
        return _DEMO_WORKOUT_PLAN


def chat_response(messages: List[Dict[str, str]], system_prompt: str) -> str:
    """
    Get a conversational AI response.

    Args:
        messages: List of {role, content} dicts (full conversation history).
        system_prompt: System instruction (should include user profile).

    Returns:
        Assistant reply string.
    """
    if not _has_api_key():
        return (
            "👋 Hi! I'm FitBuddy AI. I'm running in demo mode right now (no API key configured). "
            "Add your OpenAI API key to get personalised fitness coaching!"
        )

    try:
        client = _get_client()
        full_messages = [{"role": "system", "content": system_prompt}] + messages
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=full_messages,
            temperature=0.8,
            max_tokens=800,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.error("OpenAI chat error: %s", exc)
        return "Sorry, I'm having trouble connecting right now. Please try again in a moment! 💪"
