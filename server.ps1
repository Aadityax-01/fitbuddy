# FitBuddy AI - Unified Web & API Server
$port = 5000
$prefix = "http://localhost:$port/"
$htmlPath = Join-Path $PSScriptRoot "preview.html"

if (-not (Test-Path $htmlPath)) {
    $htmlPath = "C:\Users\asus\.gemini\antigravity\brain\52853aa8-ec62-4abb-891e-7746800fbd74\fitbuddy_preview.html"
}

# ── Food & Nutrition Engine ──────────────────────────────────────────
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

function Get-AIResponse($query) {
    $q = $query.ToLower()
    $hasProtein = ($q -match "protein|protien")
    $hasCalories = ($q -match "calorie|calories|kcal|cal|energy|kitni calorie")
    $hasFat = ($q -match "fat|fats|charbi")
    $hasCarbs = ($q -match "carb|carbs|carbohydrate|carbohydrates")

    $intent = "all_macros"
    if (($hasProtein -and $hasCalories) -or ($q -match "protein and calories|calories and protein|protein aur calorie")) {
        $intent = "both_protein_calories"
    } elseif ($hasProtein) {
        $intent = "protein"
    } elseif ($hasCalories) {
        $intent = "calories"
    } elseif ($hasFat) {
        $intent = "fat"
    } elseif ($hasCarbs) {
        $intent = "carbs"
    }

    $matchedData = $null
    $keys = $FOOD_DATABASE.Keys | Sort-Object { 
        $maxLen = 0
        foreach ($n in $FOOD_DATABASE[$_].names) { if ($n.Length -gt $maxLen) { $maxLen = $n.Length } }
        $maxLen 
    } -Descending

    foreach ($k in $keys) {
        $entry = $FOOD_DATABASE[$k]
        foreach ($name in $entry.names) {
            if ($q -match "\b$([regex]::Escape($name))\b") {
                $matchedData = $entry
                break
            }
        }
        if ($matchedData) { break }
    }

    if ($matchedData) {
        $qty = $matchedData.default_qty
        if ($q -match "(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams)\b") {
            $qty = [double]$matches[1]
        } elseif ($q -match "(\d+(?:\.\d+)?)\s*(?:ml|milliliter|milliliters)\b") {
            $qty = [double]$matches[1]
        } elseif ($q -match "\b(\d+)\s*(?:large|medium|small|whole|boiled)?\s*(?:egg|eggs|anda|ande|banana|bananas|kela|kele|roti|rotis|chapati|chapatis|phulka|fulka|piece|pieces|cup|cups|bowl|bowls|glass|glasses)\b") {
            $qty = [double]$matches[1]
        } elseif ($q -match "^\s*(\d+)\b") {
            $qty = [double]$matches[1]
        }

        if ($matchedData.ContainsKey("per_unit")) {
            $p = [math]::Round($matchedData.per_unit.protein * $qty, 1)
            $c = [math]::Round($matchedData.per_unit.calories * $qty)
            $f = [math]::Round($matchedData.per_unit.fat * $qty, 1)
            $cb = [math]::Round($matchedData.per_unit.carbs * $qty, 1)
        } else {
            $factor = $qty / 100.0
            $p = [math]::Round($matchedData.per_100g.protein * $factor, 1)
            $c = [math]::Round($matchedData.per_100g.calories * $factor)
            $f = [math]::Round($matchedData.per_100g.fat * $factor, 1)
            $cb = [math]::Round($matchedData.per_100g.carbs * $factor, 1)
        }

        $verb = if ($qty -eq 1) { "contains" } else { "contain" }
        if ($matchedData.unit -in @("egg", "banana", "roti")) {
            $unitLabel = if ($qty -eq 1) { "1 $($matchedData.portion_name)" } else { "$qty $($matchedData.portion_name)s" }
        } elseif ($matchedData.unit -eq "gram") {
            $unitLabel = "${qty}g of $($matchedData.portion_name)"
        } elseif ($matchedData.unit -eq "ml") {
            $unitLabel = "${qty}ml of $($matchedData.portion_name)"
        } else {
            $unitLabel = "$qty $($matchedData.unit)(s) of $($matchedData.portion_name)"
        }

        if ($intent -eq "protein") {
            $lead = "$unitLabel $verb approximately **${p}g of protein**."
            $breakdown = "• **Protein:** **${p}g**`n• Calories: ${c} kcal`n• Fat: ${f}g`n• Carbohydrates: ${cb}g"
        } elseif ($intent -eq "calories") {
            $lead = "$unitLabel $verb approximately **${c} kcal (calories)**."
            $breakdown = "• **Calories:** **${c} kcal**`n• Carbohydrates: ${cb}g`n• Protein: ${p}g`n• Fat: ${f}g"
        } elseif ($intent -eq "fat") {
            $lead = "$unitLabel $verb approximately **${f}g of fat**."
            $breakdown = "• **Fat:** **${f}g**`n• Calories: ${c} kcal`n• Protein: ${p}g`n• Carbohydrates: ${cb}g"
        } elseif ($intent -eq "carbs") {
            $lead = "$unitLabel $verb approximately **${cb}g of carbohydrates**."
            $breakdown = "• **Carbohydrates:** **${cb}g**`n• Calories: ${c} kcal`n• Protein: ${p}g`n• Fat: ${f}g"
        } elseif ($intent -eq "both_protein_calories") {
            $lead = "$unitLabel $verb approximately **${c} kcal and ${p}g of protein**."
            $breakdown = "• **Calories:** **${c} kcal**`n• **Protein:** **${p}g**`n• Carbohydrates: ${cb}g`n• Fat: ${f}g"
        } else {
            $lead = "Here is the complete nutrition breakdown for ${unitLabel}:"
            $breakdown = "• Calories: ${c} kcal`n• Protein: ${p}g`n• Carbohydrates: ${cb}g`n• Fat: ${f}g"
        }
        return "$lead`n`n$breakdown`n`n*Note:* $($matchedData.notes) Values are approximate and depend on exact portion size and preparation method."
    }

    # Fitness questions
    if ($q -match "best time" -and ($q -match "workout|work out|exercise|train")) {
        return "The best time to work out is whenever you can stay most consistent!`n`n- Morning (6:00 AM - 9:00 AM): Great for building habit consistency and daytime alertness.`n- Late Afternoon / Evening (4:00 PM - 7:00 PM): Peak neuromuscular performance and body temperature, allowing for heavier lifts.`n`nPick the window that fits your schedule and stick with it!"
    }

    if ($q -match "workout|exercise|training|squat|bench|push") {
        return "Here is a great full-body foundational workout:`n`n- Squats: 3 sets x 12 reps`n- Push-Ups: 3 sets x 10-12 reps`n- Dumbbell / Inverted Rows: 3 sets x 10 reps`n- Plank: 3 sets x 45 seconds`n`nRemember to maintain progressive overload and keep 1-2 reps in reserve!"
    }

    if ($q -match "diet|meal|food|eat") {
        return "A balanced Indian high-protein meal template:`n`n- 2 Multigrain Rotis`n- 1 Bowl Dal Tadka (Moong / Toor)`n- 100g Paneer Bhurji OR Grilled Chicken Breast`n- 1 Bowl fresh Cucumber Tomato Salad with lemon`n`nProvides ~480-520 kcal and 30g+ of bioavailable protein!"
    }

    return "Hello! I am your FitBuddy AI Coach. I can accurately calculate calories, protein, and macros for foods (e.g. 'How much protein in 4 eggs?', 'Calories in 2 bananas?'), design Indian diet plans, and suggest workout routines. How can I help you today?"
}

# ── Start HTTP Listener ──────────────────────────────────────────────
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=========================================================" -ForegroundColor Green
    Write-Host "  FitBuddy AI Web & API Server is LIVE!" -ForegroundColor Green
    Write-Host "  URL: http://localhost:$port" -ForegroundColor White
    Write-Host "=========================================================" -ForegroundColor Green
} catch {
    Write-Error "Failed to start listener on $prefix : $_"
    exit 1
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        # 1. API: /chat/message
        if ($request.HttpMethod -eq "POST" -and $request.Url.AbsolutePath -eq "/chat/message") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $json = $null
            try { $json = ConvertFrom-Json $body } catch {}

            $msgText = ""
            $sessId = "session_guest"
            if ($json) {
                if ($json.message) { $msgText = [string]$json.message }
                if ($json.session_id) { $sessId = [string]$json.session_id }
            }

            $reply = Get-AIResponse -query $msgText

            $resObj = @{
                session_id = $sessId
                user_message = $msgText
                assistant_reply = $reply
                created_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
            }

            $resJson = ConvertTo-Json $resObj
            $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)

            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $resBytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            $response.Close()
            continue
        }

        # 2. API: /health
        if ($request.Url.AbsolutePath -eq "/health" -or $request.Url.AbsolutePath -eq "/api/health") {
            $healthJson = '{"status":"ok","server":"FitBuddy AI PowerShell Engine"}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($healthJson)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # 3. Static Web App: preview.html
        if (Test-Path $htmlPath) {
            $bytes = [System.IO.File]::ReadAllBytes($htmlPath)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200

            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $msg = [System.Text.Encoding]::UTF8.GetBytes("FitBuddy AI Preview file not found.")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $msg.Length
            $response.StatusCode = 404
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # ignore disconnects
    }
}
