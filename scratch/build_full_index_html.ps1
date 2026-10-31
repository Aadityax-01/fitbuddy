$tailContent = Get-Content -Path "C:\Users\asus\.gemini\antigravity\scratch\fitbuddy-ai\scratch\tail_processed.txt" -Raw

$headAndViews = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FitBuddy AI – Your Personal AI Fitness Companion</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    :root {
      --bg-main: #000000;
      --bg-card: #0b1329;
      --bg-card-secondary: #0f172a;
      --bg-elevated: #1e293b;
      --bg-input: #020617;
      --text-primary: #FFFFFF;
      --text-secondary: #C4C4C4;
      --text-muted: #94a3b8;
      --border-color: #1e293b;
      --border-focus: #06b6d4;
      --accent-cyan: #06b6d4;
      --accent-cyan-light: #22d3ee;
      --accent-blue: #3b82f6;
      --accent-blue-dark: #2563eb;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #000000 !important;
      color: #FFFFFF !important;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .hidden {
      display: none !important;
    }
    .neon-text {
      color: #22d3ee !important;
      text-shadow: 0 0 12px rgba(6, 182, 212, 0.4) !important;
    }
    .neon-glow {
      box-shadow: 0 0 25px rgba(6, 182, 212, 0.2) !important;
    }
    .neon-btn {
      background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%) !important;
      color: #FFFFFF !important;
      font-weight: 700 !important;
      border: 1px solid #06b6d4 !important;
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.25) !important;
      transition: all 0.15s ease !important;
    }
    .neon-btn:hover {
      background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%) !important;
      border-color: #22d3ee !important;
      box-shadow: 0 0 22px rgba(6, 182, 212, 0.45) !important;
      transform: translateY(-1px) !important;
    }
    .card-dark {
      background-color: #0b1329 !important;
      border: 1px solid #1e293b !important;
      border-radius: 16px;
      transition: all 0.2s ease !important;
    }
    .card-dark:hover {
      border-color: #06b6d4 !important;
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.15) !important;
    }
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0b1329; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }

    /* High contrast focus indicators */
    *:focus-visible, input:focus, select:focus, textarea:focus {
      outline: 2px solid #06b6d4 !important;
      outline-offset: 1px !important;
      border-color: #06b6d4 !important;
    }
  </style>
