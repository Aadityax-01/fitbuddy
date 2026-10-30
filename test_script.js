
    /* Database keys */
    const DB_KEY = 'fitbuddy_multi_users';
    const ACTIVE_KEY = 'fitbuddy_current_active_user';
    const GUEST_KEY = 'fitbuddy_guest_session_data';

    /* In-memory user database */
    function getUsersDb() {
      try {
        const raw = localStorage.getItem(DB_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function saveUsersDb(db) {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }

    function getActiveUserEmail() {
      return localStorage.getItem(ACTIVE_KEY) || null;
    }

    function setActiveUserEmail(email) {
      if (email) {
        localStorage.setItem(ACTIVE_KEY, email.toLowerCase().trim());
      } else {
        localStorage.removeItem(ACTIVE_KEY);
      }
    }

    /* Guest session data persistence */
    function getGuestData() {
      try {
        const raw = localStorage.getItem(GUEST_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}

      // Default rich guest session with all features 100% unlocked
      const defaultGuest = {
        isGuest: true,
        name: 'Guest Athlete',
        email: 'guest@fitbuddy.local',
        profile: {
          age: 24,
          gender: 'male',
          height: 172,
          weight: 70,
          targetWeight: 68,
          goal: 'Weight Loss',
          activity: '1.55',
          dietType: 'Vegetarian',
          allergies: 'None',
          equipment: 'gym',
          calorieTarget: 2100,
          proteinTarget: 125,
          waterTarget: 2500,
          bmi: 23.7,
          bmiCategory: 'Normal Weight'
        },
        logs: {
          waterToday: 0,
          caloriesToday: 0,
          proteinToday: 0,
          meals: [],
          weights: [],
          workoutsDone: []
        },
        chatHistory: [
          {
            role: 'assistant',
            text: `Hello and welcome to FitBuddy AI! ðŸ¤– You are in completely free, unrestricted Guest Mode.\n\nYou have FULL access to everything: ask me any fitness or nutrition questions, generate custom Indian diet plans, create workout splits, track water and meals, or calculate your BMI and macros!\n\nWhat can I help you achieve today?`,
            time: 'Just now'
          }
        ]
      };
      saveGuestData(defaultGuest);
      return defaultGuest;
    }

    function saveGuestData(data) {
      localStorage.setItem(GUEST_KEY, JSON.stringify(data));
    }

    function getActiveUser() {
      const activeKey = getActiveUserEmail();
      if (activeKey === '__GUEST__') {
        return getGuestData();
      }
      if (!activeKey) return null;
      const db = getUsersDb();
      return db[activeKey] || null;
    }

    function updateActiveUser(mutator) {
      const activeKey = getActiveUserEmail();
      if (activeKey === '__GUEST__') {
        const guest = getGuestData();
        mutator(guest);
        saveGuestData(guest);
        return guest;
      }
      if (!activeKey) return null;
      const db = getUsersDb();
      if (!db[activeKey]) return null;
      mutator(db[activeKey]);
      saveUsersDb(db);
      return db[activeKey];
    }

    /* Modal Helpers */
    function openModal(id) {
      const m = document.getElementById(id);
      if (m) m.classList.remove('hidden');
    }
    function closeModal(id) {
      const m = document.getElementById(id);
      if (m) m.classList.add('hidden');
    }

    /* Start Guest Session (Immediate 100% Access) */
    function startGuestSession(targetTab = 'dashboard') {
      setActiveUserEmail('__GUEST__');
      closeModal('login-modal');
      closeModal('register-modal');
      syncAuthState();
      switchTab(targetTab);
    }

    /* Navigation */
    function navigateToHome() {
      const user = getActiveUser();
      if (user) {
        switchTab('dashboard');
      } else {
        switchTab('public');
      }
    }

    function switchTab(tabKey) {
      // If a user clicks ANY tab while not in a session, seamlessly enter Guest Mode!
      // NEVER lock, disable, or gate any feature!
      let user = getActiveUser();
      if (!user && tabKey !== 'public') {
        startGuestSession(tabKey);
        return;
      }

      const tabs = ['public', 'dashboard', 'diet', 'workout', 'coach', 'bmi', 'progress', 'profile'];
      tabs.forEach(t => {
        const view = document.getElementById('view-' + t);
        const btn = document.getElementById('btn-' + t);
        if (view) {
          view.classList.toggle('hidden', t !== tabKey);
        }
        if (btn) {
          if (t === tabKey) {
            btn.className = "tab-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-[#39ff14] text-black transition-all";
          } else {
            btn.className = "tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white transition-all";
          }
        }
      });

      // Render tab data
      if (tabKey === 'dashboard') renderDashboard();
      if (tabKey === 'diet') renderDietPlan();
      if (tabKey === 'workout') renderWorkoutRoutine();
      if (tabKey === 'coach') renderChatMessages();
      if (tabKey === 'profile') populateProfileForm();
      if (tabKey === 'progress') renderProgressLists();
    }

    /* Auth State Sync */
    function syncAuthState() {
      const user = getActiveUser();
      const guestBtns = document.getElementById('guest-buttons');
      const userBadge = document.getElementById('user-badge');
      const guestPill = document.getElementById('guest-pill');
      const regPill = document.getElementById('registered-pill');
      const userNav = document.getElementById('user-nav');
      const mobileNav = document.getElementById('mobile-nav');

      if (user) {
        if (guestBtns) guestBtns.classList.add('hidden');
        if (userBadge) userBadge.classList.remove('hidden');
        if (userNav) userNav.classList.remove('hidden');
        if (mobileNav) mobileNav.classList.remove('hidden');

        if (user.isGuest) {
          if (guestPill) guestPill.classList.remove('hidden');
          if (regPill) regPill.classList.add('hidden');
          document.getElementById('nav-user-avatar').innerText = 'G';
          document.getElementById('nav-user-avatar').className = 'w-8 h-8 rounded-full bg-[#39ff14] text-black font-black text-xs flex items-center justify-center';
        } else {
          if (guestPill) guestPill.classList.add('hidden');
          if (regPill) regPill.classList.remove('hidden');
          const firstName = user.name.split(' ')[0] || user.name;
          document.getElementById('nav-user-name').innerText = user.name;
          document.getElementById('nav-user-avatar').innerText = firstName.charAt(0).toUpperCase();
          document.getElementById('nav-user-avatar').className = 'w-8 h-8 rounded-full bg-sky-400 text-black font-black text-xs flex items-center justify-center';
        }
      } else {
        if (guestBtns) guestBtns.classList.remove('hidden');
        if (userBadge) userBadge.classList.add('hidden');
        if (userNav) userNav.classList.add('hidden');
        if (mobileNav) mobileNav.classList.add('hidden');
        switchTab('public');
      }
    }

    /* Login Action */
    function handleLoginSubmit(e) {
      e.preventDefault();
      const errBox = document.getElementById('login-error');
      errBox.classList.add('hidden');

      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;

      const db = getUsersDb();
      const user = db[email];

      if (!user) {
        errBox.innerText = 'No account found with this email. You can register or use Continue as Guest.';
        errBox.classList.remove('hidden');
        return;
      }

      if (user.password !== password) {
        errBox.innerText = 'Incorrect password. Please try again.';
        errBox.classList.remove('hidden');
        return;
      }

      setActiveUserEmail(email);
      closeModal('login-modal');
      syncAuthState();
      switchTab('dashboard');
    }

    /* Registration Action */
    function handleRegisterSubmit(e) {
      e.preventDefault();
      const errBox = document.getElementById('register-error');
      errBox.classList.add('hidden');

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim().toLowerCase();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;

      if (!name || !email || !password) {
        errBox.innerText = 'All fields are required.';
        errBox.classList.remove('hidden');
        return;
      }

      if (password !== confirm) {
        errBox.innerText = 'Passwords do not match.';
        errBox.classList.remove('hidden');
        return;
      }

      const db = getUsersDb();
      if (db[email]) {
        errBox.innerText = 'An account with this email already exists. Please sign in.';
        errBox.classList.remove('hidden');
        return;
      }

      // Check if user was previously a guest and preserve their progress!
      const currentGuest = getGuestData();

      db[email] = {
        isGuest: false,
        name,
        email,
        password,
        registeredAt: new Date().toISOString(),
        profile: currentGuest.profile ? { ...currentGuest.profile } : {
          age: 24,
          gender: 'male',
          height: 172,
          weight: 70,
          targetWeight: 68,
          goal: 'Weight Loss',
          activity: '1.55',
          dietType: 'Vegetarian',
          allergies: 'None',
          equipment: 'gym',
          calorieTarget: 2100,
          proteinTarget: 125,
          waterTarget: 2500,
          bmi: 23.7,
          bmiCategory: 'Normal Weight'
        },
        logs: currentGuest.logs ? { ...currentGuest.logs } : {
          waterToday: 0,
          caloriesToday: 0,
          proteinToday: 0,
          meals: [],
          weights: [],
          workoutsDone: []
        },
        chatHistory: currentGuest.chatHistory || [
          {
            role: 'assistant',
            text: `Namaste ${name.split(' ')[0]}! ðŸ¤– Welcome to your permanently saved FitBuddy AI account. Your data will now be kept safe!`,
            time: 'Just now'
          }
        ]
      };

      saveUsersDb(db);
      setActiveUserEmail(email);
      closeModal('register-modal');
      syncAuthState();
      switchTab('dashboard');
      alert(`Account created for ${name}! Your profile and logs are permanently saved.`);
    }

    /* Logout Action (Clears active session, returns to public page) */
    function handleLogout() {
      setActiveUserEmail(null);
      syncAuthState();
      switchTab('public');
    }

    /* Scientific Metric Calculations */
    function computeProfileMetrics(weight, height, age, gender, activityMultiplier, goalStr) {
      if (!weight || !height || !age) return null;
      let bmr = (10 * weight) + (6.25 * height) - (5 * age);
      bmr = (gender === 'female') ? bmr - 161 : bmr + 5;

      const act = parseFloat(activityMultiplier) || 1.55;
      const tdee = Math.round(bmr * act);

      let targetCals = tdee;
      if (goalStr.includes('Loss')) targetCals = tdee - 500;
      else if (goalStr.includes('Gain')) targetCals = tdee + 300;

      const targetProtein = Math.round(weight * 1.8);
      const targetWater = Math.round(weight * 35);

      const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
      let bmiCategory = 'Normal Weight';
      if (bmi < 18.5) bmiCategory = 'Underweight';
      else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
      else if (bmi >= 30) bmiCategory = 'Obese';

      return {
        bmi,
        bmiCategory,
        bmr: Math.round(bmr),
        tdee,
        targetCals: Math.max(1200, targetCals),
        targetProtein,
        targetWater
      };
    }

    /* Save Profile Form */
    function handleSaveProfile(e) {
      e.preventDefault();
      const user = getActiveUser();
      if (!user) return;

      const name = document.getElementById('prof-name').value.trim() || (user.isGuest ? 'Guest Athlete' : user.name);
      const age = parseInt(document.getElementById('prof-age').value) || 24;
      const gender = document.getElementById('prof-gender').value;
      const height = parseFloat(document.getElementById('prof-height').value) || 172;
      const weight = parseFloat(document.getElementById('prof-weight').value) || 70;
      const targetWeight = parseFloat(document.getElementById('prof-target-weight').value) || weight;
      const goal = document.getElementById('prof-goal').value;
      const activity = document.getElementById('prof-activity').value;
      const dietType = document.getElementById('prof-diet').value;
      const allergies = document.getElementById('prof-allergies').value.trim() || 'None';
      const equipment = document.getElementById('prof-equipment').value;

      const metrics = computeProfileMetrics(weight, height, age, gender, activity, goal);

      updateActiveUser(u => {
        u.name = name;
        u.profile = {
          age,
          gender,
          height,
          weight,
          targetWeight,
          goal,
          activity,
          dietType,
          allergies,
          equipment,
          calorieTarget: metrics ? metrics.targetCals : 2100,
          proteinTarget: metrics ? metrics.targetProtein : 125,
          waterTarget: metrics ? metrics.targetWater : 2500,
          bmi: metrics ? metrics.bmi : 23.7,
          bmiCategory: metrics ? metrics.bmiCategory : 'Normal Weight'
        };
      });

      syncAuthState();
      switchTab('dashboard');
      alert('Preferences and AI benchmarks saved!');
    }

    function populateProfileForm() {
      const user = getActiveUser();
      if (!user) return;
      document.getElementById('prof-name').value = user.name || (user.isGuest ? 'Guest Athlete' : '');
      document.getElementById('prof-email').value = user.isGuest ? 'Guest Mode (Temporary session)' : user.email;
      const p = user.profile || {};
      if (p.age) document.getElementById('prof-age').value = p.age;
      if (p.gender) document.getElementById('prof-gender').value = p.gender;
      if (p.height) document.getElementById('prof-height').value = p.height;
      if (p.weight) document.getElementById('prof-weight').value = p.weight;
      if (p.targetWeight) document.getElementById('prof-target-weight').value = p.targetWeight;
      if (p.goal) document.getElementById('prof-goal').value = p.goal;
      if (p.activity) document.getElementById('prof-activity').value = p.activity;
      if (p.dietType) document.getElementById('prof-diet').value = p.dietType;
      if (p.allergies) document.getElementById('prof-allergies').value = p.allergies;
      if (p.equipment) document.getElementById('prof-equipment').value = p.equipment;
    }

    /* Render Dashboard */
    function renderDashboard() {
      const user = getActiveUser();
      if (!user) return;

      const displayName = user.name || (user.isGuest ? 'Guest Athlete' : 'Athlete');
      const firstName = displayName.split(' ')[0] || displayName;
      document.getElementById('dash-user-name').innerText = displayName;
      document.getElementById('dash-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const modeBadge = document.getElementById('dash-mode-badge');
      if (modeBadge) {
        modeBadge.innerText = user.isGuest ? 'âš¡ Unrestricted Guest Mode' : 'Account Synced';
      }

      const p = user.profile || {
        calorieTarget: 2100,
        waterTarget: 2500,
        proteinTarget: 125,
        bmi: 23.7,
        bmiCategory: 'Normal',
        goal: 'Weight Loss',
        dietType: 'Vegetarian'
      };
      const logs = user.logs || { waterToday: 0, caloriesToday: 0, proteinToday: 0, meals: [], workoutsDone: [] };

      // Calories
      const calTarget = p.calorieTarget || 2100;
      const calConsumed = logs.caloriesToday || 0;
      document.getElementById('dash-cal-consumed').innerText = calConsumed.toLocaleString();
      document.getElementById('dash-cal-target').innerText = `/ ${calTarget.toLocaleString()} kcal`;
      const calPercent = Math.min(100, Math.round((calConsumed / calTarget) * 100));
      document.getElementById('dash-cal-bar').style.width = calPercent + '%';
      const remainingCals = Math.max(0, calTarget - calConsumed);
      document.getElementById('dash-cal-remaining').innerText = `${remainingCals.toLocaleString()} kcal remaining`;

      // Water
      const waterTarget = p.waterTarget || 2500;
      const waterConsumed = logs.waterToday || 0;
      document.getElementById('dash-water-consumed').innerText = waterConsumed.toLocaleString();
      document.getElementById('dash-water-target').innerText = `/ ${waterTarget.toLocaleString()} ml`;
      const waterPercent = Math.min(100, Math.round((waterConsumed / waterTarget) * 100));
      document.getElementById('dash-water-bar').style.width = waterPercent + '%';

      // BMI
      const bmiVal = p.bmi || 23.7;
      const bmiCat = p.bmiCategory || 'Normal';
      document.getElementById('dash-bmi-val').innerText = bmiVal;
      document.getElementById('dash-bmi-badge').innerText = bmiCat;
      document.getElementById('dash-bmi-desc').innerText = `Target weight: ${p.targetWeight || 68} kg`;

      // Protein
      const protTarget = p.proteinTarget || 125;
      const protConsumed = logs.proteinToday || 0;
      document.getElementById('dash-protein-consumed').innerText = `${protConsumed}g`;
      document.getElementById('dash-protein-target').innerText = `/ ${protTarget}g target`;
      const protPercent = Math.min(100, Math.round((protConsumed / protTarget) * 100));
      document.getElementById('dash-protein-bar').style.width = protPercent + '%';

      // Summary text
      document.getElementById('dash-summary-text').innerText = `Goal: ${p.goal || 'Fitness'} â€¢ Diet: ${p.dietType || 'Vegetarian'} â€¢ Daily Intake: ${calTarget} kcal`;

      // Workout Checklist Preview
      renderDashboardWorkouts(user);

      // Diet Preview
      renderDashboardDietPreview(user);
    }

    function renderDashboardWorkouts(user) {
      const container = document.getElementById('dash-workout-list');
      if (!container) return;
      const defaultRoutine = [
        { id: 'w1', name: 'Barbell / Goblet Squats', sets: '3 sets Ã— 10 reps', target: 'Quads & Glutes' },
        { id: 'w2', name: 'Push-Ups / Dumbbell Bench', sets: '3 sets Ã— 12 reps', target: 'Chest & Triceps' },
        { id: 'w3', name: 'Bent-Over Rows / Dumbbell Rows', sets: '3 sets Ã— 10 reps', target: 'Back & Biceps' },
        { id: 'w4', name: 'Plank Hold & Core Tension', sets: '3 sets Ã— 45 sec', target: 'Core Stability' }
      ];

      const doneList = user.logs?.workoutsDone || [];

      container.innerHTML = defaultRoutine.map(item => {
        const isDone = doneList.includes(item.id);
        return `
          <div onclick="toggleWorkoutDone('${item.id}')" class="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isDone ? 'bg-[#152515] border-[#39ff1440]' : 'bg-[#161616] border-[#222222] hover:border-[#333]'}">
            <div class="flex items-center gap-3">
              <span class="text-base font-bold ${isDone ? 'text-[#39ff14]' : 'text-gray-500'}">${isDone ? 'âœ“' : 'â—‹'}</span>
              <div>
                <p class="text-xs font-bold ${isDone ? 'line-through text-gray-400' : 'text-white'}">${item.name}</p>
                <p class="text-[10px] text-gray-500">${item.sets} â€¢ ${item.target}</p>
              </div>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded ${isDone ? 'bg-[#39ff1420] text-[#39ff14]' : 'bg-[#202020] text-gray-400'}">
              ${isDone ? 'Done' : 'Tap to Complete'}
            </span>
          </div>
        `;
      }).join('');
    }

    function toggleWorkoutDone(workoutId) {
      updateActiveUser(u => {
        if (!u.logs.workoutsDone) u.logs.workoutsDone = [];
        const idx = u.logs.workoutsDone.indexOf(workoutId);
        if (idx >= 0) u.logs.workoutsDone.splice(idx, 1);
        else u.logs.workoutsDone.push(workoutId);
      });
      renderDashboard();
    }

    function renderDashboardDietPreview(user) {
      const container = document.getElementById('dash-diet-preview');
      if (!container) return;
      const dietType = user.profile?.dietType || 'Vegetarian';
      document.getElementById('dash-diet-preference-label').innerText = `${dietType} meal recommendations`;

      const previewMeals = getIndianMealDataset(dietType).slice(0, 4);
      container.innerHTML = previewMeals.map(m => `
        <div class="p-3 rounded-xl bg-[#161616] border border-[#222222]">
          <span class="text-[9px] font-bold text-[#39ff14] uppercase">${m.timing}</span>
          <p class="text-xs font-bold text-white mt-1 truncate">${m.name}</p>
          <p class="text-[10px] text-gray-400 mt-0.5">${m.calories} kcal â€¢ ${m.protein}g protein</p>
        </div>
      `).join('');
    }

    /* Quick Water Tracking */
    function quickAddWater(ml) {
      updateActiveUser(u => {
        if (!u.logs) u.logs = {};
        u.logs.waterToday = (u.logs.waterToday || 0) + ml;
      });
      renderDashboard();
    }
    function resetWater() {
      updateActiveUser(u => {
        if (!u.logs) u.logs = {};
        u.logs.waterToday = 0;
      });
      renderDashboard();
    }

    /* Food Intake Logging */
    function handleFoodLogSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('food-item-name').value.trim();
      const cals = parseInt(document.getElementById('food-item-cals').value) || 0;
      const prot = parseInt(document.getElementById('food-item-protein').value) || 0;

      updateActiveUser(u => {
        if (!u.logs) u.logs = { waterToday: 0, caloriesToday: 0, proteinToday: 0, meals: [] };
        u.logs.caloriesToday = (u.logs.caloriesToday || 0) + cals;
        u.logs.proteinToday = (u.logs.proteinToday || 0) + prot;
        if (!u.logs.meals) u.logs.meals = [];
        u.logs.meals.unshift({
          id: Date.now(),
          name,
          cals,
          prot,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });

      closeModal('food-modal');
      renderDashboard();
      alert(`Logged: "${name}" (+${cals} kcal, +${prot}g protein)`);
    }

    /* Indian Diet Dataset */
    function getIndianMealDataset(pref) {
      if (pref === 'Non-Vegetarian') {
        return [
          { timing: 'Breakfast (8:30 AM)', name: 'Boiled Eggs & Masala Oats', desc: '3 Whole Eggs / Egg Whites + 50g Rolled Oats with veggies', calories: 420, protein: 26, carbs: 45, fats: 14 },
          { timing: 'Lunch (1:30 PM)', name: 'Chicken Curry & 2 Multigrain Rotis', desc: '150g Chicken Breast Curry + 2 Rotis + Cucumber Tomato Salad', calories: 580, protein: 42, carbs: 48, fats: 16 },
          { timing: 'Snack (5:00 PM)', name: 'Roasted Chana & Green Tea', desc: '50g Roasted Chana (Bengal Gram) + 1 Cup Lemon Green Tea', calories: 190, protein: 11, carbs: 28, fats: 3 },
          { timing: 'Dinner (8:30 PM)', name: 'Grilled Fish / Chicken with Brown Rice', desc: '150g Grilled Fish / Chicken + 1 Cup Steamed Brown Rice + Dal', calories: 520, protein: 38, carbs: 50, fats: 12 }
        ];
      } else if (pref === 'Eggetarian') {
        return [
          { timing: 'Breakfast (8:30 AM)', name: 'Egg Bhurji & Multigrain Toast', desc: '3 Eggs Scrambled with Onions, Chillies + 2 Whole Wheat Toasts', calories: 390, protein: 22, carbs: 32, fats: 16 },
          { timing: 'Lunch (1:30 PM)', name: 'Dal Tadka, Paneer Sabzi & Rotis', desc: '1 Bowl Yellow Dal + 80g Paneer Bhurji + 2 Rotis + Curd', calories: 570, protein: 32, carbs: 58, fats: 20 },
          { timing: 'Snack (5:00 PM)', name: 'Boiled Egg Whites & Masala Chai', desc: '3 Boiled Egg Whites sprinkled with chaat masala + Black Tea', calories: 130, protein: 14, carbs: 2, fats: 1 },
          { timing: 'Dinner (8:30 PM)', name: 'Egg Curry & Jeera Rice', desc: '2 Egg Curry + 1 Cup Brown Rice + Fresh Kachumber Salad', calories: 490, protein: 24, carbs: 54, fats: 15 }
        ];
      } else if (pref === 'Vegan') {
        return [
          { timing: 'Breakfast (8:30 AM)', name: 'Vegetable Poha with Roasted Peanuts', desc: 'Thick Poha cooked with Peas, Carrots, Onions & 25g Peanuts', calories: 380, protein: 12, carbs: 62, fats: 11 },
          { timing: 'Lunch (1:30 PM)', name: 'Soya Chunks Curry, Dal & 2 Rotis', desc: '60g Soya Chunks (dry wt) + 1 Katori Chana Dal + 2 Rotis + Salad', calories: 560, protein: 42, carbs: 65, fats: 9 },
          { timing: 'Snack (5:00 PM)', name: 'Sprouted Moong Salad & Lemon', desc: '1 Bowl Steamed Moong Sprouts with Pomegranate, Onion & Chaat Masala', calories: 180, protein: 12, carbs: 30, fats: 2 },
          { timing: 'Dinner (8:30 PM)', name: 'Tofu Matar Curry with Quinoa / Rice', desc: '150g Pan-seared Tofu + Green Peas Curry + 1 Cup Brown Rice', calories: 480, protein: 28, carbs: 52, fats: 14 }
        ];
      } else {
        // Vegetarian
        return [
          { timing: 'Breakfast (8:30 AM)', name: 'Paneer Stuffed Besan Chilla & Mint Chutney', desc: '2 Besan Chillas stuffed with 70g grated Paneer & green chutney', calories: 430, protein: 25, carbs: 36, fats: 18 },
          { timing: 'Lunch (1:30 PM)', name: 'Dal Makhani (Low Cream) & Paneer Bhurji', desc: '1 Bowl Rajma/Dal + 100g Paneer + 2 Phulkas + 1 Bowl Curd', calories: 610, protein: 35, carbs: 64, fats: 21 },
          { timing: 'Snack (5:00 PM)', name: 'Roasted Makhana & Almonds', desc: '30g Roasted Makhana with pinch of rock salt + 8 Almonds', calories: 190, protein: 6, carbs: 24, fats: 9 },
          { timing: 'Dinner (8:30 PM)', name: 'Palak Paneer with 2 Rotis & Salad', desc: '120g Paneer in Spinach Gravy + 2 Multigrain Rotis + Salad', calories: 510, protein: 28, carbs: 42, fats: 20 }
        ];
      }
    }

    function generateDietPlan() {
      const pref = document.getElementById('diet-preference-select').value;
      updateActiveUser(u => {
        if (!u.profile) u.profile = {};
        u.profile.dietType = pref;
      });
      renderDietPlan();
    }

    function renderDietPlan() {
      const user = getActiveUser();
      const prefSelect = document.getElementById('diet-preference-select');
      const pref = user?.profile?.dietType || prefSelect.value || 'Vegetarian';
      prefSelect.value = pref;

      const meals = getIndianMealDataset(pref);
      const container = document.getElementById('diet-meals-container');
      if (!container) return;

      container.innerHTML = meals.map(m => `
        <div class="p-5 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#39ff1440] transition-all space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-[#39ff14] uppercase tracking-wider">${m.timing}</span>
            <span class="text-xs font-black text-white">${m.calories} kcal</span>
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">${m.name}</h4>
            <p class="text-xs text-gray-400 mt-1 leading-relaxed">${m.desc}</p>
          </div>
          <div class="pt-3 border-t border-[#1c1c1c] flex items-center justify-between text-[11px] text-gray-400">
            <span>Prot: <strong class="text-white">${m.protein}g</strong></span>
            <span>Carbs: <strong class="text-white">${m.carbs}g</strong></span>
            <span>Fats: <strong class="text-white">${m.fats}g</strong></span>
          </div>
        </div>
      `).join('');

      const totalCals = meals.reduce((sum, m) => sum + m.calories, 0);
      const totalProt = meals.reduce((sum, m) => sum + m.protein, 0);
      const targetCals = user?.profile?.calorieTarget || 2100;

      document.getElementById('diet-summary-bar').innerHTML = `
        <div class="flex items-center gap-6">
          <div>
            <span class="text-[10px] uppercase font-bold text-gray-400">Total Planned Calories</span>
            <p class="text-lg font-black text-white">${totalCals} <span class="text-xs font-normal text-gray-400">/ ${targetCals} target</span></p>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-gray-400">Total Planned Protein</span>
            <p class="text-lg font-black text-[#39ff14]">${totalProt}g</p>
          </div>
        </div>
        <button onclick="logWholeDayDiet(${totalCals}, ${totalProt})" class="neon-btn px-4 py-2 text-xs font-bold rounded-xl">
          Log All Meals to Daily Tracker âš¡
        </button>
      `;
    }

    function logWholeDayDiet(cals, prot) {
      updateActiveUser(u => {
        if (!u.logs) u.logs = {};
        u.logs.caloriesToday = (u.logs.caloriesToday || 0) + cals;
        u.logs.proteinToday = (u.logs.proteinToday || 0) + prot;
        if (!u.logs.meals) u.logs.meals = [];
        u.logs.meals.unshift({
          id: Date.now(),
          name: 'AI Generated Full Indian Meal Plan',
          cals,
          prot,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });
      alert(`Successfully logged full meal plan: ${cals} kcal and ${prot}g protein!`);
    }

    /* Adaptive Workout Generator */
    function generateWorkoutRoutine() {
      renderWorkoutRoutine();
    }

    function renderWorkoutRoutine() {
      const split = document.getElementById('workout-split-select').value;
      const equip = document.getElementById('workout-equipment-select').value;
      const container = document.getElementById('workout-exercises-container');
      if (!container) return;

      let exercises = [];
      if (equip === 'bodyweight' || split.includes('Home')) {
        exercises = [
          { name: 'Decline / Standard Push-ups', sets: '4 sets Ã— 15 reps', rest: '60s', cue: 'Keep core clamped tight, chest touch floor.' },
          { name: 'Air Squats + Jump Squats Finisher', sets: '4 sets Ã— 20 reps', rest: '45s', cue: 'Break parallel depth, push through heels.' },
          { name: 'Doorframe Bodyweight Rows / Australian Pulls', sets: '3 sets Ã— 12 reps', rest: '60s', cue: 'Drive elbows back, squeeze upper lats.' },
          { name: 'Walking Lunges', sets: '3 sets Ã— 15 reps per leg', rest: '45s', cue: 'Upright posture, 90 degree knee bends.' },
          { name: 'Hollow Body Hold & Mountain Climbers', sets: '3 sets Ã— 45s', rest: '30s', cue: 'Lower back glued to floor.' }
        ];
      } else if (equip === 'home') {
        exercises = [
          { name: 'Dumbbell Goblet Squats', sets: '4 sets Ã— 12 reps', rest: '60s', cue: 'Hold heavy dumbbell at chest height.' },
          { name: 'Flat Dumbbell Floor / Bench Press', sets: '4 sets Ã— 10 reps', rest: '75s', cue: 'Tuck elbows 45 degrees, full range press.' },
          { name: 'Single-Arm Dumbbell Rows', sets: '3 sets Ã— 12 reps/arm', rest: '60s', cue: 'Pull dumbbell toward hip, not shoulder.' },
          { name: 'Dumbbell Romanian Deadlifts (RDL)', sets: '3 sets Ã— 10 reps', rest: '75s', cue: 'Hinge at hips, stretch hamstrings.' },
          { name: 'Standing Dumbbell Overhead Press', sets: '3 sets Ã— 10 reps', rest: '60s', cue: 'Lock out overhead with neutral spine.' }
        ];
      } else {
        // Gym
        exercises = [
          { name: 'Barbell Back Squat', sets: '4 sets Ã— 8 reps', rest: '90s', cue: 'Deep hip hinge, brace core with Valsalva.' },
          { name: 'Barbell Bench Press', sets: '4 sets Ã— 8-10 reps', rest: '90s', cue: 'Arch upper back, retract scapulae.' },
          { name: 'Lat Pulldowns or Weighted Pull-ups', sets: '3 sets Ã— 10 reps', rest: '60s', cue: 'Pull bar to collarbone, squeeze lats.' },
          { name: 'Incline Dumbbell Chest Press', sets: '3 sets Ã— 10-12 reps', rest: '60s', cue: '30 degree bench angle, upper chest focus.' },
          { name: 'Cable Face Pulls', sets: '3 sets Ã— 15 reps', rest: '45s', cue: 'External shoulder rotation for posture.' },
          { name: 'Hanging Leg Raises', sets: '3 sets Ã— 12 reps', rest: '45s', cue: 'Curl pelvis up without swinging.' }
        ];
      }

      container.innerHTML = exercises.map((ex, idx) => `
        <div class="p-4 rounded-xl bg-[#141414] border border-[#222222] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="flex items-start gap-3.5">
            <div class="w-8 h-8 rounded-lg bg-[#39ff1415] text-[#39ff14] flex items-center justify-center font-bold text-xs flex-shrink-0">
              #${idx + 1}
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">${ex.name}</h4>
              <p class="text-xs text-gray-400 mt-0.5">Form Cue: <span class="text-gray-300 font-medium">${ex.cue}</span></p>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs font-semibold text-gray-300">
            <span class="px-2.5 py-1 rounded bg-[#1c1c1c] text-[#39ff14] border border-[#39ff1430]">${ex.sets}</span>
            <span class="text-gray-500">Rest: ${ex.rest}</span>
          </div>
        </div>
      `).join('');
    }

    /* AI Coach Chat (Completely Unrestricted for Any Question) */
    function renderChatMessages() {
      const user = getActiveUser();
      const container = document.getElementById('chat-messages');
      if (!container) return;

      const history = user?.chatHistory || [
        { role: 'assistant', text: 'Hello! I am your personal FitBuddy AI Coach. What fitness, diet, or general question can I help you with?', time: 'Now' }
      ];

      container.innerHTML = history.map(msg => {
        const isAI = msg.role === 'assistant';
        return `
          <div class="flex gap-3 ${isAI ? '' : 'justify-end'}">
            ${isAI ? `<div class="w-8 h-8 rounded-xl bg-[#39ff1420] text-[#39ff14] flex items-center justify-center text-sm font-bold flex-shrink-0">ðŸ¤–</div>` : ''}
            <div class="max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${isAI ? 'bg-[#181818] border border-[#262626] text-gray-200' : 'bg-[#39ff14] text-black font-semibold'}">
              <p class="whitespace-pre-line">${msg.text}</p>
              <span class="block text-[9px] mt-1.5 opacity-60 text-right">${msg.time}</span>
            </div>
            ${!isAI ? `<div class="w-8 h-8 rounded-xl bg-[#222222] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">${(user?.name || 'G').charAt(0).toUpperCase()}</div>` : ''}
          </div>
        `;
      }).join('');

      container.scrollTop = container.scrollHeight;
    }

    function askCoachPrompt(promptText) {
      document.getElementById('coach-input').value = promptText;
      handleSendChat(new Event('submit'));
    }

    function handleSendChat(e) {
      e.preventDefault();
      const input = document.getElementById('coach-input');
      const text = input.value.trim();
      if (!text) return;

      const user = getActiveUser();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append user msg
      updateActiveUser(u => {
        if (!u.chatHistory) u.chatHistory = [];
        u.chatHistory.push({ role: 'user', text, time: timeStr });
      });

      input.value = '';
      renderChatMessages();

      // Generate natural, unrestricted AI response
      setTimeout(() => {
        const reply = generateAIResponse(text, user);
        updateActiveUser(u => {
          u.chatHistory.push({ role: 'assistant', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        });
        renderChatMessages();
      }, 400);
    }

    function generateAIResponse(query, user) {
      const q = query.toLowerCase();
      const name = user?.name?.split(' ')[0] || 'friend';
      const goal = user?.profile?.goal || 'fitness';
      const diet = user?.profile?.dietType || 'Vegetarian';
      const cals = user?.profile?.calorieTarget || 2100;

      // Indian Food: Paneer / Tofu
      if (q.includes('paneer') || q.includes('tofu')) {
        return `Hey ${name}! Here is the exact breakdown:\n\nâ€¢ **100g Indian Raw Paneer:** ~18-20g protein, 20g fat, 3g carbs, **265 kcal**.\nâ€¢ **100g Soya Paneer (Tofu):** ~14-16g protein, 4g fat, 2g carbs, **75-80 kcal**.\n\nðŸ’¡ *Coach Tip:* If your goal is ${goal}, Tofu provides incredible protein efficiency with 70% fewer calories, while Paneer offers healthy dietary fats and calcium. Both are fantastic Indian protein staples!`;
      }

      // Meal & Dinner queries
      if (q.includes('dinner') || q.includes('lunch') || q.includes('breakfast') || q.includes('eat') || q.includes('meal')) {
        return `Here is a custom high-protein Indian ${diet} meal option for your target (~${Math.round(cals/4)} kcal):\n\nâ€¢ **Option 1:** 2 Multigrain Phulkas + 1 bowl Moong Dal Tadka + 100g Paneer Bhurji / Soya chunks / Grilled Chicken + Cucumber Salad (~480 kcal, 30g protein).\nâ€¢ **Option 2:** 1 cup Brown Rice Khichdi + 1 bowl curd / raita + Roasted Papad (~420 kcal, 22g protein).\n\nBoth digest smoothly and provide steady amino acid release. What dietary adjustments would you like?`;
      }

      // Exercises & Form
      if (q.includes('squat') || q.includes('knee') || q.includes('bench') || q.includes('deadlift') || q.includes('pushup') || q.includes('form')) {
        return `Great training question, ${name}! Proper exercise mechanics are everything:\n\n1. **Core Bracing:** Take a diaphragmatic breath and brace like you're about to take a punch.\n2. **Joint Alignment:** For squats, push your knees outward tracking over your 2nd toe; never let them cave in.\n3. **Tempo & Control:** Take 2-3 seconds on the eccentric (lowering) phase, pause briefly, then explode upward.\n\nAre you experiencing any specific tightness or sticking points in your movement?`;
      }

      // Calorie & Weight Loss math
      if (q.includes('lose') || q.includes('gain') || q.includes('deficit') || q.includes('how many calories') || q.includes('kg')) {
        return `Let's break down the exact mathematics for you, ${name}:\n\nâ€¢ **1 kg of body fat** equals approximately **7,700 kcal**.\nâ€¢ A steady, healthy deficit of **500 calories/day** yields roughly **0.5 kg of pure fat loss per week** (~2 kg per month) without sacrificing muscle mass.\nâ€¢ To preserve your lean tissue, keep protein high (~1.6 to 2.0g per kg of bodyweight) and train each muscle group with progressive overload twice weekly!`;
      }

      // Pre/Post-workout
      if (q.includes('pre-workout') || q.includes('post-workout') || q.includes('snack') || q.includes('energy') || q.includes('sattu')) {
        return `Top Indian energy & recovery options:\n\nâ€¢ **Pre-Workout (45 mins prior):** 1 ripe banana with 1 tbsp peanut butter, OR 1 glass chilled Sattu cooler (25g sattu + lemon + roasted cumin), OR 40g oats in water.\nâ€¢ **Post-Workout (within 60 mins):** Whey protein scoop in water OR 3 boiled egg whites / 80g paneer + 1 piece fruit to replenish glycogen.\n\nKeep it light and easy to digest!`;
      }

      // Greetings / General follow-ups
      if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
        return `Namaste ${name}! ðŸ¤– I'm here and fully available to guide your training, Indian nutrition, calorie targets, workout splits, or any fitness questions. How can I assist you right now?`;
      }

      // Natural, conversational response to ANY query
      return `Thanks for asking, ${name}! Regarding "${query}":\n\nWhen optimizing for **${goal}** with an intake around **${cals} calories**:\n\n1. **Nutrition:** Prioritize whole food Indian ingredients with ample micronutrients, fiber, and clean protein distribution.\n2. **Training:** Focus on compound movements (Squats, Presses, Hinges, Pulls) with progressive overload.\n3. **Recovery:** Aim for 7-8 hours of quality sleep and maintain at least 2.5L to 3L daily hydration.\n\nFeel free to ask any follow-up question or ask me to calculate specific numbers for you!`;
    }

    function clearChatHistory() {
      updateActiveUser(u => {
        const name = u.name || 'friend';
        u.chatHistory = [
          { role: 'assistant', text: `Chat cleared! Ready for your questions, ${name}.`, time: 'Now' }
        ];
      });
      renderChatMessages();
    }

    /* Calculator Live Computation */
    function calculateLiveMetrics() {
      const h = parseFloat(document.getElementById('calc-height').value) || 172;
      const w = parseFloat(document.getElementById('calc-weight').value) || 70;
      const a = parseInt(document.getElementById('calc-age').value) || 24;
      const g = document.getElementById('calc-gender').value;
      const act = parseFloat(document.getElementById('calc-activity').value);
      const goalAdj = parseInt(document.getElementById('calc-goal').value);

      const res = computeProfileMetrics(w, h, a, g, act, goalAdj < 0 ? 'Loss' : (goalAdj > 0 ? 'Gain' : 'Maintain'));
      if (!res) return;

      document.getElementById('res-bmi').innerText = res.bmi;
      document.getElementById('res-bmi-tag').innerText = res.bmiCategory;
      document.getElementById('res-bmr').innerText = res.bmr.toLocaleString();
      document.getElementById('res-tdee').innerText = res.tdee.toLocaleString();
      document.getElementById('res-target').innerText = (res.tdee + goalAdj).toLocaleString();
    }

    function applyCalculatedToProfile() {
      const h = parseFloat(document.getElementById('calc-height').value) || 172;
      const w = parseFloat(document.getElementById('calc-weight').value) || 70;
      const a = parseInt(document.getElementById('calc-age').value) || 24;
      const g = document.getElementById('calc-gender').value;
      const act = document.getElementById('calc-activity').value;
      const goalAdj = parseInt(document.getElementById('calc-goal').value);
      const goalStr = goalAdj < 0 ? 'Weight Loss' : (goalAdj > 0 ? 'Muscle Gain' : 'Maintenance');

      const res = computeProfileMetrics(w, h, a, g, act, goalStr);

      updateActiveUser(u => {
        if (!u.profile) u.profile = {};
        u.profile.height = h;
        u.profile.weight = w;
        u.profile.age = a;
        u.profile.gender = g;
        u.profile.activity = act;
        u.profile.goal = goalStr;
        u.profile.calorieTarget = res.tdee + goalAdj;
        u.profile.proteinTarget = res.targetProtein;
        u.profile.waterTarget = res.targetWater;
        u.profile.bmi = res.bmi;
        u.profile.bmiCategory = res.bmiCategory;
      });

      alert('Targets applied to your session and dashboard!');
      switchTab('dashboard');
    }

    /* Progress & Tracker Lists */
    function renderProgressLists() {
      const user = getActiveUser();
      if (!user) return;

      // Meals
      const mealsContainer = document.getElementById('progress-meals-list');
      const meals = user.logs?.meals || [];
      if (meals.length === 0) {
        mealsContainer.innerHTML = '<p class="text-xs text-gray-500 italic p-3 bg-[#141414] rounded-xl border border-[#1f1f1f]">No meals logged today yet. Use "+ Log Meal" above.</p>';
      } else {
        mealsContainer.innerHTML = meals.map(m => `
          <div class="p-3 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-white">${m.name}</p>
              <p class="text-[10px] text-gray-500">${m.time}</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-black text-[#39ff14]">${m.cals} kcal</span>
              <p class="text-[10px] text-gray-400">${m.prot}g protein</p>
            </div>
          </div>
        `).join('');
      }

      // Weights
      const weightContainer = document.getElementById('progress-weight-list');
      const weights = user.logs?.weights || [];
      if (weights.length === 0) {
        weightContainer.innerHTML = '<p class="text-xs text-gray-500 italic p-3 bg-[#141414] rounded-xl border border-[#1f1f1f]">No weights logged yet. Enter your current weight above.</p>';
      } else {
        weightContainer.innerHTML = weights.map(w => `
          <div class="p-2.5 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between text-xs">
            <span class="text-gray-400">${w.date}</span>
            <span class="font-black text-white">${w.weight} kg</span>
          </div>
        `).join('');
      }
    }

    function logCurrentWeight() {
      const val = parseFloat(document.getElementById('log-weight-input').value);
      if (!val || val < 30 || val > 300) {
        alert('Please enter a valid weight in kg.');
        return;
      }
      updateActiveUser(u => {
        if (!u.logs) u.logs = {};
        if (!u.logs.weights) u.logs.weights = [];
        u.logs.weights.unshift({
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          weight: val
        });
        if (u.profile) {
          u.profile.weight = val;
        }
      });
      document.getElementById('log-weight-input').value = '';
      renderProgressLists();
      renderDashboard();
      alert(`Logged weight: ${val} kg!`);
    }

    /* Initialize on DOM load */
    window.addEventListener('DOMContentLoaded', () => {
      // Sync auth state on load
      syncAuthState();
    });
  
