import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

/* ─── Lazy-loaded pages ──────────────────────────────────────────────────── */
const LandingPage        = lazy(() => import('./pages/LandingPage'));
const LoginPage          = lazy(() => import('./pages/LoginPage'));
const SignupPage         = lazy(() => import('./pages/SignupPage'));
const OnboardingPage     = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage      = lazy(() => import('./pages/DashboardPage'));
const BMICalculatorPage  = lazy(() => import('./pages/BMICalculatorPage'));
const DietPlannerPage    = lazy(() => import('./pages/DietPlannerPage'));
const WorkoutPlannerPage = lazy(() => import('./pages/WorkoutPlannerPage'));
const FoodTrackerPage    = lazy(() => import('./pages/FoodTrackerPage'));
const WaterTrackerPage   = lazy(() => import('./pages/WaterTrackerPage'));
const ChatbotPage        = lazy(() => import('./pages/ChatbotPage'));
const ProgressPage       = lazy(() => import('./pages/ProgressPage'));
const ProfilePage        = lazy(() => import('./pages/ProfilePage'));

/* ─── Full-screen loader ─────────────────────────────────────────────────── */
const FullPageLoader = () => (
  <div
    className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50"
    style={{ backgroundColor: '#0a0a0a' }}
  >
    <div className="relative w-16 h-16">
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: '#39ff14',
          borderRightColor: 'rgba(57, 255, 20, 0.3)',
          animationDuration: '0.8s',
        }}
      />
      <div
        className="absolute inset-3 rounded-full"
        style={{ backgroundColor: 'rgba(57, 255, 20, 0.08)' }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center text-xl font-black"
        style={{ color: '#39ff14' }}
      >
        ⚡
      </div>
    </div>
    <p
      className="text-xs font-semibold tracking-widest uppercase"
      style={{ color: '#9ca3af' }}
    >
      FitBuddy AI Loading…
    </p>
  </div>
);

const PageSuspense = ({ children }) => (
  <Suspense fallback={<FullPageLoader />}>{children}</Suspense>
);

/* ─── Authenticated layout wrapper ──────────────────────────────────────── */
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <Layout userName={user?.name ? user.name.split(' ')[0] : 'Athlete'}>
      {children}
    </Layout>
  );
};

/* ─── Protected route guard ──────────────────────────────────────────────── */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/* ─── Public route guard (redirect authenticated users away from login/signup) ── */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ─── Route definitions ──────────────────────────────────────────────────── */
const AppRoutes = () => (
  <Routes>
    {/* ── Public / unauthenticated ── */}
    <Route
      path="/"
      element={
        <PageSuspense>
          <LandingPage />
        </PageSuspense>
      }
    />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <PageSuspense>
            <LoginPage />
          </PageSuspense>
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <PageSuspense>
            <SignupPage />
          </PageSuspense>
        </PublicRoute>
      }
    />

    {/* ── Onboarding (authenticated, standalone flow) ── */}
    <Route
      path="/onboarding"
      element={
        <ProtectedRoute>
          <PageSuspense>
            <OnboardingPage />
          </PageSuspense>
        </ProtectedRoute>
      }
    />

    {/* ── Authenticated App Pages with TopBar + Sidebar Shell ── */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <DashboardPage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/bmi-calculator"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <BMICalculatorPage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/diet-planner"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <DietPlannerPage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/workout-planner"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <WorkoutPlannerPage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/food-tracker"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <FoodTrackerPage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/water-tracker"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <WaterTrackerPage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/chatbot"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <ChatbotPage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/progress"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <ProgressPage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PageSuspense>
              <ProfilePage />
            </PageSuspense>
          </AppLayout>
        </ProtectedRoute>
      }
    />

    {/* ── Route Aliases & Redirects ── */}
    <Route path="/bmi" element={<Navigate to="/bmi-calculator" replace />} />
    <Route path="/diet" element={<Navigate to="/diet-planner" replace />} />
    <Route path="/workout" element={<Navigate to="/workout-planner" replace />} />
    <Route path="/food" element={<Navigate to="/food-tracker" replace />} />
    <Route path="/water" element={<Navigate to="/water-tracker" replace />} />
    <Route path="/ai-coach" element={<Navigate to="/chatbot" replace />} />
    <Route path="/chat" element={<Navigate to="/chatbot" replace />} />
    <Route path="/settings" element={<Navigate to="/profile" replace />} />

    {/* ── 404 Catch-All ── */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
