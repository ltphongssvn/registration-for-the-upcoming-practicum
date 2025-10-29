// File: app/javascript/components/RegistrationForm.jsx
// Location: /registration-for-the-upcoming-practicum/app/javascript/components/RegistrationForm.jsx

import React, { useState, useEffect } from 'react'

function RegistrationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cohort: '',
    practicum_idea: '',
    availability: false,
    completed_prerequisites: false
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [cohortOptions, setCohortOptions] = useState([])
  const [loadingCohorts, setLoadingCohorts] = useState(true)

  useEffect(() => {
    fetch('/registrations/cohorts.json')
      .then(res => res.json())
      .then(data => {
        setCohortOptions(data.cohorts || [])
        setLoadingCohorts(false)
      })
      .catch(err => {
        console.error('Failed to load cohorts:', err)
        setLoadingCohorts(false)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.cohort) newErrors.cohort = 'Cohort is required'
    if (!formData.practicum_idea.trim()) newErrors.practicum_idea = 'Project idea is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/registrations.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content
        },
        body: JSON.stringify({ student: formData })
      })

      if (response.ok) {
        setFormData({
          name: '',
          email: '',
          cohort: '',
          practicum_idea: '',
          availability: false,
          completed_prerequisites: false
        })
        onSuccess && onSuccess()
      } else {
        const data = await response.json()
        setErrors(data.errors || { general: 'Something went wrong' })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const ideaSuggestions = [
    'AI-powered study buddy for coding',
    'Community forum for CTD students',
    'Project portfolio showcase platform',
    'Expense tracker with budget insights',
    'Recipe sharing social network',
    'Mental wellness tracking app',
    'Local event discovery platform',
    'Habit building gamification app'
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Register for Practicum</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cohort * (Last 10 years available)
            </label>
            <select
              name="cohort"
              value={formData.cohort}
              onChange={handleChange}
              disabled={loadingCohorts}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.cohort ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">
                {loadingCohorts ? 'Loading cohorts...' : 'Select your cohort from the last 10 years'}
              </option>
              {cohortOptions.map((cohort, idx) => (
                <option key={idx} value={cohort}>
                  {cohort}
                </option>
              ))}
            </select>
            {errors.cohort && <p className="mt-1 text-sm text-red-600">{errors.cohort}</p>}
            {!loadingCohorts && cohortOptions.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {cohortOptions.length} cohorts available spanning 10 years with multiple tracks
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Practicum Project Idea *
            </label>
            <textarea
              name="practicum_idea"
              value={formData.practicum_idea}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your app idea..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.practicum_idea ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.practicum_idea && <p className="mt-1 text-sm text-red-600">{errors.practicum_idea}</p>}

            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Need inspiration? Here are some ideas:</p>
              <div className="flex flex-wrap gap-2">
                {ideaSuggestions.slice(0, 4).map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, practicum_idea: idea }))}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                I am available for the 10-week practicum (Dec 1st - Feb 9th)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="completed_prerequisites"
                checked={formData.completed_prerequisites}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                I have completed React and Node/Express classes, or Rails class
              </span>
            </label>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm
