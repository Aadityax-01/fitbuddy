# FitBuddy AI – AI-Powered Personal Fitness & Nutrition Assistant ⚡

> **FitBuddy AI** is a premium, commercial-grade fitness and nutrition web application built with a modern dark theme, neon green accents, and AI-powered intelligence for personalized diet planning, dynamic workout generation, calorie & macro tracking, and an interactive fitness coach.

---

## 🌟 Key Highlights & Features

### 1. 🎨 Premium UI/UX Design
- **Dark Neon Aesthetics:** Deep charcoal/black backgrounds (`#0a0a0a`, `#111111`) with vibrant neon green accents (`#39ff14`).
- **Data Visualizations:** Interactive weekly calorie intake charts, macro donut distributions, hydration rings, and body weight trendlines using **Recharts**.
- **Smooth Micro-Interactions:** Custom keyframe animations, glow filters, responsive drawer navigation, and accessible mobile layout.

### 2. 🔐 User Authentication & Onboarding
- **Multi-step Onboarding:** Collects age, gender, height, weight, activity level, fitness goals, dietary restrictions, and equipment access.
- **Persistent State:** Seamless session persistence with token handling and automatic profile syncing.

### 3. ⚖️ Scientific BMI & Calorie Calculator
- **Mifflin-St Jeor BMR Equation** to calculate baseline resting calories.
- **TDEE & Goal Multipliers** with deficit/surplus adjustments for fat loss, maintenance, or muscle hypertrophy.
- **Macro Distribution Engine:** Computes optimal protein, carbohydrate, and healthy fat grams tailored to individual goals.

### 4. 🥗 AI Diet Planner (Indian Cuisine Focused)
- Tailored meal generation across **Breakfast**, **Lunch**, **Evening Snack**, and **Dinner**.
- Support for Indian staples: Dal Tadka, Roti, Paneer Sabzi, Rice, Curd, Boiled Eggs, Oats, Chana, and Seasonal Fruits.
- Macro breakdowns (Protein, Carbs, Fats) and calorie estimates for every meal item.
- Instant meal regeneration and swap capability.

### 5. 🏋️ AI Workout Routine Architect
- Dynamic routines for **Home** (bodyweight/resistance bands), **Gym**, or **Outdoor**.
- Adaptive for **Beginner**, **Intermediate**, and **Advanced** trainees.
- Structured session splits: **Dynamic Warm-Up**, **Working Sets** (with target muscle, reps, sets, rest intervals, and coaching form tips), and **Cool-Down**.
- Interactive exercise completion checklist and session progress meter.

### 6. 🤖 FitBuddy AI Coach (Chatbot)
- Conversational fitness assistant with profile awareness.
- Ready prompt shortcuts ("What should I eat today?", "How much protein do I need?", "Suggest a healthy Indian diet").
- Fallback AI knowledge engine capable of answering nutrition and training queries even without an external API key.

### 7. 🍎 Food, Nutrition & Water Trackers
- Comprehensive built-in database of Indian and international foods.
- Real-time macro summation and remaining calorie calculations.
- Visual hydration tracker with one-click quick add (+250ml, +500ml) and daily streak count.

### 8. 📈 Progress & Analytics Dashboard
- Body weight trendline with target milestones.
- Weekly workout adherence percentage.
- Monthly caloric discipline tracker.

---

## 🏗️ Folder Structure

