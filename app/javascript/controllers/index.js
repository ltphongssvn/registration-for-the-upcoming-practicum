// File: app/javascript/controllers/index.js
// Location: /registration-for-the-upcoming-practicum/app/javascript/controllers/index.js

import { Application } from "@hotwired/stimulus"

const application = Application.start()
application.debug = false
window.Stimulus = application

export { application }
