import React, { useEffect, useState } from 'react';
import { fetchResults } from '../api';
import useAuth from '../hooks/useAuth';
import HistoryTable from '../components/HistoryTable';
import { useNavigate } from 'react-router-dom';

export default function EvaluationHistoryPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/');
    fetchResults(user.id, user.token).then(data => setRecords(data));
  }, [user, navigate]);

  return (
    <div className="container-xl mt-4">
      <h2>Evaluation History</h2>
      <HistoryTable records={records} />
    </div>
  );
}