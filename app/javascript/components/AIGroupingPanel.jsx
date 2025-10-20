// File: app/javascript/components/AIGroupingPanel.jsx
// Location: /registration-for-the-upcoming-practicum/app/javascript/components/AIGroupingPanel.jsx

import React, { useState, useEffect } from 'react';

export default function AIGroupingPanel() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAnalyzed, setLastAnalyzed] = useState(null);

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

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setGroups(data.groups);
      setLastAnalyzed(new Date(data.analyzed_at));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-grouping-panel">
      <div className="panel-header">
        <h2>🤖 AI-Powered Project Grouping</h2>
        <p>Multi-agent analysis using OpenAI & Anthropic</p>
      </div>

      <button
        onClick={analyzeWithAI}
        disabled={loading}
        className="analyze-btn"
      >
        {loading ? '⏳ Analyzing...' : '🔍 Analyze with AI'}
      </button>

      {error && (
        <div className="error-box">
          ❌ {error}
        </div>
      )}

      {lastAnalyzed && (
        <div className="last-analyzed">
          Last analyzed: {lastAnalyzed.toLocaleString()}
        </div>
      )}

      <div className="groups-grid">
        {groups.map((group, idx) => (
          <div key={idx} className="group-card">
            <h3>{group.category}</h3>
            <div className="student-count">
              {group.student_ids.length} student{group.student_ids.length !== 1 ? 's' : ''}
            </div>
            {group.similarity_reason && (
              <p className="reason">{group.similarity_reason}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
