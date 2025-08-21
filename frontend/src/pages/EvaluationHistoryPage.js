import React, { useEffect, useState } from 'react';
import { fetchResults } from '../api';
import { useAuth } from "../context/AuthContext";
import HistoryTable from '../components/HistoryTable';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from "../utils/useDocumentTitle";

export default function EvaluationHistoryPage() {
  useDocumentTitle("AlignAI | History");

  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadRecords = async () => {
    try {
      const data = await fetchResults(user.user_id, user.token);
      const rows = (data.results || []).slice().sort((a, b) => {
        const da = a.created_at ? Date.parse(a.created_at) : 0;
        const db = b.created_at ? Date.parse(b.created_at) : 0;
        return db - da; // newest first
      });
      setRecords(rows);
    } catch (e) {
      console.error('Failed to fetch history:', e);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return navigate('/');
    loadRecords();
  }, [user, navigate]);

  if (loading) return <div className="container-xl mt-4">Loading...</div>;

  return (
    <div className="container-xl mt-4">
      <h2>Evaluation History</h2>
      {records.length ? (
        <HistoryTable 
          records={records} 
          userId={user.user_id} 
          onRecordDeleted={loadRecords}
        />
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );
}
