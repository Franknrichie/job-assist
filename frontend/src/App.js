import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EvaluationResultsPage from './pages/EvaluationResultsPage';
import EvaluationHistoryPage from './pages/EvaluationHistoryPage';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<EvaluationResultsPage />} />
        <Route path="/history" element={<EvaluationHistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;