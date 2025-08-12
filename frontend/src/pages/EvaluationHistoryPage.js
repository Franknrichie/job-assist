import React, { useEffect, useState } from "react";
import { fetchResults } from "../api";
import { useAuth } from "../context/AuthContext";
import HistoryTable from "../components/HistoryTable";
import { useNavigate } from "react-router-dom";

export default function EvaluationHistoryPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until we know if user exists
    if (user === null) return; // Still loading auth state
    if (!user) {
      navigate("/");
      return;
    }

    const loadHistory = async () => {
      try {
        const data = await fetchResults(user.id, user.token);
        // Adjust depending on backend shape
        setRecords(data.results || data || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user, navigate]);

  if (loading) {
    return <div className="container-xl mt-4">Loading...</div>;
  }

  return (
    <div className="container-xl mt-4">
      <h2>Evaluation History</h2>
      {records.length > 0 ? (
        <HistoryTable records={records} />
      ) : (
        <p>No records found.</p>
      )}
    </div>
  );
}
