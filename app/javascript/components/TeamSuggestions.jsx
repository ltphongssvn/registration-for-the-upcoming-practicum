// File: app/javascript/components/TeamSuggestions.jsx
// Location: /registration-for-the-upcoming-practicum/app/javascript/components/TeamSuggestions.jsx

import React, { useState, useEffect } from 'react'

function TeamSuggestions({ students }) {
  const [teams, setTeams] = useState([])
  const [teamSize, setTeamSize] = useState(5)

  useEffect(() => {
    generateTeams()
  }, [students, teamSize])

  const generateTeams = () => {
    const ready = students.filter(s => s.availability && s.completed_prerequisites)
    if (ready.length === 0) return

    // Group by project similarity first
    const projectGroups = {}
    const categories = {
      'ai': ['ai', 'machine learning', 'ml', 'neural', 'chatbot'],
      'web': ['website', 'web app', 'frontend', 'backend', 'rails'],
      'mobile': ['mobile', 'ios', 'android', 'app'],
      'data': ['data', 'analytics', 'visualization', 'dashboard'],
      'social': ['social', 'community', 'forum', 'chat']
    }

    ready.forEach(student => {
      const idea = (student.practicum_idea || '').toLowerCase()
      let category = 'other'

      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(kw => idea.includes(kw))) {
          category = cat
          break
        }
      }

      if (!projectGroups[category]) projectGroups[category] = []
      projectGroups[category].push(student)
    })

    // Create balanced teams
    const suggestedTeams = []
    Object.entries(projectGroups).forEach(([category, groupStudents]) => {
      const shuffled = [...groupStudents].sort(() => Math.random() - 0.5)

      while (shuffled.length >= teamSize - 1) {
        const team = shuffled.splice(0, teamSize)
        suggestedTeams.push({
          id: suggestedTeams.length + 1,
          category,
          members: team,
          commonInterests: analyzeCommonInterests(team),
          diversity: calculateDiversity(team)
        })
      }

      // Handle remaining students
      if (shuffled.length > 0 && suggestedTeams.length > 0) {
        suggestedTeams[suggestedTeams.length - 1].members.push(...shuffled)
      }
    })

    setTeams(suggestedTeams)
  }

  const analyzeCommonInterests = (members) => {
    const words = members.flatMap(m =>
      (m.practicum_idea || '').toLowerCase().split(/\s+/)
    )
    const frequency = {}
    words.forEach(word => {
      if (word.length > 3) frequency[word] = (frequency[word] || 0) + 1
    })
    return Object.entries(frequency)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word)
  }

  const calculateDiversity = (members) => {
    const cohorts = new Set(members.map(m => m.cohort)).size
    return {
      cohortDiversity: cohorts,
      skillBalance: cohorts > 1 ? 'High' : 'Low'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">AI-Generated Team Suggestions</h2>
            <p className="text-gray-600 mt-1">Teams formed based on project similarity and skill diversity</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Team Size:</label>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="border rounded px-3 py-1"
            >
              {[4, 5, 6].map(size => (
                <option key={size} value={size}>{size} members</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6">
          {teams.map(team => (
            <div key={team.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Team {team.id}: {team.category.toUpperCase()} Focus
                  </h3>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600">
                      {team.members.length} members
                    </span>
                    <span className="text-gray-600">
                      Cohort Diversity: {team.diversity.skillBalance}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  team.members.length === teamSize
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {team.members.length === teamSize ? 'Optimal Size' : 'Adjusted Size'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {team.members.map(member => (
                  <div key={member.id} className="bg-gray-50 rounded p-3">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.cohort}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {member.practicum_idea}
                    </div>
                  </div>
                ))}
              </div>

              {team.commonInterests.length > 0 && (
                <div className="pt-4 border-t">
                  <span className="text-sm text-gray-600">Common interests: </span>
                  {team.commonInterests.map(interest => (
                    <span key={interest} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No teams can be formed yet.</p>
            <p className="text-sm mt-2">Need more students with completed prerequisites.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamSuggestions
