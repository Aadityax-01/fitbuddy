import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const STORAGE_KEY = 'fitbuddy_session';       // active session
const REGISTRY_KEY = 'fitbuddy_registry';     // all registered users (email → userData)

// Registry helpers — multi-user support stored in browser
const loadRegistry = () => {
  try {
    const r = localStorage.getItem(REGISTRY_KEY);
    return r ? JSON.parse(r) : {};
  } catch { return {}; }
};

const saveToRegistry = (userData) => {
  const registry = loadRegistry();
  const key = userData.email.toLowerCase().trim();
  // Store with hashed-like password (we store it separately, not in session state)
  registry[key] = {
    ...userData,
    _password: userData._password || null, // store hashed separately
  };
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
};

const DEFAULT_PROFILE = {
  age: null,
  gender: null,
  height: null,
  weight: null,
  targetWeight: null,
  activityLevel: 'moderate',
  goal: 'maintain',
  dietType: 'non-vegetarian',
  cuisine: 'indian',
  allergies: [],
  equipment: 'both',
  dailyCalorieGoal: null,
  dailyWaterGoal: null,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Hydrate from session on mount ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Persist active session ── */
  const persist = useCallback((userData) => {
    if (userData) {
      // Never store passwords in the session
      const sessionData = { ...userData };
      delete sessionData._password;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      setUser(sessionData);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }, []);

  /* ── Login ── */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (!email || !password) {
      setLoading(false);
      throw new Error('Email and password are required');
    }

    const emailKey = email.toLowerCase().trim();
    const registry = loadRegistry();
    const registeredUser = registry[emailKey];

    if (!registeredUser) {
      setLoading(false);
      throw new Error('No account found with this email. Please register first.');
    }

    // Check password (stored as plain text in demo mode — replace with bcrypt in production)
    if (registeredUser._password && registeredUser._password !== password) {
      setLoading(false);
      throw new Error('Incorrect password. Please try again.');
    }

    const userData = {
      ...registeredUser,
      token: `session_${Date.now()}`,
    };
    persist(userData);
    setLoading(false);
    return userData;
  }, [persist]);

  /* ── Signup ── */
  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    if (!name || !email || !password) {
      setLoading(false);
      throw new Error('All fields are required');
    }
    if (password.length < 6) {
      setLoading(false);
      throw new Error('Password must be at least 6 characters');
    }

    const emailKey = email.toLowerCase().trim();
    const registry = loadRegistry();

    // Prevent duplicate email registrations
    if (registry[emailKey]) {
      setLoading(false);
      throw new Error('An account with this email already exists. Please log in.');
    }

    const userData = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: emailKey,
      avatar: null,
      memberSince: new Date().toISOString(),
      profile: { ...DEFAULT_PROFILE },
      token: `session_${Date.now()}`,
      isNewUser: true,
      onboardingCompleted: false,
      _password: password, // Store password in registry only
    };

    // Save to registry (persistent, survives session changes)
    saveToRegistry(userData);

    // Persist session (without password)
    persist(userData);
    setLoading(false);
    return userData;
  }, [persist]);

  /* ── Logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  /* ── Update profile ── */
  const updateProfile = useCallback((data) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        isNewUser: false,
        onboardingCompleted: true,
        profile: { ...prev.profile, ...(data.profile || data || {}) },
      };
      const sessionData = { ...updated };
      delete sessionData._password;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

      // Also update registry so profile persists across logouts
      const registry = loadRegistry();
      const emailKey = prev.email.toLowerCase().trim();
      if (registry[emailKey]) {
        registry[emailKey] = { ...registry[emailKey], ...updated };
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
      }
      return sessionData;
    });
  }, []);

  /* ── Update basic info (name/email) ── */
  const updateUser = useCallback((data) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      const sessionData = { ...updated };
      delete sessionData._password;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

      // Update registry too
      const registry = loadRegistry();
      const emailKey = prev.email.toLowerCase().trim();
      if (registry[emailKey]) {
        registry[emailKey] = { ...registry[emailKey], ...data };
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
      }
      return sessionData;
    });
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    hasCompletedOnboarding: !!(user && (user.onboardingCompleted || !user.isNewUser)),
    login,
    signup,
    logout,
    updateProfile,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