</head>
<body class="bg-[#000000] text-white min-h-screen flex antialiased">

  <!-- ========================================== -->
  <!-- 1. LEFT SIDEBAR                            -->
  <!-- ========================================== -->
  <aside id="app-sidebar" class="fixed top-0 left-0 z-50 h-full w-64 flex flex-col justify-between border-r border-[#1e293b] bg-[#030712] text-white transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0">
    <!-- Top: Logo & Navigation -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <!-- FitBuddy AI Logo -->
      <div class="flex items-center justify-between px-5 h-[68px] border-b border-[#1e293b] cursor-pointer" onclick="navigateToHome()">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#06b6d4]/20 to-[#3b82f6]/20 border border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span class="text-[#06b6d4] text-lg font-black leading-none">⚡</span>
          </div>
          <div class="flex flex-col">
            <span class="font-black text-white text-base tracking-tight leading-none">
              FitBuddy <span class="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">AI</span>
            </span>
            <span class="text-[10px] text-[#C4C4C4] font-medium tracking-wider uppercase mt-1">
              AI Fitness Companion
            </span>
          </div>
        </div>
        <!-- Close button on mobile -->
        <button onclick="toggleMobileSidebar()" class="lg:hidden p-1 text-[#C4C4C4] hover:text-white" aria-label="Close sidebar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Simplified Navigation: Home, AI Coach, Diet Planner, Workout, Progress -->
      <nav class="px-3 py-5 space-y-1.5 flex-1">
        <div class="px-3 pb-2 text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">
          Navigation
        </div>

        <button onclick="switchTab('dashboard')" id="sidebar-btn-dashboard" class="sidebar-nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-white bg-gradient-to-r from-[#06b6d4]/20 to-[#3b82f6]/10 border border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-left">
          <svg class="w-4 h-4 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="flex-1">Home</span>
        </button>

        <button onclick="switchTab('coach')" id="sidebar-btn-coach" class="sidebar-nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-transparent text-left">
          <svg class="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <span class="flex-1">AI Coach</span>
          <span class="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></span>
        </button>

        <button onclick="switchTab('diet')" id="sidebar-btn-diet" class="sidebar-nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-transparent text-left">
          <svg class="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          <span class="flex-1">Diet Planner</span>
        </button>

        <button onclick="switchTab('workout')" id="sidebar-btn-workout" class="sidebar-nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-transparent text-left">
          <svg class="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span class="flex-1">Workout</span>
        </button>

        <button onclick="switchTab('progress')" id="sidebar-btn-progress" class="sidebar-nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-transparent text-left">
          <svg class="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span class="flex-1">Progress</span>
        </button>
      </nav>
    </div>

    <!-- Bottom: Dark Mode & Guest Controls -->
    <div class="p-3 border-t border-[#1e293b] space-y-3 bg-[#030712]">
      <!-- Dark Mode Indicator Card -->
      <div class="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0b1329] border border-[#1e293b]">
        <div class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          <div class="text-left">
            <p class="text-xs font-semibold text-white leading-tight">Dark Mode</p>
            <p class="text-[10px] text-[#C4C4C4]">Pure Black #000</p>
          </div>
        </div>
        <span class="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"></span>
      </div>

      <!-- Guest / Account Control -->
      <div id="sidebar-auth-box" class="p-3 rounded-xl bg-[#0b1329] border border-[#1e293b]">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></span>
            <span id="sidebar-user-name" class="text-xs font-bold text-white">Guest Mode</span>
          </div>
          <span class="text-[10px] text-[#22d3ee] font-semibold bg-[#06b6d4]/10 px-2 py-0.5 rounded border border-[#06b6d4]/20">Full Access</span>
        </div>
        <div id="sidebar-auth-actions" class="flex items-center gap-2 pt-1 text-[11px]">
          <button onclick="openModal('register-modal')" class="flex-1 py-1.5 text-center font-bold rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white hover:opacity-90 transition-opacity">
            Register
          </button>
          <button onclick="openModal('login-modal')" class="flex-1 py-1.5 text-center font-bold rounded-lg border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-colors">
            Login
          </button>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile Overlay Backdrop -->
  <div id="sidebar-backdrop" onclick="toggleMobileSidebar()" class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm hidden lg:hidden"></div>

  <!-- Main Content Wrapper -->
  <div class="flex-1 flex flex-col min-w-0 lg:pl-64">

    <!-- ========================================== -->
    <!-- 2. TOP BAR                                 -->
    <!-- ========================================== -->
    <header id="app-topbar" class="sticky top-0 z-30 h-[68px] flex items-center justify-between px-4 sm:px-6 md:px-8 border-b border-[#1e293b] bg-[#000000]/95 backdrop-blur-md">
      <!-- Left: Mobile Menu Hamburger + Wide Search Field -->
      <div class="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
        <button onclick="toggleMobileSidebar()" class="lg:hidden p-2 rounded-xl text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-[#1e293b] transition-colors" aria-label="Toggle menu">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <!-- Wide Search Field -->
        <div class="relative w-full">
          <svg class="w-4 h-4 text-[#06b6d4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input id="global-search" type="text" placeholder="Search exercises, Indian meals, nutrients, calories..." onkeydown="handleGlobalSearch(event)" class="w-full bg-[#0b1329] border border-[#1e293b] focus:border-[#06b6d4] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-[#C4C4C4] outline-none shadow-inner transition-all focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]" />
        </div>
      </div>

      <!-- Right: Notifications & Profile Controls -->
      <div class="flex items-center gap-3 ml-4">
        <!-- Notification Bell -->
        <button class="relative p-2.5 rounded-xl text-[#C4C4C4] hover:text-white hover:bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/50 transition-all" title="Notifications">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"></span>
        </button>

        <!-- Public / Guest Buttons (When visiting without session) -->
        <div id="guest-buttons" class="flex items-center gap-2">
          <button onclick="startGuestSession()" class="neon-btn px-3.5 py-2 text-xs font-black rounded-xl shadow-sm flex items-center gap-1.5">
            <span>⚡ Continue as Guest</span>
          </button>
          <button onclick="openModal('register-modal')" class="hidden sm:inline-block px-3 py-2 text-xs font-bold rounded-xl border border-[#1e293b] bg-[#0b1329] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
            Register
          </button>
          <button onclick="openModal('login-modal')" class="px-3 py-2 text-xs font-bold rounded-xl border border-[#1e293b] bg-[#0b1329] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
            Login
          </button>
        </div>

        <!-- Active User Badge (When active session) -->
        <div id="user-badge" class="hidden flex items-center gap-2 sm:gap-3">
          <div id="guest-pill" class="hidden sm:flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full bg-[#0b1329] border border-[#06b6d4]/40 text-[#22d3ee] text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse"></span>
              Guest Mode
            </span>
          </div>

          <div id="registered-pill" class="hidden text-right sm:block">
            <p id="nav-user-name" class="text-xs font-bold text-white leading-tight">Athlete</p>
            <span class="text-[10px] text-[#06b6d4] font-medium">Synced Account</span>
          </div>

          <div id="nav-user-avatar" class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#2563eb] text-white font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            G
          </div>

          <button onclick="handleLogout()" title="Exit / Switch Account" class="p-2 rounded-xl bg-[#0b1329] hover:bg-[#1e293b] text-[#C4C4C4] hover:text-white transition-all border border-[#1e293b]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- ========================================== -->
    <!-- MAIN APP CONTAINER                         -->
    <!-- ========================================== -->
    <main class="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

      <!-- ========================================== -->
      <!-- VIEW 0: PUBLIC WELCOME PAGE                -->
      <!-- ========================================== -->
      <section id="view-public" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left: Hero + 2 Feature Cards -->
          <div class="lg:col-span-8 space-y-6">
            <!-- 3. Main Hero -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#020617] border border-[#1e293b] p-6 sm:p-8 md:p-10 shadow-[0_0_30px_rgba(6,182,212,0.08)]">
              <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="space-y-4 max-w-xl text-left">
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#22d3ee] text-xs font-bold tracking-wider uppercase">
                    <span class="w-2 h-2 rounded-full bg-[#06b6d4] animate-ping"></span>
                    <span>100% Free &amp; Unrestricted AI Fitness</span>
                  </div>

                  <div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                      FitBuddy <span class="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">AI</span>
                    </h1>
                    <p class="text-base sm:text-lg text-[#C4C4C4] font-medium mt-1.5">
                      Your personal AI fitness companion
                    </p>
                  </div>

                  <p class="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed max-w-lg">
                    Experience complete, unrestricted access to our AI Coach, Indian diet planner, smart workout generator, and macro trackers. No sign-up required to explore all features.
                  </p>

                  <div class="flex flex-wrap items-center gap-3 pt-2">
                    <button onclick="startGuestSession()" class="neon-btn px-6 py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2">
                      <span>⚡ Continue as Guest (Full Access)</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                    <button onclick="openModal('register-modal')" class="px-5 py-3.5 rounded-xl text-sm font-bold bg-[#0f172a] hover:bg-[#1e293b] border border-[#1e293b] text-white transition-all">
                      Register
                    </button>
                    <button onclick="openModal('login-modal')" class="px-5 py-3.5 rounded-xl text-sm font-bold bg-[#0b1329] hover:bg-[#1e293b] border border-[#1e293b] text-[#C4C4C4] hover:text-white transition-all">
                      Login
                    </button>
                  </div>
                </div>

                <!-- Fitness Hero Visual Graphic -->
                <div class="hidden sm:flex flex-col items-center justify-center relative w-44 h-44 flex-shrink-0">
                  <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[#06b6d4]/20 to-[#3b82f6]/20 blur-xl animate-pulse"></div>
                  <div class="relative w-36 h-36 rounded-2xl bg-[#030712] border border-[#1e293b] flex flex-col items-center justify-center p-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-center">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06b6d4]/20 to-[#3b82f6]/20 border border-[#06b6d4]/40 flex items-center justify-center mb-2">
                      <span class="text-2xl">⚡</span>
                    </div>
                    <span class="text-[11px] font-bold text-white tracking-wide">FitBuddy Intelligence</span>
                    <span class="text-[9px] text-[#22d3ee] font-medium mt-0.5">● Ready to Coach</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. Feature Cards: Side by Side beneath the hero -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <!-- Feature Card 1: AI Diet Planner -->
              <div onclick="startGuestSession('diet')" class="rounded-2xl p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between group cursor-pointer">
                <div class="space-y-3">
                  <div class="w-11 h-11 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                    <span class="text-xl">🥗</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-white group-hover:text-[#22d3ee] transition-colors">
                      AI Diet Planner
                    </h3>
                    <p class="text-xs text-[#C4C4C4] leading-relaxed mt-1">
                      Personalized Indian meal plans, smart calorie targets, and balanced macronutrient breakdowns tailored to your preferences.
                    </p>
                  </div>
                  <div class="flex items-center gap-2 pt-1 text-[11px] text-[#22d3ee]">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
                    <span>Pure Veg, Non-Veg &amp; Vegan Options</span>
                  </div>
                </div>

                <div class="pt-5">
                  <div class="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#06b6d4] to-[#2563eb] group-hover:from-[#22d3ee] group-hover:to-[#3b82f6] shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 transition-all">
                    <span>Open Diet Planner</span>
                    <span>→</span>
                  </div>
                </div>
              </div>

              <!-- Feature Card 2: Workout Generator -->
              <div onclick="startGuestSession('workout')" class="rounded-2xl p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#3b82f6]/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between group cursor-pointer">
                <div class="space-y-3">
                  <div class="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#3b82f6] flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                    <span class="text-xl">🏋️</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                      Workout Generator
                    </h3>
                    <p class="text-xs text-[#C4C4C4] leading-relaxed mt-1">
                      Dynamic routines built for home, gym, or outdoors with science-backed sets, reps, rest periods, and exercise form cues.
                    </p>
                  </div>
                  <div class="flex items-center gap-2 pt-1 text-[11px] text-[#60a5fa]">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                    <span>Home &amp; Gym Splits by Equipment</span>
                  </div>
                </div>

                <div class="pt-5">
                  <div class="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#2563eb] to-[#06b6d4] group-hover:from-[#3b82f6] group-hover:to-[#22d3ee] shadow-[0_0_15px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 transition-all">
                    <span>Generate Workout</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Right: Dedicated AI Coach Panel (On Public Page) -->
          <div class="lg:col-span-4 rounded-3xl p-5 sm:p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/40 transition-all shadow-[0_0_30px_rgba(6,182,212,0.08)] flex flex-col h-[560px] sm:h-[600px]">
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center text-lg font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  🤖
                </div>
                <div>
                  <h3 class="text-sm font-bold text-white leading-tight">AI Fitness Coach</h3>
                  <span class="flex items-center gap-1.5 text-[10px] text-[#22d3ee] font-semibold mt-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse"></span> Online &amp; Ready
                  </span>
                </div>
              </div>
            </div>

            <!-- Short introduction -->
            <p class="text-xs text-[#C4C4C4] leading-relaxed py-2.5">
              Hi! I'm your AI Coach. Ask me anything about Indian diets, exact nutrients in foods, or dynamic workout routines.
            </p>

            <!-- Suggested Prompts -->
            <div class="py-2 border-y border-[#1e293b]">
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">Suggested Prompts</p>
              <div class="flex flex-wrap gap-1.5">
                <button onclick="startGuestSession('coach'); askCoachPrompt('How much protein in 4 eggs?')" class="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
                  🥚 Protein in 4 eggs?
                </button>
                <button onclick="startGuestSession('coach'); askCoachPrompt('15-min HIIT core workout')" class="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
                  🔥 15-min HIIT core
                </button>
                <button onclick="startGuestSession('coach'); askCoachPrompt('Vegetarian muscle gain diet')" class="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
                  🍛 High-protein veg diet
                </button>
                <button onclick="startGuestSession('coach'); askCoachPrompt('How many calories in 2 bananas?')" class="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
                  🍌 Calories in 2 bananas?
                </button>
              </div>
            </div>

            <!-- Sample message teaser -->
            <div class="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 text-xs">
              <div class="flex gap-2">
                <div class="w-6 h-6 rounded-lg bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">🤖</div>
                <div class="max-w-[85%] rounded-xl p-3 leading-relaxed bg-[#030712] border border-[#1e293b] text-[#C4C4C4]">
                  Namaste! What can I help you calculate or plan today? I can answer any question regarding diet, protein, calories, and workouts!
                </div>
              </div>
            </div>

            <!-- Chat input triggering guest session -->
            <form onsubmit="event.preventDefault(); const v = document.getElementById('public-coach-input').value; startGuestSession('coach'); askCoachPrompt(v);" class="flex items-center gap-2 pt-2 border-t border-[#1e293b]">
              <input id="public-coach-input" placeholder="Ask AI Coach a question..." class="flex-1 bg-[#020617] border border-[#1e293b] focus:border-[#06b6d4] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#C4C4C4] outline-none shadow-inner" />
              <button type="submit" class="p-2.5 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white hover:opacity-90 shadow-[0_0_12px_rgba(6,182,212,0.25)] flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- VIEW 1: DASHBOARD / HOMEPAGE               -->
      <!-- ========================================== -->
      <section id="view-dashboard" class="hidden space-y-8">
        <!-- 6. INITIAL SCREEN: HERO + 2 FEATURE CARDS + DEDICATED AI COACH PANEL -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <!-- Left Column (Hero & 2 Feature Cards) -->
          <div class="lg:col-span-8 space-y-6">

            <!-- 3. Main Hero -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#020617] border border-[#1e293b] p-6 sm:p-8 md:p-10 shadow-[0_0_30px_rgba(6,182,212,0.08)]">
              <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="space-y-4 max-w-xl text-left">
                  <div class="flex items-center gap-2">
                    <span id="dash-mode-badge" class="px-2.5 py-1 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#22d3ee] text-xs font-bold uppercase tracking-wider">
                      Full Access Active
                    </span>
                    <span id="dash-date" class="text-xs text-[#94a3b8]">Today</span>
                  </div>

                  <div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                      FitBuddy <span class="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">AI</span>
                    </h1>
                    <p class="text-base sm:text-lg text-[#C4C4C4] font-medium mt-1.5">
                      Your personal AI fitness companion
                    </p>
                  </div>

                  <p id="dash-summary-text" class="text-xs sm:text-sm text-[#C4C4C4] leading-relaxed max-w-lg">
                    Complete your profile to view your exact BMI, daily calorie target, and personalized Indian nutrition plan.
                  </p>

                  <div class="flex flex-wrap items-center gap-3 pt-2">
                    <button onclick="switchTab('coach')" class="neon-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      <span>🤖 Ask AI Coach</span>
                    </button>
                    <button onclick="switchTab('diet')" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0f172a] hover:bg-[#1e293b] border border-[#1e293b] text-[#C4C4C4] hover:text-white transition-all flex items-center gap-1.5">
                      <span>Explore Diet &amp; Workouts</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                <!-- Fitness Hero Visual SVG -->
                <div class="hidden sm:flex flex-col items-center justify-center relative w-44 h-44 flex-shrink-0">
                  <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[#06b6d4]/20 to-[#3b82f6]/20 blur-xl animate-pulse"></div>
                  <div class="relative w-36 h-36 rounded-2xl bg-[#030712] border border-[#1e293b] flex flex-col items-center justify-center p-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-center">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06b6d4]/20 to-[#3b82f6]/20 border border-[#06b6d4]/40 flex items-center justify-center mb-2">
                      <span class="text-2xl">⚡</span>
                    </div>
                    <span class="text-[11px] font-bold text-white tracking-wide">FitBuddy Intelligence</span>
                    <span class="text-[9px] text-[#22d3ee] font-medium mt-0.5">● Ready to Coach</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. Feature Cards: Side by Side beneath the hero -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <!-- Feature Card 1: AI Diet Planner -->
              <div onclick="switchTab('diet')" class="rounded-2xl p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between group cursor-pointer">
                <div class="space-y-3">
                  <div class="w-11 h-11 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                    <span class="text-xl">🥗</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-white group-hover:text-[#22d3ee] transition-colors">
                      AI Diet Planner
                    </h3>
                    <p class="text-xs text-[#C4C4C4] leading-relaxed mt-1">
                      Personalized Indian meal plans, smart calorie targets, and balanced macronutrient breakdowns tailored to your preferences.
                    </p>
                  </div>
                  <div class="flex items-center gap-2 pt-1 text-[11px] text-[#22d3ee]">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
                    <span>Pure Veg, Non-Veg &amp; Vegan Options</span>
                  </div>
                </div>

                <div class="pt-5">
                  <button onclick="switchTab('diet')" class="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#06b6d4] to-[#2563eb] group-hover:from-[#22d3ee] group-hover:to-[#3b82f6] shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 transition-all">
                    <span>Open Diet Planner</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              <!-- Feature Card 2: Workout Generator -->
              <div onclick="switchTab('workout')" class="rounded-2xl p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#3b82f6]/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between group cursor-pointer">
                <div class="space-y-3">
                  <div class="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#3b82f6] flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                    <span class="text-xl">🏋️</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                      Workout Generator
                    </h3>
                    <p class="text-xs text-[#C4C4C4] leading-relaxed mt-1">
                      Dynamic routines built for home, gym, or outdoors with science-backed sets, reps, rest periods, and exercise form cues.
                    </p>
                  </div>
                  <div class="flex items-center gap-2 pt-1 text-[11px] text-[#60a5fa]">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                    <span>Home &amp; Gym Splits by Equipment</span>
                  </div>
                </div>

                <div class="pt-5">
                  <button onclick="switchTab('workout')" class="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#2563eb] to-[#06b6d4] group-hover:from-[#3b82f6] group-hover:to-[#22d3ee] shadow-[0_0_15px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 transition-all">
                    <span>Generate Workout</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Right Column: Dedicated AI Coach Panel -->
          <div class="lg:col-span-4 rounded-3xl p-5 sm:p-6 bg-[#0b1329] border border-[#1e293b] hover:border-[#06b6d4]/40 transition-all shadow-[0_0_30px_rgba(6,182,212,0.08)] flex flex-col h-[560px] sm:h-[600px]">
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] flex items-center justify-center text-lg font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  🤖
                </div>
                <div>
                  <h3 class="text-sm font-bold text-white leading-tight">AI Fitness Coach</h3>
                  <span class="flex items-center gap-1.5 text-[10px] text-[#22d3ee] font-semibold mt-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse"></span> Online &amp; Ready
                  </span>
                </div>
              </div>

              <button onclick="switchTab('coach')" class="text-xs text-[#06b6d4] hover:underline font-semibold">
                Full View ↗
              </button>
            </div>

            <!-- Short introduction -->
            <p class="text-xs text-[#C4C4C4] leading-relaxed py-2.5">
              Hi! I'm your AI Coach. Ask me anything about Indian diets, exact nutrients in foods, or dynamic workout routines.
            </p>

            <!-- Suggested Prompts -->
            <div class="py-2 border-y border-[#1e293b]">
              <p class="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">Suggested Prompts</p>
              <div class="flex flex-wrap gap-1.5">
                <button onclick="askCoachPrompt('How much protein in 4 eggs?')" class="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
                  🥚 Protein in 4 eggs?
                </button>
                <button onclick="askCoachPrompt('15-min HIIT core workout')" class="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
                  🔥 15-min HIIT core
                </button>
                <button onclick="askCoachPrompt('Vegetarian muscle gain diet')" class="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
                  🍛 High-protein veg diet
                </button>
                <button onclick="askCoachPrompt('How many calories in 2 bananas?')" class="text-[11px] px-2.5 py-1 rounded-lg bg-[#030712] border border-[#1e293b] text-[#C4C4C4] hover:text-white hover:border-[#06b6d4] transition-all">
                  🍌 Calories in 2 bananas?
                </button>
              </div>
            </div>

            <!-- Conversation Area -->
            <div id="homepage-chat-messages" class="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 text-xs">
              <!-- Dynamically populated -->
            </div>

            <!-- Chat Input -->
            <form onsubmit="handleSendChat(event)" class="flex items-center gap-2 pt-2 border-t border-[#1e293b]">
              <input id="homepage-coach-input" placeholder="Ask AI Coach a question..." class="flex-1 bg-[#020617] border border-[#1e293b] focus:border-[#06b6d4] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#C4C4C4] outline-none shadow-inner" />
              <button type="submit" class="p-2.5 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#2563eb] text-white hover:opacity-90 shadow-[0_0_12px_rgba(6,182,212,0.25)] flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
        </div>

        <!-- 6. BELOW THE FOLD: SECONDARY METRICS, NUTRITION, HYDRATION, AND WORKOUT CHECKLIST -->
        <div class="pt-8 border-t border-[#1e293b] space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <span>📊</span> Performance &amp; Nutrition Metrics
              </h2>
              <p class="text-xs text-[#C4C4C4] mt-0.5">
                Daily calorie distribution, hydration tracking, BMI status, and today's workout checklist.
              </p>
            </div>
            <button onclick="openModal('food-modal')" class="neon-btn px-4 py-2 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5">
              <span>+ Log Meal</span>
            </button>
          </div>

          <!-- Unconfigured Profile Banner -->
          <div id="dash-profile-prompt" class="card-dark border-[#1e293b] bg-[#0b1329] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-center text-xl text-[#06b6d4]">🎯</div>
              <div>
                <h4 class="text-sm font-bold text-white">Complete Your Fitness Profile</h4>
                <p class="text-xs text-[#C4C4C4]">Enter your age, height, weight, and fitness goal to unlock your exact BMI, BMR, TDEE, and daily nutrition targets.</p>
              </div>
            </div>
            <button onclick="switchTab('profile')" class="neon-btn px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-1.5 shadow">
              <span>Set Up Profile</span> ➔
            </button>
          </div>

          <!-- Secondary Metric Stat Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Daily Calories -->
            <div class="card-dark p-5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-[#C4C4C4] uppercase tracking-wider">Calories Today</span>
                <span class="text-lg">🔥</span>
              </div>
              <div class="flex items-baseline gap-1.5">
                <span id="dash-cal-consumed" class="text-2xl font-black text-white">0</span>
                <span id="dash-cal-target" class="text-xs text-[#C4C4C4]">/ — kcal</span>
              </div>
              <div class="w-full bg-[#0f172a] rounded-full h-1.5 overflow-hidden border border-[#1e293b]">
                <div id="dash-cal-bar" class="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
              <p id="dash-cal-remaining" class="text-[11px] text-[#C4C4C4]">Set profile to calculate target</p>
            </div>

            <!-- Water Intake -->
            <div class="card-dark p-5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-[#C4C4C4] uppercase tracking-wider">Water Intake</span>
                <span class="text-lg">💧</span>
              </div>
              <div class="flex items-baseline gap-1.5">
                <span id="dash-water-consumed" class="text-2xl font-black text-white">0</span>
                <span id="dash-water-target" class="text-xs text-[#C4C4C4]">/ 2,500 ml</span>
              </div>
              <div class="w-full bg-[#0f172a] rounded-full h-1.5 overflow-hidden border border-[#1e293b]">
                <div id="dash-water-bar" class="bg-[#06b6d4] h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
              <div class="flex gap-1.5 pt-1">
                <button onclick="quickAddWater(250)" class="text-[10px] px-2 py-0.5 rounded bg-[#0f172a] hover:bg-[#1e293b] text-white border border-[#1e293b] font-bold">+250ml</button>
                <button onclick="quickAddWater(500)" class="text-[10px] px-2 py-0.5 rounded bg-[#0f172a] hover:bg-[#1e293b] text-white border border-[#1e293b] font-bold">+500ml</button>
                <button onclick="resetWater()" class="text-[10px] px-2 py-0.5 rounded bg-[#0f172a] hover:bg-[#1e293b] text-[#C4C4C4] hover:text-white border border-[#1e293b] font-bold">Reset</button>
              </div>
            </div>

            <!-- BMI Status -->
            <div class="card-dark p-5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-[#C4C4C4] uppercase tracking-wider">Body Mass Index</span>
                <span class="text-lg">⚖️</span>
              </div>
              <div class="flex items-baseline gap-1.5">
                <span id="dash-bmi-val" class="text-2xl font-black text-white">—</span>
                <span id="dash-bmi-badge" class="text-xs font-bold text-[#06b6d4] bg-[#0f172a] border border-[#1e293b] px-2 py-0.5 rounded">Pending Setup</span>
              </div>
              <p id="dash-bmi-desc" class="text-[11px] text-[#C4C4C4]">Enter height &amp; weight in Profile</p>
            </div>

            <!-- Protein Target -->
            <div class="card-dark p-5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-[#C4C4C4] uppercase tracking-wider">Protein Goal</span>
                <span class="text-lg">🥩</span>
              </div>
              <div class="flex items-baseline gap-1.5">
                <span id="dash-protein-consumed" class="text-2xl font-black text-white">0g</span>
                <span id="dash-protein-target" class="text-xs text-[#C4C4C4]">/ — g target</span>
              </div>
              <div class="w-full bg-[#0f172a] rounded-full h-1.5 overflow-hidden border border-[#1e293b]">
                <div id="dash-protein-bar" class="bg-[#3b82f6] h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
              <p class="text-[11px] text-[#C4C4C4]">Vital for athletic recovery</p>
            </div>
          </div>

          <!-- Action Section: Today's Workouts & Diet Snapshot -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Today's Workout Routine -->
            <div class="card-dark p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base font-bold text-white flex items-center gap-2">
                    <span>🏋️</span> Today's Workout Routine
                  </h3>
                  <p class="text-xs text-[#C4C4C4]">Interactive checklist for today's exercises</p>
                </div>
                <button onclick="switchTab('workout')" class="text-xs text-[#06b6d4] hover:underline font-bold">
                  View All Splits →
                </button>
              </div>

              <div id="dash-workout-list" class="space-y-2.5">
                <!-- Dynamically populated -->
              </div>
            </div>

            <!-- Recommended Indian Meal Snapshot -->
            <div class="card-dark p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base font-bold text-white flex items-center gap-2">
                    <span>🍛</span> Today's Indian Meal Plan
                  </h3>
                  <p id="dash-diet-preference-label" class="text-xs text-[#C4C4C4]">Tailored to your dietary preference</p>
                </div>
                <button onclick="switchTab('diet')" class="text-xs text-[#06b6d4] hover:underline font-bold">
                  View Full Menu →
                </button>
              </div>

              <div id="dash-diet-preview" class="grid grid-cols-2 gap-3">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>
        </div>
      </section>

'@

$finalContent = $headAndViews + $tailContent
$finalContent | Set-Content -Path "C:\Users\asus\.gemini\antigravity\scratch\fitbuddy-ai\index.html" -Encoding UTF8
$finalContent | Set-Content -Path "C:\Users\asus\.gemini\antigravity\scratch\fitbuddy-ai\preview.html" -Encoding UTF8
$finalContent | Set-Content -Path "C:\Users\asus\.gemini\antigravity\scratch\fitbuddy-ai\fitbuddy.html" -Encoding UTF8
$finalContent | Set-Content -Path "C:\Users\asus\.gemini\antigravity\brain\52853aa8-ec62-4abb-891e-7746800fbd74\fitbuddy_preview.html" -Encoding UTF8

Write-Host "Successfully built and deployed redesigned index.html, preview.html, fitbuddy.html, and fitbuddy_preview.html!"
