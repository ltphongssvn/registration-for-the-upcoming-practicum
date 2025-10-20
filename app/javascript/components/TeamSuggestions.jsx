// File: app/javascript/components/TeamSuggestions.jsx
// Location: /registration-for-the-upcoming-practicum/app/javascript/components/TeamSuggestions.jsx

import React, { useState } from 'react';

export default function TeamSuggestions() {
  const [teams, setTeams] = useState([]);
  const [teamSize, setTeamSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTeams = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai_groupings/suggest_teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({ team_size: teamSize })
      });

      if (!response.ok) throw new Error('Team generation failed');

      const data = await response.json();
      setTeams(data.teams);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-suggestions">
      <h2>🤖 AI-Generated Team Suggestions</h2>
      <p>Balanced teams using multi-agent AI analysis</p>

      <div className="controls">
        <label>
          Team Size:
          <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)}>
            <option value="4">4 members</option>
            <option value="5">5 members</option>
            <option value="6">6 members</option>
          </select>
        </label>

        <button onClick={generateTeams} disabled={loading}>
          {loading ? '⏳ Generating...' : '✨ Generate Teams'}
        </button>
      </div>

      {error && <div className="error-box">❌ {error}</div>}

      <div className="teams-list">
        {teams.map((team, idx) => (
          <div key={idx} className="team-card">
            <h3>Team {team.team_number}</h3>
            <div className="member-count">{team.student_ids.length} members</div>
            <p className="rationale">{team.rationale}</p>
          </div>
        ))}
      </div>

      {teams.length === 0 && !loading && (
        <div className="empty-state">
          Click "Generate Teams" to create AI-powered team suggestions
        </div>
      )}
    </div>
  );
}
