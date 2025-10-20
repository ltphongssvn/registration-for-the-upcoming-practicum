// File: app/javascript/react_init.js
import React from 'react';
import { createRoot } from 'react-dom/client';

const { useState, useEffect } = React;

function RegistrationDashboard() {
  const [data, setData] = useState({ students: [], stats: {}, ai_grouping: {}, suggested_teams: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table');

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return React.createElement('div', {className: 'text-center p-8'}, 'Loading dashboard...');

  const statsCards = React.createElement('div', {className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'},
    React.createElement('div', {className: 'bg-white p-4 rounded-lg shadow'},
      React.createElement('h3', {className: 'text-sm text-gray-600'}, 'Total Registrations'),
      React.createElement('p', {className: 'text-2xl font-bold text-blue-600'}, data.stats.total || 0)
    ),
    React.createElement('div', {className: 'bg-white p-4 rounded-lg shadow'},
      React.createElement('h3', {className: 'text-sm text-gray-600'}, 'Available'),
      React.createElement('p', {className: 'text-2xl font-bold text-green-600'}, data.stats.available || 0)
    ),
    React.createElement('div', {className: 'bg-white p-4 rounded-lg shadow'},
      React.createElement('h3', {className: 'text-sm text-gray-600'}, 'Prerequisites Complete'),
      React.createElement('p', {className: 'text-2xl font-bold text-purple-600'}, data.stats.prerequisites_completed || 0)
    ),
    React.createElement('div', {className: 'bg-white p-4 rounded-lg shadow'},
      React.createElement('h3', {className: 'text-sm text-gray-600'}, 'Ready for Practicum'),
      React.createElement('p', {className: 'text-2xl font-bold text-orange-600'}, data.stats.ready_for_practicum || 0)
    )
  );

  const viewToggle = React.createElement('div', {className: 'mb-4 flex gap-2'},
    ['table', 'ai-groups', 'teams'].map(v =>
      React.createElement('button', {
        key: v,
        onClick: () => setView(v),
        className: `px-4 py-2 rounded ${view === v ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`
      }, v === 'ai-groups' ? 'AI Groups' : v.charAt(0).toUpperCase() + v.slice(1))
    )
  );

  const tableView = React.createElement('div', {className: 'bg-white rounded-lg shadow overflow-hidden'},
    React.createElement('table', {className: 'w-full'},
      React.createElement('thead', {className: 'bg-gray-100'},
        React.createElement('tr', {},
          ['Name', 'Email', 'Cohort', 'Practicum Idea', 'Status'].map(h =>
            React.createElement('th', {key: h, className: 'px-4 py-2 text-left text-sm font-medium text-gray-700'}, h)
          )
        )
      ),
      React.createElement('tbody', {},
        data.students.map(student =>
          React.createElement('tr', {key: student.id, className: 'border-t hover:bg-gray-50'},
            React.createElement('td', {className: 'px-4 py-3 font-medium'}, student.name),
            React.createElement('td', {className: 'px-4 py-3 text-sm text-gray-600'}, student.email),
            React.createElement('td', {className: 'px-4 py-3'}, student.cohort),
            React.createElement('td', {className: 'px-4 py-3 text-sm'}, student.practicum_idea || '-'),
            React.createElement('td', {className: 'px-4 py-3'},
              student.availability && student.completed_prerequisites ?
                React.createElement('span', {className: 'px-2 py-1 text-xs rounded bg-green-100 text-green-800'}, 'Ready') :
                React.createElement('span', {className: 'px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800'}, 'Not Ready')
            )
          )
        )
      )
    )
  );

  const groupsView = React.createElement('div', {className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'},
    Object.entries(data.ai_grouping || {}).map(([category, members]) =>
      React.createElement('div', {key: category, className: 'bg-white rounded-lg shadow p-4'},
        React.createElement('h3', {className: 'font-bold text-lg mb-2 capitalize'},
          category.replace('_', ' ')),
        React.createElement('ul', {className: 'space-y-1'},
          members.map(name =>
            React.createElement('li', {key: name, className: 'text-sm text-gray-700'}, '• ' + name)
          )
        )
      )
    )
  );

  const teamsView = React.createElement('div', {className: 'space-y-4'},
    (data.suggested_teams || []).map((team, idx) =>
      React.createElement('div', {key: idx, className: 'bg-white rounded-lg shadow p-4'},
        React.createElement('h3', {className: 'font-bold mb-2'},
          `Team ${idx + 1} - ${team.category.replace('_', ' ').toUpperCase()}`),
        React.createElement('div', {className: 'flex flex-wrap gap-2'},
          team.members.map(member =>
            React.createElement('span', {key: member, className: 'px-3 py-1 bg-blue-100 text-blue-800 rounded'},
              member)
          )
        )
      )
    )
  );

  return React.createElement('div', {className: 'p-6 bg-gray-50 min-h-screen'},
    React.createElement('h1', {className: 'text-3xl font-bold mb-6'}, 'Practicum Registration Dashboard'),
    statsCards,
    viewToggle,
    view === 'table' ? tableView : view === 'ai-groups' ? groupsView : teamsView
  );
}

document.addEventListener('turbo:load', () => {
  const container = document.getElementById('react-dashboard-root');
  if (container && !container.dataset.reactInitialized) {
    container.dataset.reactInitialized = 'true';
    const root = createRoot(container);
    root.render(React.createElement(RegistrationDashboard));
  }
});