```
fitbuddy-ai/
├── backend/                        # Python FastAPI Backend
│   ├── app/
│   │   ├── models/                 # SQLAlchemy Database Models
│   │   │   ├── user.py             # User & UserProfile schemas
│   │   │   └── fitness.py          # FoodLog, WaterLog, DietPlan, WorkoutLog, ChatHistory
│   │   ├── routers/                # REST API Endpoints
│   │   │   ├── auth.py             # /auth/register, /auth/login
│   │   │   ├── users.py            # /users/me, /users/me/profile
│   │   │   ├── diet.py             # /diet/generate, /diet/today
│   │   │   ├── workout.py          # /workout/generate, /workout/today
│   │   │   ├── chat.py             # /chat/message, /chat/history
│   │   │   ├── food_logs.py        # /food/log, /food/logs, /food/summary
│   │   │   ├── water_logs.py       # /water/log, /water/logs, /water/summary
│   │   │   └── progress.py         # /progress/weight, /progress/overview
│   │   ├── services/
│   │   │   └── ai_service.py       # OpenAI GPT-4o-mini integration & intelligent fallback
│   │   ├── utils/
│   │   │   └── auth.py             # JWT token hashing & bearer verification
│   │   ├── config.py               # Pydantic Settings
│   │   ├── database.py             # SQLite / Postgres engine & session setup
│   │   └── main.py                 # FastAPI application root & CORS
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example
│   └── .env
│
├── frontend/                       # React Single Page Application
│   ├── public/
│   │   └── index.html              # HTML Shell with Google Inter Font
│   ├── src/
│   │   ├── assets/                 # Brand assets
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx      # TopBar + Sidebar master shell
│   │   │   │   ├── Sidebar.jsx     # Navigation drawer with glowing active items
│   │   │   │   └── TopBar.jsx      # Dynamic greeting, notifications, user avatar
│   │   │   └── ui/
│   │   │       ├── Badge.jsx       # Status pills
│   │   │       ├── Button.jsx      # Neon, outline, ghost buttons
│   │   │       ├── Input.jsx       # Dark inputs with focus glow
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── Modal.jsx       # Backdrop blur dialogs
│   │   │       ├── ProgressRing.jsx# SVG circular completion gauges
│   │   │       └── StatCard.jsx    # Metric cards with animated counter
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state, user profile, localStorage sync
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   └── useLocalStorage.js
│   │   ├── pages/                  # All 13 Full Application Pages
│   │   │   ├── LandingPage.jsx     # Premium marketing hero & features
│   │   │   ├── LoginPage.jsx       # User authentication
│   │   │   ├── SignupPage.jsx      # New user registration
│   │   │   ├── OnboardingPage.jsx  # 4-Step fitness onboarding questionnaire
│   │   │   ├── DashboardPage.jsx   # Master command center
│   │   │   ├── BMICalculatorPage.jsx# Interactive arc gauge & macro calculator
│   │   │   ├── DietPlannerPage.jsx # Indian meal generator
│   │   │   ├── WorkoutPlannerPage.jsx# Custom workout routine architect
│   │   │   ├── FoodTrackerPage.jsx # Calorie & food logging with Indian DB
│   │   │   ├── WaterTrackerPage.jsx# Hydration tracker
│   │   │   ├── ChatbotPage.jsx     # FitBuddy AI Coach
│   │   │   ├── ProgressPage.jsx    # Weight trendline & consistency reports
│   │   │   └── ProfilePage.jsx     # User settings, BMR/TDEE baselines
│   │   ├── services/
│   │   │   └── api.js              # Axios client with bearer interceptor & mock fallback
│   │   ├── utils/
│   │   │   └── calculations.js     # Pure fitness & macro formulas
│   │   ├── App.jsx                 # React Router v6 routing & guards
│   │   ├── index.css               # Tailwind directives & neon CSS variables
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher) and **npm**
- **Python** (v3.10 or higher) and **pip**

---

### Step 1: Start the Backend (FastAPI)

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy environment settings:
   ```bash
   copy .env.example .env
   ```
   *(Optional)* Add your `OPENAI_API_KEY` in `.env` for live GPT completions. If omitted, FitBuddy AI automatically runs in smart demo mode.
5. Launch the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API Docs will be available at: **http://localhost:8000/docs**
   - Health check: **http://localhost:8000/health**

---

### Step 2: Start the Frontend (React + Tailwind)

1. Open a second terminal in `frontend/`:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm start
   ```
4. Open your browser at **http://localhost:3000**

---

## 🧪 Testing Account / Demo Credentials

- FitBuddy AI comes preloaded with an interactive demo mode.
- You can log in with **any valid email** (e.g. `alex@fitbuddy.ai`) and any password (at least 6 characters).
- Or click **"Start Free"** on the Landing Page to experience the 4-step personalized onboarding questionnaire!
