import re

FOOD_DATABASE = {
    "egg": {
        "names": ["egg", "eggs", "anda", "ande", "boiled egg", "boiled eggs"],
        "unit": "egg",
        "default_qty": 1,
        "portion_name": "whole egg",
        "per_unit": {"protein": 6.3, "calories": 72, "fat": 4.8, "carbs": 0.4},
        "notes": "Values depend on egg size (Medium vs Large) and cooking method (boiled vs cooked in butter/oil). Egg whites alone contain ~3.6g protein and 17 kcal each."
    },
    "banana": {
        "names": ["banana", "bananas", "kela", "kele"],
        "unit": "banana",
        "default_qty": 1,
        "portion_name": "medium banana",
        "per_unit": {"protein": 1.3, "calories": 105, "fat": 0.3, "carbs": 27.0},
        "notes": "Values are approximate and vary slightly with fruit size and ripeness."
    },
    "paneer": {
        "names": ["paneer", "panir", "cottage cheese"],
        "unit": "gram",
        "default_qty": 100,
        "portion_name": "paneer",
        "per_100g": {"protein": 19.0, "calories": 275, "fat": 21.0, "carbs": 3.4},
        "notes": "Values depend on milk fat (cow vs buffalo milk). Low-fat paneer yields ~25g protein and only 140 kcal per 100g."
    },
    "almond": {
        "names": ["almond", "almonds", "badam", "badaam"],
        "unit": "gram",
        "default_qty": 100,
        "portion_name": "almonds",
        "per_100g": {"protein": 21.2, "calories": 579, "fat": 49.9, "carbs": 21.6},
        "notes": "Almonds are dense in healthy monounsaturated fats. A standard daily handful portion is ~28g (~14g fat, 160 kcal, 6g protein)."
    },
    "chicken": {
        "names": ["chicken", "chicken breast", "murga", "murgh"],
        "unit": "gram",
        "default_qty": 100,
        "portion_name": "raw boneless skinless chicken breast",
        "per_100g": {"protein": 23.0, "calories": 120, "fat": 2.6, "carbs": 0.0},
        "notes": "Based on raw boneless chicken breast. 100g cooked/grilled yields ~31g protein and 165 kcal due to water weight loss."
    },
    "roti": {
        "names": ["roti", "rotis", "chapati", "chapatis", "phulka", "fulka"],
        "unit": "roti",
        "default_qty": 1,
        "portion_name": "medium whole wheat roti",
        "per_unit": {"protein": 3.2, "calories": 85, "fat": 0.5, "carbs": 16.0},
        "notes": "Based on 35g dough whole wheat roti without oil. Adding 1 tsp ghee adds ~45 kcal and 5g fat."
    },
    "milk": {
        "names": ["milk", "doodh", "dudh", "cow milk"],
        "unit": "ml",
        "default_qty": 250,
        "portion_name": "cow / toned milk",
        "per_100g": {"protein": 3.3, "calories": 61, "fat": 3.4, "carbs": 4.8},
        "notes": "250ml is a standard Indian glass. Toned cow milk has ~8g protein and 125 kcal, while buffalo milk has ~9g protein and 230 kcal."
    },
    "rice": {
        "names": ["rice", "chawal", "white rice", "brown rice"],
        "unit": "gram",
        "default_qty": 100,
        "portion_name": "cooked white rice",
        "per_100g": {"protein": 2.7, "calories": 130, "fat": 0.3, "carbs": 28.0},
        "notes": "Based on cooked rice (100g raw uncooked rice contains ~365 kcal and 7g protein, and expands to ~280g cooked)."
    },
    "dal": {
        "names": ["dal", "daal", "lentils", "moong dal", "chana dal", "toor dal"],
        "unit": "bowl",
        "default_qty": 1,
        "portion_name": "cooked dal (1 standard bowl / 150g)",
        "per_unit": {"protein": 8.0, "calories": 150, "fat": 3.5, "carbs": 23.0},
        "notes": "Values depend on tadka oil/ghee and thickness of the dal."
    },
    "soya": {
        "names": ["soya", "soya chunks", "soy chunks", "soyabean"],
        "unit": "gram",
        "default_qty": 100,
        "portion_name": "dry soya chunks",
        "per_100g": {"protein": 52.0, "calories": 345, "fat": 0.5, "carbs": 33.0},
        "notes": "Dry soya chunks are over 50% protein by weight. Soaking expands them 3x in water."
    },
    "sattu": {
        "names": ["sattu", "chana sattu"],
        "unit": "gram",
        "default_qty": 100,
        "portion_name": "roasted chana sattu flour",
        "per_100g": {"protein": 21.0, "calories": 385, "fat": 5.0, "carbs": 64.0},
        "notes": "Traditional Indian superfood rich in insoluble fiber and plant protein."
    },
    "curd": {
        "names": ["curd", "dahi", "yogurt"],
        "unit": "gram",
        "default_qty": 100,
        "portion_name": "plain curd / dahi",
        "per_100g": {"protein": 3.8, "calories": 62, "fat": 3.5, "carbs": 4.5},
        "notes": "1 standard katori/bowl is ~150g, providing approx 5.7g protein and 95 kcal."
    },
    "fish": {
        "names": ["fish", "machli", "salmon", "rohu", "tilapia"],
        "unit": "gram",
        "default_qty": 100,
        "portion_name": "raw fish fillet",
        "per_100g": {"protein": 20.0, "calories": 125, "fat": 4.5, "carbs": 0.0},
        "notes": "Rich in lean protein and omega-3 fatty acids."
    },
    "oats": {
        "names": ["oats", "oatmeal"],
        "unit": "gram",
        "default_qty": 50,
        "portion_name": "rolled oats",
        "per_100g": {"protein": 13.5, "calories": 389, "fat": 6.9, "carbs": 66.0},
        "notes": "1 standard breakfast serving of 50g dry oats yields ~6.7g protein and 195 kcal."
    },
    "peanut_butter": {
        "names": ["peanut butter", "peanutbutter"],
        "unit": "tbsp",
        "default_qty": 2,
        "portion_name": "peanut butter (2 tbsp / 32g)",
        "per_unit": {"protein": 8.0, "calories": 190, "fat": 16.0, "carbs": 7.0},
        "notes": "Values for unsweetened peanut butter. Calorie-dense and rich in healthy fats."
    }
}

def detect_intent(query_lower):
    # Detect both protein and calories
    has_protein = any(w in query_lower for w in ["protein", "protien"])
    has_calories = any(w in query_lower for w in ["calorie", "calories", "kcal", "cal", "energy"])
    has_fat = any(w in query_lower for w in ["fat", "fats", "charbi"])
    has_carbs = any(w in query_lower for w in ["carb", "carbs", "carbohydrate", "carbohydrates"])
    
    if (has_protein and has_calories) or "protein and calories" in query_lower or "calories and protein" in query_lower:
        return "both_protein_calories"
    if has_protein:
        return "protein"
    if has_calories:
        return "calories"
    if has_fat:
        return "fat"
    if has_carbs:
        return "carbs"
    return "all_macros"

def extract_food_and_quantity(query_lower):
    # Extract quantity (e.g., 4, 100g, 200g, 250ml, 2, etc.)
    matched_food = None
    food_key = None
    
    # Priority match for specific multi-word foods first
    sorted_foods = sorted(FOOD_DATABASE.items(), key=lambda x: max(len(n) for n in x[1]["names"]), reverse=True)
    for key, data in sorted_foods:
        for name in data["names"]:
            if re.search(r'\b' + re.escape(name) + r'\b', query_lower):
                food_key = key
                matched_food = data
                break
        if food_key:
            break
            
    if not matched_food:
        return None, None, None

    # Quantity parsing
    qty = matched_food["default_qty"]
    unit = matched_food["unit"]

    # Look for gram pattern: e.g. "100g", "100 gram", "100 grams", "200 gm"
    g_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams)\b', query_lower)
    # Look for ml pattern: e.g. "250ml", "250 ml", "500ml"
    ml_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:ml|milliliter|milliliters)\b', query_lower)
    # Look for count pattern before or after food name: e.g. "4 eggs", "2 bananas", "2 rotis", "4 ande"
    count_match = re.search(r'\b(\d+)\s*(?:large|medium|small|whole|boiled)?\s*(?:egg|eggs|anda|ande|banana|bananas|kela|kele|roti|rotis|chapati|chapatis|phulka|fulka|piece|pieces|cup|cups|bowl|bowls|glass|glasses)\b', query_lower)
    if not count_match:
        # Check standalone number right before food name
        count_match = re.search(r'\b(\d+)\s+' + re.escape(matched_food["names"][0]), query_lower)
    if not count_match:
        # Check general leading number: e.g. "4 ande"
        count_match = re.search(r'^\s*(\d+)\b', query_lower)

    if g_match:
        qty = float(g_match.group(1))
        unit = "gram"
    elif ml_match:
        qty = float(ml_match.group(1))
        unit = "ml"
    elif count_match:
        qty = float(count_match.group(1))
        unit = matched_food["unit"]

    return food_key, matched_food, qty

