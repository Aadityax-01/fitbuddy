import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const STORAGE_KEY = 'fitbuddy_user';

const DEFAULT_PROFILE = {
  age: 25,
  gender: 'male',
  height: 170,
  weight: 70,
  activityLevel: 'moderate',
  goal: 'maintain',
  dietType: 'non-vegetarian',
  cuisine: 'indian',
  allergies: [],
  equipment: 'both',
  dailyCalorieGoal: 2000,
  dailyWaterGoal: 2500,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ─── Hydrate from localStorage on mount ─── */
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

  /* ─── Persist user to localStorage ─── */
  const persist = useCallback((userData) => {
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(userData);
  }, []);

  /* ─── Login ─── */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate brief network

    if (!email || !password) {
      setLoading(false);
      throw new Error('Email and password are required');
    }

    // In demo mode, hydrate or create
    const existingUser = (() => {
      try {
        const s = localStorage.getItem(STORAGE_KEY);
        return s ? JSON.parse(s) : null;
      } catch { return null; }
    })();

    const userData = existingUser || {
      id: `user_${Date.now()}`,
      name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim() || 'Alex',
      email,
      avatar: null,
      memberSince: new Date().toISOString(),
      profile: DEFAULT_PROFILE,
      token: `demo_token_${Date.now()}`,
      isNewUser: false,
      onboardingCompleted: true,
    };

    persist(userData);
    setLoading(false);
    return userData;
  }, [persist]);

  /* ─── Signup ─── */
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

    const userData = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: null,
      memberSince: new Date().toISOString(),
      profile: { ...DEFAULT_PROFILE },
      token: `demo_token_${Date.now()}`,
      isNewUser: true,
      onboardingCompleted: false,
    };

    persist(userData);
    setLoading(false);
    return userData;
  }, [persist]);

  /* ─── Logout ─── */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  /* ─── Update profile ─── */
  const updateProfile = useCallback((data) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        ...data,
        isNewUser: false,
        onboardingCompleted: true,
        profile: { ...prev.profile, ...(data.profile || data || {}) },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  /* ─── Update basic info ─── */
  const updateUser = useCallback((data) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
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
