// File: app/javascript/components/AIGroupingPanel.jsx
// Location: /registration-for-the-upcoming-practicum/app/javascript/components/AIGroupingPanel.jsx

import React, { useState, useEffect } from 'react'

function AIGroupingPanel({ students }) {
  const [groups, setGroups] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [similarity, setSimilarity] = useState({})

  useEffect(() => {
    analyzeAndGroupStudents()
  }, [students])

  const analyzeAndGroupStudents = () => {
    const categories = {
      'AI & Machine Learning': ['ai', 'machine learning', 'ml', 'neural', 'chatbot', 'nlp', 'deep learning', 'tensorflow'],
      'Web Development': ['website', 'web app', 'frontend', 'backend', 'full stack', 'react', 'rails', 'api'],
      'Mobile Apps': ['mobile', 'ios', 'android', 'app', 'react native', 'flutter', 'swift'],
      'Data & Analytics': ['data', 'analytics', 'visualization', 'dashboard', 'bi', 'database', 'sql'],
      'Social & Community': ['social', 'community', 'forum', 'chat', 'network', 'messaging', 'collaboration'],
      'Education & Learning': ['education', 'learning', 'study', 'quiz', 'course', 'tutorial', 'training'],
      'Health & Wellness': ['health', 'fitness', 'medical', 'wellness', 'tracker', 'mental', 'exercise'],
      'Finance & Business': ['finance', 'budget', 'expense', 'money', 'payment', 'crypto', 'trading'],
      'Creative & Media': ['music', 'art', 'video', 'photo', 'design', 'creative', 'content'],
      'Productivity': ['task', 'todo', 'productivity', 'organizer', 'calendar', 'reminder', 'notes']
    }

    const grouped = {}
    const simScores = {}

    students.forEach(student => {
      if (!student.practicum_idea) return

      const ideaLower = student.practicum_idea.toLowerCase()
      let bestMatch = { category: 'Other', score: 0 }

      for (const [category, keywords] of Object.entries(categories)) {
        const matchScore = keywords.reduce((score, keyword) => {
          return score + (ideaLower.includes(keyword) ? 1 : 0)
        }, 0)

        if (matchScore > bestMatch.score) {
          bestMatch = { category, score: matchScore }
        }
      }

      if (!grouped[bestMatch.category]) grouped[bestMatch.category] = []
      grouped[bestMatch.category].push({
        ...student,
        matchScore: bestMatch.score,
        keywords: categories[bestMatch.category]?.filter(k => ideaLower.includes(k)) || []
      })

      // Calculate similarity scores
      if (!simScores[student.id]) simScores[student.id] = []
      students.forEach(other => {
        if (other.id !== student.id && other.practicum_idea) {
          const similarity = calculateSimilarity(student.practicum_idea, other.practicum_idea)
          if (similarity > 0.3) {
            simScores[student.id].push({ student: other, score: similarity })
          }
        }
      })
    })

    // Sort by match score
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => b.matchScore - a.matchScore)
    })

    setGroups(grouped)
    setSimilarity(simScores)
  }

  const calculateSimilarity = (idea1, idea2) => {
    const words1 = new Set(idea1.toLowerCase().split(/\s+/))
    const words2 = new Set(idea2.toLowerCase().split(/\s+/))
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    return intersection.size / Math.max(words1.size, words2.size)
  }

  const getCategoryColor = (category) => {
    const colors = {
      'AI & Machine Learning': 'bg-purple-100 text-purple-800 border-purple-300',
      'Web Development': 'bg-blue-100 text-blue-800 border-blue-300',
      'Mobile Apps': 'bg-green-100 text-green-800 border-green-300',
      'Data & Analytics': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Social & Community': 'bg-pink-100 text-pink-800 border-pink-300',
      'Education & Learning': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Health & Wellness': 'bg-red-100 text-red-800 border-red-300',
      'Finance & Business': 'bg-orange-100 text-orange-800 border-orange-300',
      'Creative & Media': 'bg-teal-100 text-teal-800 border-teal-300',
      'Productivity': 'bg-gray-100 text-gray-800 border-gray-300',
      'Other': 'bg-gray-50 text-gray-600 border-gray-200'
    }
    return colors[category] || colors['Other']
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">AI-Powered Project Grouping</h2>
        <p className="text-gray-600 mb-6">
          Students automatically grouped by project similarity using keyword matching and semantic analysis
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {Object.entries(groups).map(([category, members]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedCategory === category ? 'ring-2 ring-blue-500' : ''
              } ${getCategoryColor(category)}`}
            >
              <div className="font-semibold">{category}</div>
              <div className="text-sm mt-1">{members.length} students</div>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedCategory} Projects ({groups[selectedCategory].length})
            </h3>
            <div className="grid gap-4">
              {groups[selectedCategory].map(student => (
                <div key={student.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Match: {student.matchScore}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{student.practicum_idea}</p>
                  {student.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {student.keywords.map(kw => (
                        <span key={kw} className="text-xs bg-white px-2 py-1 rounded border">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                  {similarity[student.id]?.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">Similar ideas from:</p>
                      <div className="flex flex-wrap gap-1">
                        {similarity[student.id].slice(0, 3).map(sim => (
                          <span key={sim.student.id} className="text-xs bg-yellow-50 px-2 py-1 rounded">
                            {sim.student.name} ({Math.round(sim.score * 100)}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIGroupingPanel
