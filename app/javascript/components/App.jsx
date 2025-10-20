// File: app/javascript/components/App.jsx
// Location: /registration-for-the-upcoming-practicum/app/javascript/components/App.jsx

import React, { useState, useEffect } from 'react'
import RegistrationDashboard from './RegistrationDashboard'
import RegistrationForm from './RegistrationForm'
import AIGroupingPanel from './AIGroupingPanel'
import TeamSuggestions from './TeamSuggestions'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/registrations.json')
      const data = await response.json()
      setStudents(data)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const handleRegistrationSuccess = () => {
    fetchStudents()
    setCurrentView('dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">CTD Practicum Hub</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'register'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setCurrentView('ai-groups')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'ai-groups'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                AI Groups
              </button>
              <button
                onClick={() => setCurrentView('teams')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'teams'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Teams
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' && <RegistrationDashboard students={students} />}
            {currentView === 'register' && <RegistrationForm onSuccess={handleRegistrationSuccess} />}
            {currentView === 'ai-groups' && <AIGroupingPanel students={students} />}
            {currentView === 'teams' && <TeamSuggestions students={students} />}
          </>
        )}
      </main>
    </div>
  )
}

export default App
