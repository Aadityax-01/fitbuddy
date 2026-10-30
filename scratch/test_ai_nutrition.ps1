$FOOD_DATABASE = @{
    "egg" = @{
        names = @("egg", "eggs", "anda", "ande", "boiled egg", "boiled eggs", "egg white", "egg whites");
        unit = "egg";
        portion_name = "large whole egg";
        default_qty = 1;
        per_unit = @{ protein = 6.3; calories = 72; fat = 4.8; carbs = 0.4 };
        notes = "Values depend on egg size (Medium ~6g vs Large ~6.5g) and cooking method. Egg whites alone contain ~3.6g protein and 17 kcal each."
    };
    "banana" = @{
        names = @("banana", "bananas", "kela", "kele");
        unit = "banana";
        portion_name = "medium banana";
        default_qty = 1;
        per_unit = @{ protein = 1.3; calories = 105; fat = 0.3; carbs = 27.0 };
        notes = "Values are approximate and vary slightly with fruit size and ripeness."
    };
    "paneer" = @{
        names = @("paneer", "panir", "cottage cheese");
        unit = "gram";
        portion_name = "Indian raw paneer";
        default_qty = 100;
        per_100g = @{ protein = 19.0; calories = 275; fat = 21.0; carbs = 3.4 };
        notes = "Values depend on milk fat (cow vs buffalo milk). Low-fat paneer yields ~25g protein and only 140 kcal per 100g."
    };
    "almond" = @{
        names = @("almond", "almonds", "badam", "badaam");
        unit = "gram";
        portion_name = "whole raw almonds";
        default_qty = 100;
        per_100g = @{ protein = 21.2; calories = 579; fat = 49.9; carbs = 21.6 };
        notes = "Almonds are dense in healthy monounsaturated fats. A standard daily handful portion is ~28g (~14g fat, 160 kcal, 6g protein)."
    };
    "chicken" = @{
        names = @("chicken breast", "chicken", "murga", "murgh", "boneless chicken");
        unit = "gram";
        portion_name = "raw boneless skinless chicken breast";
        default_qty = 100;
        per_100g = @{ protein = 23.0; calories = 120; fat = 2.6; carbs = 0.0 };
        notes = "Based on raw boneless chicken breast. 100g cooked/grilled yields ~31g protein and 165 kcal due to water weight loss."
    };
    "roti" = @{
        names = @("roti", "rotis", "chapati", "chapatis", "phulka", "fulka");
        unit = "roti";
        portion_name = "medium whole wheat roti";
        default_qty = 1;
        per_unit = @{ protein = 3.2; calories = 85; fat = 0.5; carbs = 16.0 };
        notes = "Based on 35g dough whole wheat roti without oil. Adding 1 tsp ghee adds ~45 kcal and 5g fat."
    };
    "milk" = @{
        names = @("milk", "doodh", "dudh", "cow milk", "toned milk");
        unit = "ml";
        portion_name = "toned cow milk";
        default_qty = 250;
        per_100g = @{ protein = 3.3; calories = 61; fat = 3.4; carbs = 4.8 };
        notes = "250ml is a standard Indian glass. Standard toned milk yields ~8.2g protein and 150 kcal; buffalo milk yields ~9.5g protein and 240 kcal."
    };
    "rice" = @{
        names = @("rice", "chawal", "white rice", "brown rice", "cooked rice");
        unit = "gram";
        portion_name = "cooked white rice";
        default_qty = 100;
        per_100g = @{ protein = 2.7; calories = 130; fat = 0.3; carbs = 28.0 };
        notes = "Based on cooked rice (100g raw uncooked rice contains ~365 kcal and 7g protein, and expands to ~280g cooked)."
    };
    "dal" = @{
        names = @("dal", "daal", "lentils", "moong dal", "chana dal", "toor dal");
        unit = "bowl";
        portion_name = "cooked dal (1 standard bowl / 150g)";
        default_qty = 1;
        per_unit = @{ protein = 8.0; calories = 150; fat = 3.5; carbs = 23.0 };
        notes = "Values depend on tadka oil/ghee and thickness of the dal."
    };
    "soya" = @{
        names = @("soya chunks", "soy chunks", "soya", "soyabean");
        unit = "gram";
        portion_name = "dry soya chunks";
        default_qty = 100;
        per_100g = @{ protein = 52.0; calories = 345; fat = 0.5; carbs = 33.0 };
        notes = "Dry soya chunks are over 50% protein by weight. Soaking expands them 3x in water."
    };
    "sattu" = @{
        names = @("sattu", "chana sattu");
        unit = "gram";
        portion_name = "roasted chana sattu flour";
        default_qty = 100;
        per_100g = @{ protein = 21.0; calories = 385; fat = 5.0; carbs = 64.0 };
        notes = "Traditional Indian superfood rich in insoluble fiber and plant protein."
    };
    "curd" = @{
        names = @("curd", "dahi", "yogurt");
        unit = "gram";
        portion_name = "plain curd / dahi";
        default_qty = 100;
        per_100g = @{ protein = 3.8; calories = 62; fat = 3.5; carbs = 4.5 };
        notes = "1 standard katori/bowl is ~150g, providing approx 5.7g protein and 95 kcal."
    };
    "fish" = @{
        names = @("fish", "machli", "salmon", "rohu", "tilapia");
        unit = "gram";
        portion_name = "raw fish fillet";
        default_qty = 100;
        per_100g = @{ protein = 20.0; calories = 125; fat = 4.5; carbs = 0.0 };
        notes = "Rich in lean protein and omega-3 fatty acids."
    };
    "oats" = @{
        names = @("oats", "oatmeal");
        unit = "gram";
        portion_name = "rolled oats";
        default_qty = 50;
        per_100g = @{ protein = 13.5; calories = 389; fat = 6.9; carbs = 66.0 };
        notes = "1 standard breakfast serving of 50g dry oats yields ~6.7g protein and 195 kcal."
    };
    "peanut_butter" = @{
        names = @("peanut butter", "peanutbutter");
        unit = "tbsp";
        portion_name = "peanut butter (2 tbsp / 32g)";
        default_qty = 2;
        per_unit = @{ protein = 8.0; calories = 190; fat = 16.0; carbs = 7.0 };
        notes = "Values for unsweetened peanut butter. Calorie-dense and rich in healthy fats."
    }
}

function Detect-Intent($q) {
    $hasProtein = ($q -match "protein|protien")
    $hasCalories = ($q -match "calorie|calories|kcal|cal|energy|kitni calorie")
    $hasFat = ($q -match "fat|fats|charbi")
    $hasCarbs = ($q -match "carb|carbs|carbohydrate|carbohydrates")

    if (($hasProtein -and $hasCalories) -or ($q -match "protein and calories|calories and protein|protein aur calorie")) {
        return "both_protein_calories"
    }
    if ($hasProtein) { return "protein" }
    if ($hasCalories) { return "calories" }
    if ($hasFat) { return "fat" }
    if ($hasCarbs) { return "carbs" }
    return "all_macros"
}

function Extract-Food-And-Qty($q) {
    $matchedKey = $null
    $matchedData = $null

    # Sort food keys by longest match name
    $keys = $FOOD_DATABASE.Keys | Sort-Object { 
        $maxLen = 0
        foreach ($n in $FOOD_DATABASE[$_].names) { if ($n.Length -gt $maxLen) { $maxLen = $n.Length } }
        $maxLen 
    } -Descending

    foreach ($k in $keys) {
        $entry = $FOOD_DATABASE[$k]
        foreach ($name in $entry.names) {
            if ($q -match "\b$([regex]::Escape($name))\b") {
                $matchedKey = $k
                $matchedData = $entry
                break
            }
        }
        if ($matchedKey) { break }
    }

    if (-not $matchedKey) { return $null }

    $qty = $matchedData.default_qty
    $unit = $matchedData.unit

    if ($q -match "(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams)\b") {
        $qty = [double]$matches[1]
        $unit = "gram"
    }
    elseif ($q -match "(\d+(?:\.\d+)?)\s*(?:ml|milliliter|milliliters)\b") {
        $qty = [double]$matches[1]
        $unit = "ml"
    }
    elseif ($q -match "\b(\d+)\s*(?:large|medium|small|whole|boiled)?\s*(?:egg|eggs|anda|ande|banana|bananas|kela|kele|roti|rotis|chapati|chapatis|phulka|fulka|piece|pieces|cup|cups|bowl|bowls|glass|glasses)\b") {
        $qty = [double]$matches[1]
        $unit = $matchedData.unit
    }
    elseif ($q -match "^\s*(\d+)\b") {
        $qty = [double]$matches[1]
        $unit = $matchedData.unit
    }

    return @{ Key = $matchedKey; Data = $matchedData; Qty = $qty; Unit = $unit }
}

