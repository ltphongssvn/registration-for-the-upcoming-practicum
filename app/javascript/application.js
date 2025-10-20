console.log("React app loading...");
// File: app/javascript/application.js
// Location: /registration-for-the-upcoming-practicum/app/javascript/application.js

import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

// Initialize React app after Turbo loads
document.addEventListener('turbo:load', () => {
  const container = document.getElementById('react-app-root')
  if (container && !container._reactRoot) {
    const root = ReactDOM.createRoot(container)
    container._reactRoot = root
    root.render(<App />)
  }
})
