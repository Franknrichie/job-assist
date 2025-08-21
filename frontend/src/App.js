import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { useAuth } from "./context/AuthContext";
import AuthModalsHost from './components/AuthModalHost';
import EvaluationResultsPage from './pages/EvaluationResultsPage';
import EvaluationHistoryPage from './pages/EvaluationHistoryPage';

function useGuest() {
  return typeof window !== 'undefined' && sessionStorage.getItem('alignai_guest') === '1';
}

function RequireAccess({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const guest = useGuest();

  if (!isAuthenticated && !guest) {
    return <Navigate to="/welcome" replace state={{ from: location }} />;
  }
  return children;
}

function AppChrome({ children }) {
  const location = useLocation();
  const hideNav = location.pathname === '/welcome';
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      sessionStorage.removeItem('alignai_guest');
      navigate('/welcome', { replace: true });
    }
  };

  return (
    <>
      <AuthModalsHost />
      {!hideNav && <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <AppChrome>
      <Routes>
        {/* Public landing page */}
        <Route path="/welcome" element={<LandingPage />} />

        {/* Gated routes */}
        <Route
          path="/"
          element={
            <RequireAccess>
              <Home />
            </RequireAccess>
          }
        />
        <Route
          path="/results"
          element={
            <RequireAccess>
              <EvaluationResultsPage />
            </RequireAccess>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAccess>
              <EvaluationHistoryPage />
            </RequireAccess>
          }
        />

        {/* Fallback to welcome */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </AppChrome>
  );
}