function Format-NutritionResponse($query) {
    $q = $query.ToLower()
    $intent = Detect-Intent $q
    $match = Extract-Food-And-Qty $q
    if (-not $match) { return "No food match for: $query" }

    $data = $match.Data
    $qty = $match.Qty

    if ($data.ContainsKey("per_unit")) {
        $factor = $qty
        $p = [math]::Round($data.per_unit.protein * $factor, 1)
        $c = [math]::Round($data.per_unit.calories * $factor)
        $f = [math]::Round($data.per_unit.fat * $factor, 1)
        $cb = [math]::Round($data.per_unit.carbs * $factor, 1)
    } else {
        $factor = $qty / 100.0
        $p = [math]::Round($data.per_100g.protein * $factor, 1)
        $c = [math]::Round($data.per_100g.calories * $factor)
        $f = [math]::Round($data.per_100g.fat * $factor, 1)
        $cb = [math]::Round($data.per_100g.carbs * $factor, 1)
    }

    if ($data.unit -in @("egg", "banana", "roti")) {
        $unitLabel = if ($qty -eq 1) { "1 $($data.portion_name)" } else { "$qty $($data.portion_name)s" }
    } elseif ($data.unit -eq "gram") {
        $unitLabel = "${qty}g of $($data.portion_name)"
    } elseif ($data.unit -eq "ml") {
        $unitLabel = "${qty}ml of $($data.portion_name)"
    } else {
        $unitLabel = "$qty $($data.unit)(s) of $($data.portion_name)"
    }

    $lead = ""
    $breakdown = ""
    if ($intent -eq "protein") {
        $lead = "$unitLabel contains approximately **${p}g of protein**."
        $breakdown = "• **Protein:** **${p}g**`n• Calories: ${c} kcal`n• Fat: ${f}g`n• Carbohydrates: ${cb}g"
    } elseif ($intent -eq "calories") {
        $lead = "$unitLabel contains approximately **${c} kcal (calories)**."
        $breakdown = "• **Calories:** **${c} kcal**`n• Carbohydrates: ${cb}g`n• Protein: ${p}g`n• Fat: ${f}g"
    } elseif ($intent -eq "fat") {
        $lead = "$unitLabel contains approximately **${f}g of fat**."
        $breakdown = "• **Fat:** **${f}g**`n• Calories: ${c} kcal`n• Protein: ${p}g`n• Carbohydrates: ${cb}g"
    } elseif ($intent -eq "carbs") {
        $lead = "$unitLabel contains approximately **${cb}g of carbohydrates**."
        $breakdown = "• **Carbohydrates:** **${cb}g**`n• Calories: ${c} kcal`n• Protein: ${p}g`n• Fat: ${f}g"
    } elseif ($intent -eq "both_protein_calories") {
        $lead = "$unitLabel contains approximately **${c} kcal and ${p}g of protein**."
        $breakdown = "• **Calories:** **${c} kcal**`n• **Protein:** **${p}g**`n• Carbohydrates: ${cb}g`n• Fat: ${f}g"
    } else {
        $lead = "Here is the complete nutrition breakdown for ${unitLabel}:"
        $breakdown = "• Calories: ${c} kcal`n• Protein: ${p}g`n• Carbohydrates: ${cb}g`n• Fat: ${f}g"
    }

    return "$lead`n`n$breakdown`n`n💡 *Note:* $($data.notes) Values are approximate and depend on exact portion size and preparation method."
}

$testQueries = @(
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
)

$i = 1
foreach ($q in $testQueries) {
    Write-Host "=================================================="
    Write-Host "[$i] TEST QUESTION: $q"
    Write-Host "=================================================="
    $res = Format-NutritionResponse $q
    Write-Host $res
    Write-Host ""
    $i++
}