def calculate_macros(food_data, qty):
    if "per_unit" in food_data:
        factor = qty
        p = round(food_data["per_unit"]["protein"] * factor, 1)
        c = round(food_data["per_unit"]["calories"] * factor)
        f = round(food_data["per_unit"]["fat"] * factor, 1)
        cb = round(food_data["per_unit"]["carbs"] * factor, 1)
    else:
        # per 100g or 100ml
        factor = qty / 100.0
        p = round(food_data["per_100g"]["protein"] * factor, 1)
        c = round(food_data["per_100g"]["calories"] * factor)
        f = round(food_data["per_100g"]["fat"] * factor, 1)
        cb = round(food_data["per_100g"]["carbs"] * factor, 1)

    return {"protein": p, "calories": c, "fat": f, "carbs": cb}

def format_nutrition_response(query):
    q_lower = query.lower()
    intent = detect_intent(q_lower)
    food_key, food_data, qty = extract_food_and_quantity(q_lower)
    
    if not food_data:
        return None

    macros = calculate_macros(food_data, qty)
    p, c, f, cb = macros["protein"], macros["calories"], macros["fat"], macros["carbs"]

    # Format food quantity label
    if food_data["unit"] in ["egg", "banana", "roti"]:
        int_qty = int(qty) if qty.is_integer() else qty
        unit_label = f"{int_qty} {food_data['portion_name'] if int_qty == 1 else food_data['portion_name'] + 's'}"
    elif food_data["unit"] == "gram":
        int_qty = int(qty) if qty.is_integer() else qty
        unit_label = f"{int_qty}g of {food_data['portion_name']}"
    elif food_data["unit"] == "ml":
        int_qty = int(qty) if qty.is_integer() else qty
        unit_label = f"{int_qty}ml of {food_data['portion_name']}"
    else:
        int_qty = int(qty) if qty.is_integer() else qty
        unit_label = f"{int_qty} {food_data['unit']}(s) of {food_data['portion_name']}"

    # Construct the primary direct answer sentence based on requested intent:
    if intent == "protein":
        lead_sentence = f"{unit_label} contains approximately **{p}g of protein**."
        breakdown = (
            f"• **Protein:** **{p}g**\n"
            f"• Calories: {c} kcal\n"
            f"• Fat: {f}g\n"
            f"• Carbohydrates: {cb}g"
        )
    elif intent == "calories":
        lead_sentence = f"{unit_label} contains approximately **{c} kcal (calories)**."
        breakdown = (
            f"• **Calories:** **{c} kcal**\n"
            f"• Carbohydrates: {cb}g\n"
            f"• Protein: {p}g\n"
            f"• Fat: {f}g"
        )
    elif intent == "fat":
        lead_sentence = f"{unit_label} contains approximately **{f}g of fat**."
        breakdown = (
            f"• **Fat:** **{f}g**\n"
            f"• Calories: {c} kcal\n"
            f"• Protein: {p}g\n"
            f"• Carbohydrates: {cb}g"
        )
    elif intent == "carbs":
        lead_sentence = f"{unit_label} contains approximately **{cb}g of carbohydrates**."
        breakdown = (
            f"• **Carbohydrates:** **{cb}g**\n"
            f"• Calories: {c} kcal\n"
            f"• Protein: {p}g\n"
            f"• Fat: {f}g"
        )
    elif intent == "both_protein_calories":
        lead_sentence = f"{unit_label} contains approximately **{c} kcal and {p}g of protein**."
        breakdown = (
            f"• **Calories:** **{c} kcal**\n"
            f"• **Protein:** **{p}g**\n"
            f"• Carbohydrates: {cb}g\n"
            f"• Fat: {f}g"
        )
    else:
        lead_sentence = f"Here is the complete nutrition breakdown for {unit_label}:"
        breakdown = (
            f"• Calories: {c} kcal\n"
            f"• Protein: {p}g\n"
            f"• Carbohydrates: {cb}g\n"
            f"• Fat: {f}g"
        )

    response = f"{lead_sentence}\n\n{breakdown}\n\n💡 *Note:* {food_data['notes']} Values are approximate and depend on exact portion size and preparation method."
    return response

test_questions = [
    "How much protein in 4 eggs?",
    "How many calories in 2 bananas?",
    "Protein in 100g paneer?",
    "How much fat in 100g almonds?",
    "Protein in 200g chicken breast?",
    "Calories in 2 rotis?",
    "Protein in 250ml milk?",
    "How much protein and calories in 100g rice?",
    "4 ande me kitna protein hota hai?",
    "100 gram paneer me kitni calories hain?"
]

for i, q in enumerate(test_questions, 1):
    print(f"[{i}] Question: {q}")
    ans = format_nutrition_response(q)
    print(ans)
    print("-" * 50)
