import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import useAuth from "./hooks/useAuth";
import EvaluationResultsPage from './pages/EvaluationResultsPage';
import EvaluationHistoryPage from './pages/EvaluationHistoryPage';

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<EvaluationResultsPage />} />
        <Route path="/history" element={<EvaluationHistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;