import React, { useState, useEffect } from 'react';

export default function AIGroupingPanel() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastAnalyzed, setLastAnalyzed] = useState(null);

  useEffect(() => {
    analyzeWithAI();
  }, []);

  const analyzeWithAI = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai_groupings/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Analysis failed: ${response.status} - ${text}`);
      }

      const data = await response.json();
      console.log('AI Analysis Data:', data);

      if (data.groups && Array.isArray(data.groups)) {
        setGroups(data.groups);
        setLastAnalyzed(new Date(data.analyzed_at));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('AI Analysis Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="ai-grouping-panel"><p>⏳ Analyzing...</p></div>;
  if (error) return <div className="ai-grouping-panel"><div className="error-box">❌ {error}</div></div>;

  return (
    <div className="ai-grouping-panel">
      <div className="panel-header">
        <h2>🤖 AI-Powered Project Grouping</h2>
        <p>Students automatically grouped by project similarity using keyword matching and semantic analysis</p>
      </div>

      <button onClick={analyzeWithAI} disabled={loading} className="analyze-btn">
        🔍 Analyze with AI
      </button>

      {lastAnalyzed && (
        <div className="last-analyzed">
          Last analyzed: {lastAnalyzed.toLocaleString()}
        </div>
      )}

      <div className="groups-grid">
        {groups.length > 0 ? (
          groups.map((group, idx) => (
            <div key={idx} className="group-card">
              <h3>{group.category}</h3>
              <div className="student-count">
                {group.student_ids?.length || 0} student{group.student_ids?.length !== 1 ? 's' : ''}
              </div>
              {group.similarity_reason && (
                <p className="reason">{group.similarity_reason}</p>
              )}
            </div>
          ))
        ) : (
          <p>No groups to display</p>
        )}
      </div>
    </div>
  );
}
