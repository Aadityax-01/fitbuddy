"""
AI service layer: wraps OpenAI chat completions for diet plans, workout plans,
and general fitness chat. Provides demo-data fallbacks when no API key is set.
"""

import json
import logging
import re
from typing import Any, Dict, List, Optional

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

CHAT_SYSTEM_PROMPT_TEMPLATE = """You are FitBuddy AI — an expert AI fitness coach and sports nutritionist.
Your mission is to give accurate, encouraging, and clear answers.

CRITICAL RULES FOR NUTRITION & FOOD QUESTIONS:
1. UNDERSTAND USER INTENT:
   - If the user asks for protein (e.g., "How much protein in 4 eggs?"), answer PROTEIN FIRST. Never replace the requested nutrient with calories or other macros!
   - If the user asks for calories (e.g., "How many calories in 2 bananas?"), answer CALORIES FIRST.
   - If the user asks for fat (e.g., "How much fat in 100g paneer?"), answer FAT FIRST.
   - If the user asks for carbs (e.g., "How many carbs in 2 rotis?"), answer CARBOHYDRATES FIRST.
   - If the user asks for both calories and protein, answer BOTH first.
   - Support English and Hinglish (e.g., "4 ande me kitna protein hota hai?").

2. STRICT 4-PART RESPONSE STRUCTURE:
   1. Direct answer stating the exact food quantity and requested nutrient.
   2. Amount per serving / food quantity.
   3. Other nutrition macros (calories, protein, carbs, fat) bulleted.
   4. Note that values are approximate and depend on portion size, cooking method, and brand.

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


# ─────────────────────────────────────────────────────────────────────────────
# Nutrition Intent & Accurate Calculation Engine
# ─────────────────────────────────────────────────────────────────────────────

NUTRITION_DATABASE = {
    "egg": {
        "names": ["egg", "eggs", "anda", "ande", "boiled egg", "boiled eggs", "egg white", "egg whites"],
        "unit": "egg",
        "portion_name": "large whole egg",
        "default_qty": 1,
        "per_unit": {"protein": 6.3, "calories": 72, "fat": 4.8, "carbs": 0.4},
        "notes": "Values depend on egg size (Medium ~6g vs Large ~6.5g) and cooking method. Egg whites alone contain ~3.6g protein and 17 kcal each."
    },
    "banana": {
        "names": ["banana", "bananas", "kela", "kele"],
        "unit": "banana",
        "portion_name": "medium banana",
        "default_qty": 1,
        "per_unit": {"protein": 1.3, "calories": 105, "fat": 0.3, "carbs": 27.0},
        "notes": "Values are approximate and vary slightly with fruit size (118g average) and ripeness."
    },
    "paneer": {
        "names": ["paneer", "panir", "cottage cheese"],
        "unit": "gram",
        "portion_name": "Indian raw paneer",
        "default_qty": 100,
        "per_100g": {"protein": 19.0, "calories": 275, "fat": 21.0, "carbs": 3.4},
        "notes": "Values depend on milk fat (cow vs buffalo milk). Low-fat paneer yields ~25g protein and only 140 kcal per 100g."
    },
    "almond": {
        "names": ["almond", "almonds", "badam", "badaam"],
        "unit": "gram",
        "portion_name": "whole raw almonds",
        "default_qty": 100,
        "per_100g": {"protein": 21.2, "calories": 579, "fat": 49.9, "carbs": 21.6},
        "notes": "Almonds are dense in healthy monounsaturated fats. A standard daily handful portion is ~28g (~14g fat, 160 kcal, 6g protein)."
    },
    "chicken": {
        "names": ["chicken breast", "chicken", "murga", "murgh", "boneless chicken"],
        "unit": "gram",
        "portion_name": "raw boneless skinless chicken breast",
        "default_qty": 100,
        "per_100g": {"protein": 23.0, "calories": 120, "fat": 2.6, "carbs": 0.0},
        "notes": "Based on raw boneless chicken breast. 100g cooked/grilled yields ~31g protein and 165 kcal due to water weight loss."
    },
    "roti": {
        "names": ["roti", "rotis", "chapati", "chapatis", "phulka", "fulka"],
        "unit": "roti",
        "portion_name": "medium whole wheat roti",
        "default_qty": 1,
        "per_unit": {"protein": 3.2, "calories": 85, "fat": 0.5, "carbs": 16.0},
        "notes": "Based on 35g dough whole wheat roti without oil. Adding 1 tsp ghee adds ~45 kcal and 5g fat."
    },
    "milk": {
        "names": ["milk", "doodh", "dudh", "cow milk", "toned milk"],
        "unit": "ml",
        "portion_name": "toned cow milk",
        "default_qty": 250,
        "per_100g": {"protein": 3.3, "calories": 61, "fat": 3.4, "carbs": 4.8},
        "notes": "250ml is a standard Indian glass. Standard toned milk yields ~8.2g protein and 150 kcal; buffalo milk yields ~9.5g protein and 240 kcal."
    },
    "rice": {
        "names": ["rice", "chawal", "white rice", "brown rice", "cooked rice"],
        "unit": "gram",
        "portion_name": "cooked white rice",
        "default_qty": 100,
        "per_100g": {"protein": 2.7, "calories": 130, "fat": 0.3, "carbs": 28.0},
        "notes": "Based on cooked rice (100g raw uncooked rice contains ~365 kcal and 7g protein, and expands to ~280g cooked)."
    },
    "dal": {
        "names": ["dal", "daal", "lentils", "moong dal", "chana dal", "toor dal", "masoor dal"],
        "unit": "bowl",
        "portion_name": "cooked dal (1 standard bowl / 150g)",
        "default_qty": 1,
        "per_unit": {"protein": 8.0, "calories": 150, "fat": 3.5, "carbs": 23.0},
        "notes": "Values depend on tadka oil/ghee and thickness of the dal."
    },
    "soya": {
        "names": ["soya chunks", "soy chunks", "soya", "soyabean"],
        "unit": "gram",
        "portion_name": "dry soya chunks",
        "default_qty": 100,
        "per_100g": {"protein": 52.0, "calories": 345, "fat": 0.5, "carbs": 33.0},
        "notes": "Dry soya chunks are over 50% protein by weight. Soaking expands them 3x in water."
    },
    "sattu": {
        "names": ["sattu", "chana sattu", "roasted gram flour"],
        "unit": "gram",
        "portion_name": "roasted chana sattu flour",
        "default_qty": 100,
        "per_100g": {"protein": 21.0, "calories": 385, "fat": 5.0, "carbs": 64.0},
        "notes": "Traditional Indian superfood rich in insoluble fiber and plant protein."
    },
    "curd": {
        "names": ["curd", "dahi", "yogurt", "greek yogurt"],
        "unit": "gram",
        "portion_name": "plain curd / dahi",
        "default_qty": 100,
        "per_100g": {"protein": 3.8, "calories": 62, "fat": 3.5, "carbs": 4.5},
        "notes": "1 standard katori/bowl is ~150g, providing approx 5.7g protein and 95 kcal."
    },
    "fish": {
        "names": ["fish", "machli", "salmon", "rohu", "tilapia"],
        "unit": "gram",
        "portion_name": "raw fish fillet",
        "default_qty": 100,
        "per_100g": {"protein": 20.0, "calories": 125, "fat": 4.5, "carbs": 0.0},
        "notes": "Rich in lean protein and omega-3 fatty acids."
    },
    "oats": {
        "names": ["oats", "oatmeal", "rolled oats"],
        "unit": "gram",
        "portion_name": "rolled oats",
        "default_qty": 50,
        "per_100g": {"protein": 13.5, "calories": 389, "fat": 6.9, "carbs": 66.0},
        "notes": "1 standard breakfast serving of 50g dry oats yields ~6.7g protein and 195 kcal."
    },
    "peanut_butter": {
        "names": ["peanut butter", "peanutbutter"],
        "unit": "tbsp",
        "portion_name": "peanut butter (2 tbsp / 32g)",
        "default_qty": 2,
        "per_unit": {"protein": 8.0, "calories": 190, "fat": 16.0, "carbs": 7.0},
        "notes": "Values for unsweetened peanut butter. Calorie-dense and rich in healthy fats."
    },
    "tofu": {
        "names": ["tofu", "soya paneer"],
        "unit": "gram",
        "portion_name": "firm tofu",
        "default_qty": 100,
        "per_100g": {"protein": 15.0, "calories": 83, "fat": 5.0, "carbs": 2.0},
        "notes": "Plant-based complete protein with lower saturated fat."
    }
}


def get_accurate_nutrition_response(query: str) -> Optional[str]:
    q = query.lower()
    has_protein = bool(re.search(r"protein|protien", q))
    has_calories = bool(re.search(r"calorie|calories|kcal|cal|energy|kitni calorie", q))
    has_fat = bool(re.search(r"fat|fats|charbi", q))
    has_carbs = bool(re.search(r"carb|carbs|carbohydrate|carbohydrates", q))

    if (has_protein and has_calories) or "protein and calories" in q or "calories and protein" in q or "protein aur calorie" in q:
        intent = "both_protein_calories"
    elif has_protein:
        intent = "protein"
    elif has_calories:
        intent = "calories"
    elif has_fat:
        intent = "fat"
    elif has_carbs:
        intent = "carbs"
    else:
        intent = "all_macros"

    matched_key = None
    matched_food = None
    sorted_keys = sorted(
        NUTRITION_DATABASE.keys(),
        key=lambda k: max(len(name) for name in NUTRITION_DATABASE[k]["names"]),
        reverse=True
    )

    for k in sorted_keys:
        food = NUTRITION_DATABASE[k]
        for name in food["names"]:
            if re.search(r"\b" + re.escape(name) + r"\b", q):
                matched_key = k
                matched_food = food
                break
        if matched_key:
            break

    if not matched_food:
        return None

    qty = float(matched_food["default_qty"])
    g_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams)\b", q)
    ml_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:ml|milliliter|milliliters)\b", q)
    count_match = re.search(r"\b(\d+)\s*(?:large|medium|small|whole|boiled)?\s*(?:egg|eggs|anda|ande|banana|bananas|kela|kele|roti|rotis|chapati|chapatis|phulka|fulka|piece|pieces|cup|cups|bowl|bowls|glass|glasses)\b", q)
    leading_match = re.search(r"^\s*(\d+)\b", q)

    if g_match:
        qty = float(g_match.group(1))
    elif ml_match:
        qty = float(ml_match.group(1))
    elif count_match:
        qty = float(count_match.group(1))
    elif leading_match:
        qty = float(leading_match.group(1))

    if "per_unit" in matched_food:
        p = round(matched_food["per_unit"]["protein"] * qty, 1)
        c = round(matched_food["per_unit"]["calories"] * qty)
        f = round(matched_food["per_unit"]["fat"] * qty, 1)
        cb = round(matched_food["per_unit"]["carbs"] * qty, 1)
    else:
        factor = qty / 100.0
        p = round(matched_food["per_100g"]["protein"] * factor, 1)
        c = round(matched_food["per_100g"]["calories"] * factor)
        f = round(matched_food["per_100g"]["fat"] * factor, 1)
        cb = round(matched_food["per_100g"]["carbs"] * factor, 1)

    is_plural = (qty != 1.0)
    verb = "contain" if is_plural else "contains"
    int_qty = int(qty) if qty.is_integer() else qty

    if matched_food["unit"] in ["egg", "banana", "roti"]:
        unit_label = f"{int_qty} {matched_food['portion_name']}s" if is_plural else f"1 {matched_food['portion_name']}"
    elif matched_food["unit"] == "gram":
        unit_label = f"{int_qty}g of {matched_food['portion_name']}"
    elif matched_food["unit"] == "ml":
        unit_label = f"{int_qty}ml of {matched_food['portion_name']}"
    else:
        unit_label = f"{int_qty} {matched_food['unit']}(s) of {matched_food['portion_name']}"

    if intent == "protein":
        lead = f"{unit_label} {verb} approximately **{p}g of protein**."
        breakdown = f"• **Protein:** **{p}g**\n• Calories: {c} kcal\n• Fat: {f}g\n• Carbohydrates: {cb}g"
    elif intent == "calories":
        lead = f"{unit_label} {verb} approximately **{c} kcal (calories)**."
        breakdown = f"• **Calories:** **{c} kcal**\n• Carbohydrates: {cb}g\n• Protein: {p}g\n• Fat: {f}g"
    elif intent == "fat":
        lead = f"{unit_label} {verb} approximately **{f}g of fat**."
        breakdown = f"• **Fat:** **{f}g**\n• Calories: {c} kcal\n• Protein: {p}g\n• Carbohydrates: {cb}g"
    elif intent == "carbs":
        lead = f"{unit_label} {verb} approximately **{cb}g of carbohydrates**."
        breakdown = f"• **Carbohydrates:** **{cb}g**\n• Calories: {c} kcal\n• Protein: {p}g\n• Fat: {f}g"
    elif intent == "both_protein_calories":
        lead = f"{unit_label} {verb} approximately **{c} kcal and {p}g of protein**."
        breakdown = f"• **Calories:** **{c} kcal**\n• **Protein:** **{p}g**\n• Carbohydrates: {cb}g\n• Fat: {f}g"
    else:
        lead = f"Here is the complete nutrition breakdown for {unit_label}:"
        breakdown = f"• Calories: {c} kcal\n• Protein: {p}g\n• Carbohydrates: {cb}g\n• Fat: {f}g"

    return f"{lead}\n\n{breakdown}\n\n💡 *Note:* {matched_food['notes']} Values are approximate and depend on exact portion size and preparation method."


def chat_response(messages: List[Dict[str, str]], system_prompt: str) -> str:
    """
    Get a conversational AI response.
    """
    # Extract the user's latest query
    latest_query = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            latest_query = msg.get("content", "")
            break

    # 1. First priority: Check exact nutrition calculation engine
    if latest_query:
        nutrition_res = get_accurate_nutrition_response(latest_query)
        if nutrition_res:
            return nutrition_res

    # 2. Check OpenAI API availability
    if not _has_api_key():
        # Fallback for general questions when OpenAI is not configured
        q = latest_query.lower()
        if "best time" in q and ("workout" in q or "work out" in q or "exercise" in q or "train" in q):
            return (
                "The best time to work out is whenever you can stay most consistent! Science shows:\n\n"
                "• Morning (6:00 AM – 9:00 AM): Great for building habit consistency and elevating daytime alertness. Include a thorough 8–10 minute dynamic warm-up.\n"
                "• Late Afternoon / Evening (4:00 PM – 7:00 PM): Peak neuromuscular performance and body temperature, allowing for heavier lifts and lower injury risk.\n\n"
                "Pick the window that fits your personal schedule and stick with it! ⏱️💪"
            )
        if "workout" in q or "exercise" in q or "training" in q:
            return (
                "Here is a great full-body foundational workout:\n\n"
                "• Squats: 3 sets x 12 reps\n"
                "• Push-Ups: 3 sets x 10-12 reps\n"
                "• Dumbbell / Inverted Rows: 3 sets x 10 reps\n"
                "• Plank: 3 sets x 45 seconds\n\n"
                "Remember to maintain progressive overload and keep 1-2 reps in reserve! 💪"
            )
        if "diet" in q or "meal" in q or "food" in q or "eat" in q:
            return (
                "A balanced Indian high-protein meal template:\n\n"
                "• 2 Multigrain Rotis\n"
                "• 1 Bowl Dal Tadka (Moong / Toor)\n"
                "• 100g Paneer Bhurji OR Grilled Chicken Breast\n"
                "• 1 Bowl fresh Cucumber Tomato Salad with lemon\n\n"
                "Provides ~480-520 kcal and 30g+ of bioavailable protein! 🥗"
            )
        return (
            "👋 Hi! I'm FitBuddy AI Coach. I can accurately calculate calories, protein, and macros for foods "
            "(e.g., 'How much protein in 4 eggs?', 'Calories in 2 bananas?'), design Indian diet plans, and suggest workout routines. "
            "How can I help you today? 💪"
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
        err_type = type(exc).__name__
        logger.error("OpenAI chat error [type=%s]: %s", err_type, exc)
        if "AuthenticationError" in err_type or "auth" in str(exc).lower():
            return "Warning: FitBuddy AI Coach is unavailable: OpenAI API key is invalid or expired. Please verify OPENAI_API_KEY in the server configuration."
        if "RateLimitError" in err_type or "quota" in str(exc).lower() or "429" in str(exc):
            return "Warning: FitBuddy AI Coach is unavailable: OpenAI rate limit or billing quota exceeded. Please check your OpenAI account usage and credits."
        if "Timeout" in err_type or "timeout" in str(exc).lower():
            return "FitBuddy AI request timed out. Please try sending your question again."
        if "Connection" in err_type or "connect" in str(exc).lower():
            return "FitBuddy AI could not reach OpenAI servers. Please verify backend internet connectivity."
        return "Sorry, I am having trouble connecting to the AI Coach service right now. Please try again in a moment!"
