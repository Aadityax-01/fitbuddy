$rootPath = "C:\Users\asus\.gemini\antigravity\scratch\fitbuddy-ai"
$indexPath = Join-Path $rootPath "index.html"
$lines = Get-Content -Path $indexPath

$dietLineIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'id="view-diet"') {
        $dietLineIndex = $i
        break
    }
}

# Subviews & Modals & Script tail
$tail = ($lines[$dietLineIndex..($lines.Count - 1)] -join "`r`n")

# Replace monochrome colors in tail with midnight-blue, cyan, and blue design tokens:
$tail = $tail `
    -replace '#171717', '#0b1329' `
    -replace '#262626', '#0f172a' `
    -replace '#404040', '#1e293b' `
    -replace '#A3A3A3', '#C4C4C4' `
    -replace '#737373', '#94a3b8'

# Update switchTab in tail to handle sidebar-btn-* as well
$oldSwitchTab = @'
    function switchTab(tabKey) {
      const tabs = ['public', 'dashboard', 'diet', 'workout', 'coach', 'bmi', 'progress', 'profile'];
      tabs.forEach(t => {
        const view = document.getElementById('view-' + t);
        const btn = document.getElementById('btn-' + t);
        if (view) {
          if (t === tabKey) {
            view.classList.remove('hidden');
            view.style.display = 'block';
          } else {
            view.classList.add('hidden');
            view.style.display = 'none';
          }
        }
        if (btn) {
          if (t === tabKey) {
            btn.className = "tab-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-black transition-all";
          } else {
            btn.className = "tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-[#C4C4C4] hover:text-white hover:bg-[#0f172a] transition-all";
          }
        }
      });

      // Render tab data safely
      try {
        if (tabKey === 'dashboard') renderDashboard();
        if (tabKey === 'diet') renderDietPlan();
        if (tabKey === 'workout') renderWorkoutRoutine();
        if (tabKey === 'coach') renderChatMessages();
        if (tabKey === 'profile') populateProfileForm();
        if (tabKey === 'progress') renderProgressLists();
      } catch (e) {
        console.error("Tab render error for", tabKey, e);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
'@

$newSwitchTab = @'
    function switchTab(tabKey) {
      const tabs = ['public', 'dashboard', 'diet', 'workout', 'coach', 'bmi', 'progress', 'profile'];
      tabs.forEach(t => {
        const view = document.getElementById('view-' + t);
        const btn = document.getElementById('btn-' + t);
        const sideBtn = document.getElementById('sidebar-btn-' + t);
        if (view) {
          if (t === tabKey) {
            view.classList.remove('hidden');
            view.style.display = 'block';
          } else {
            view.classList.add('hidden');
            view.style.display = 'none';
          }
        }
        if (btn) {
          if (t === tabKey) {
            btn.className = "tab-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all";
          } else {
            btn.className = "tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-[#C4C4C4] hover:text-white hover:bg-[#0f172a] transition-all";
          }
        }
        if (sideBtn) {
          if (t === tabKey) {
            sideBtn.className = "sidebar-nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-white bg-gradient-to-r from-[#06b6d4]/20 to-[#3b82f6]/10 border border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-left";
          } else {
            sideBtn.className = "sidebar-nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-transparent text-left";
          }
        }
      });

      // Auto-close mobile sidebar when link clicked
      const sb = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sb && window.innerWidth < 1024) {
        sb.classList.add('-translate-x-full');
        if (backdrop) backdrop.classList.add('hidden');
      }

      // Render tab data safely
      try {
        if (tabKey === 'dashboard') {
          renderDashboard();
          renderChatMessages();
        }
        if (tabKey === 'diet') renderDietPlan();
        if (tabKey === 'workout') renderWorkoutRoutine();
        if (tabKey === 'coach') renderChatMessages();
        if (tabKey === 'profile') populateProfileForm();
        if (tabKey === 'progress') renderProgressLists();
      } catch (e) {
        console.error("Tab render error for", tabKey, e);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
'@

if ($tail.Contains($oldSwitchTab)) {
    $tail = $tail.Replace($oldSwitchTab, $newSwitchTab)
    Write-Host "Replaced switchTab successfully"
} else {
    Write-Warning "Could not exact-match old switchTab, will do regex replacement"
    $tail = [regex]::Replace($tail, 'function switchTab\(tabKey\)\s*\{[\s\S]*?window\.scrollTo\(\{ top: 0, behavior: ''smooth'' \}\);\s*\}', $newSwitchTab)
}

# Update syncAuthState
$oldSyncAuthState = @'
    /* Auth State Sync with direct style toggles */
    function syncAuthState() {
      const user = getActiveUser();
      const guestBtns = document.getElementById('guest-buttons');
      const userBadge = document.getElementById('user-badge');
      const guestPill = document.getElementById('guest-pill');
      const regPill = document.getElementById('registered-pill');
      const userNav = document.getElementById('user-nav');
      const mobileNav = document.getElementById('mobile-nav');

      if (user) {
        if (guestBtns) { guestBtns.classList.add('hidden'); guestBtns.style.display = 'none'; }
        if (userBadge) { userBadge.classList.remove('hidden'); userBadge.style.display = 'flex'; }
        if (userNav) { userNav.classList.remove('hidden'); userNav.style.display = 'flex'; }
        if (mobileNav) { mobileNav.classList.remove('hidden'); mobileNav.style.display = 'flex'; }

        if (user.isGuest) {
          if (guestPill) { guestPill.classList.remove('hidden'); guestPill.style.display = 'flex'; }
          if (regPill) { regPill.classList.add('hidden'); regPill.style.display = 'none'; }
          const avatar = document.getElementById('nav-user-avatar');
          if (avatar) {
            avatar.innerText = 'G';
            avatar.className = 'w-8 h-8 rounded-full bg-white text-black font-black text-xs flex items-center justify-center';
          }
        } else {
          if (guestPill) { guestPill.classList.add('hidden'); guestPill.style.display = 'none'; }
          if (regPill) { regPill.classList.remove('hidden'); regPill.style.display = 'block'; }
          const firstName = user.name.split(' ')[0] || user.name;
          const navName = document.getElementById('nav-user-name');
          if (navName) navName.innerText = user.name;
          const avatar = document.getElementById('nav-user-avatar');
          if (avatar) {
            avatar.innerText = firstName.charAt(0).toUpperCase();
            avatar.className = 'w-8 h-8 rounded-full bg-white text-black font-black text-xs flex items-center justify-center';
          }
        }
      } else {
        // Visitor state (welcome page)
        if (guestBtns) { guestBtns.classList.remove('hidden'); guestBtns.style.display = 'flex'; }
        if (userBadge) { userBadge.classList.add('hidden'); userBadge.style.display = 'none'; }
        if (userNav) { userNav.classList.add('hidden'); userNav.style.display = 'none'; }
        if (mobileNav) { mobileNav.classList.add('hidden'); mobileNav.style.display = 'none'; }
      }
    }
'@

$newSyncAuthState = @'
    /* Auth State Sync with direct style toggles */
    function syncAuthState() {
      const user = getActiveUser();
      const guestBtns = document.getElementById('guest-buttons');
      const userBadge = document.getElementById('user-badge');
      const guestPill = document.getElementById('guest-pill');
      const regPill = document.getElementById('registered-pill');
      const navAvatar = document.getElementById('nav-user-avatar');
      const navName = document.getElementById('nav-user-name');
      const sideUserName = document.getElementById('sidebar-user-name');
      const sideAuthActions = document.getElementById('sidebar-auth-actions');

      if (user) {
        if (guestBtns) { guestBtns.classList.add('hidden'); guestBtns.style.display = 'none'; }
        if (userBadge) { userBadge.classList.remove('hidden'); userBadge.style.display = 'flex'; }

        if (user.isGuest) {
          if (guestPill) { guestPill.classList.remove('hidden'); guestPill.style.display = 'flex'; }
          if (regPill) { regPill.classList.add('hidden'); regPill.style.display = 'none'; }
          if (navAvatar) {
            navAvatar.innerText = 'G';
            navAvatar.className = 'w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#2563eb] text-white font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]';
          }
          if (sideUserName) sideUserName.innerText = 'Guest Mode';
          if (sideAuthActions) {
            sideAuthActions.innerHTML = `
              <button onclick="openModal('register-modal')" class="flex-1 py-1.5 text-center font-bold rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white hover:opacity-90 transition-opacity">Register</button>
              <button onclick="openModal('login-modal')" class="flex-1 py-1.5 text-center font-bold rounded-lg border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-colors">Login</button>
            `;
          }
        } else {
          if (guestPill) { guestPill.classList.add('hidden'); guestPill.style.display = 'none'; }
          if (regPill) { regPill.classList.remove('hidden'); regPill.style.display = 'block'; }
          const firstName = user.name ? (user.name.split(' ')[0] || user.name) : 'Athlete';
          if (navName) navName.innerText = user.name || 'Athlete';
          if (navAvatar) {
            navAvatar.innerText = firstName.charAt(0).toUpperCase();
            navAvatar.className = 'w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#2563eb] text-white font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]';
          }
          if (sideUserName) sideUserName.innerText = user.name || 'Athlete';
          if (sideAuthActions) {
            sideAuthActions.innerHTML = `
              <button onclick="handleLogout()" class="w-full py-1.5 rounded-lg text-xs font-semibold text-[#C4C4C4] hover:text-white hover:bg-[#1e293b] transition-all flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Sign Out
              </button>
            `;
          }
        }
      } else {
        // Visitor state (welcome page)
        if (guestBtns) { guestBtns.classList.remove('hidden'); guestBtns.style.display = 'flex'; }
        if (userBadge) { userBadge.classList.add('hidden'); userBadge.style.display = 'none'; }
        if (sideUserName) sideUserName.innerText = 'Guest Visitor';
        if (sideAuthActions) {
          sideAuthActions.innerHTML = `
            <button onclick="startGuestSession()" class="w-full py-1.5 text-center font-bold rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white hover:opacity-90 transition-opacity">⚡ Instant Guest Access</button>
          `;
        }
      }
    }
'@

$tail = [regex]::Replace($tail, '/\* Auth State Sync with direct style toggles \*/[\s\S]*?function syncAuthState\(\)\s*\{[\s\S]*?\}\s*\}', $newSyncAuthState)

# Update renderChatMessages and chat handlers
$oldChatSection = @'
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
            ${isAI ? `<div class="w-8 h-8 rounded-xl bg-[#0f172a] text-white border border-[#1e293b] flex items-center justify-center text-sm font-bold flex-shrink-0">🤖</div>` : ''}
            <div class="max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${isAI ? 'bg-[#0b1329] border border-[#1e293b] text-white' : 'bg-white text-black font-semibold'}">
              <p class="whitespace-pre-line">${msg.text}</p>
              <span class="block text-[9px] mt-1.5 opacity-60 text-right">${msg.time}</span>
            </div>
            ${!isAI ? `<div class="w-8 h-8 rounded-xl bg-[#0f172a] text-white border border-[#1e293b] flex items-center justify-center text-xs font-bold flex-shrink-0">${(user?.name || 'G').charAt(0).toUpperCase()}</div>` : ''}
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
'@

$newChatSection = @'
    /* AI Coach Chat (Completely Unrestricted for Any Question) */
    function renderChatMessages() {
      const user = getActiveUser();
      const containers = [
        document.getElementById('chat-messages'),
        document.getElementById('homepage-chat-messages')
      ].filter(Boolean);
      if (containers.length === 0) return;

      const history = user?.chatHistory || [
        { role: 'assistant', text: 'Hello! I am your personal FitBuddy AI Coach. What fitness, diet, or nutrition question can I help you with today?', time: 'Now' }
      ];

      containers.forEach(container => {
        container.innerHTML = history.map(msg => {
          const isAI = msg.role === 'assistant';
          return `
            <div class="flex gap-2.5 ${isAI ? '' : 'justify-end'}">
              ${isAI ? `<div class="w-7 h-7 rounded-lg bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.2)]">🤖</div>` : ''}
              <div class="max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${isAI ? 'bg-[#030712] border border-[#1e293b] text-[#C4C4C4]' : 'bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white font-medium shadow-[0_0_12px_rgba(6,182,212,0.2)]'}">
                <p class="whitespace-pre-line">${msg.text}</p>
                <span class="block text-[9px] mt-1 text-[#C4C4C4]/60 text-right">${msg.time}</span>
              </div>
              ${!isAI ? `<div class="w-7 h-7 rounded-lg bg-[#0f172a] border border-[#1e293b] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">${(user?.name || 'G').charAt(0).toUpperCase()}</div>` : ''}
            </div>
          `;
        }).join('');
        container.scrollTop = container.scrollHeight;
      });
    }

    function askCoachPrompt(promptText) {
      const hp = document.getElementById('homepage-coach-input');
      const cp = document.getElementById('coach-input');
      if (hp) hp.value = promptText;
      if (cp) cp.value = promptText;
      handleSendChat(new Event('submit'));
    }

    function handleSendChat(e) {
      if (e) e.preventDefault();
      const hp = document.getElementById('homepage-coach-input');
      const cp = document.getElementById('coach-input');
      const text = (hp && hp.value.trim()) ? hp.value.trim() : (cp ? cp.value.trim() : '');
      if (!text) return;

      const user = getActiveUser();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append user msg
      updateActiveUser(u => {
        if (!u.chatHistory) u.chatHistory = [];
        u.chatHistory.push({ role: 'user', text, time: timeStr });
      });

      if (hp) hp.value = '';
      if (cp) cp.value = '';
      renderChatMessages();

      // Generate natural, unrestricted AI response
      setTimeout(() => {
        const reply = generateAIResponse(text, user);
        updateActiveUser(u => {
          u.chatHistory.push({ role: 'assistant', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        });
        renderChatMessages();
      }, 350);
    }

    function toggleMobileSidebar() {
      const sb = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sb) {
        sb.classList.toggle('-translate-x-full');
        if (backdrop) backdrop.classList.toggle('hidden');
      }
    }

    function handleGlobalSearch(event) {
      if (event.key === 'Enter') {
        const input = document.getElementById('global-search');
        if (!input) return;
        const val = input.value.trim();
        if (!val) return;
        const q = val.toLowerCase();
        if (q.includes('diet') || q.includes('meal') || q.includes('food') || q.includes('calorie') || q.includes('paneer') || q.includes('roti')) {
          switchTab('diet');
        } else if (q.includes('workout') || q.includes('exercise') || q.includes('squat') || q.includes('push') || q.includes('gym')) {
          switchTab('workout');
        } else {
          askCoachPrompt(val);
          switchTab('dashboard');
        }
      }
    }
'@

$tail = [regex]::Replace($tail, '/\* AI Coach Chat \(Completely Unrestricted for Any Question\) \*/[\s\S]*?function handleSendChat\(e\)\s*\{[\s\S]*?renderChatMessages\(\);\s*\}, 400\);\s*\}', $newChatSection)

Write-Host "Tail processed with all updated handlers."
$tail | Set-Content -Path "C:\Users\asus\.gemini\antigravity\scratch\fitbuddy-ai\scratch\tail_processed.txt"
