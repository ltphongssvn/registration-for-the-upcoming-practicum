# Registration for the Upcoming Practicum

Live demo: https://practicum.thanhphongle.net/

A Rails 8 application for managing practicum course registrations with AI-powered team formation capabilities.

## Features

- 📝 Student registration system with cohort management
- 🤖 AI-driven team formation and grouping suggestions
- ⚛️ React-powered interactive UI with Hotwire integration
- 📊 RESTful API for student data and AI analysis
- 🔒 Secure environment configuration

## Tech Stack

- **Backend**: Rails 8.0.3, Ruby 3.2.1
- **Database**: PostgreSQL
- **Frontend**: React 19.2.0, Hotwire (Turbo + Stimulus)
- **Build Tools**: esbuild
- **Deployment**: Docker, Railway, Kamal

## Prerequisites

- Ruby 3.2.1
- PostgreSQL
- Node.js (for frontend assets)
- Docker (optional)

## Installation

1. **Clone the repository**
```bash
   git clone https://github.com/ltphongssvn/registration-for-the-upcoming-practicum.git
   cd registration-for-the-upcoming-practicum
```

2. **Install dependencies**
```bash
   bundle install
   npm install
```

3. **Setup environment variables**
```bash
   cp .env.example .env
   # Edit .env with your configuration
```

4. **Database setup**
```bash
   rails db:create
   rails db:migrate
   rails db:seed
```

5. **Build assets**
```bash
   npm run build
```

## Usage

### Development Server
```bash
bin/dev
```

Or with foreman:
```bash
foreman start -f Procfile.dev
```

Access the application at `http://localhost:3000`

### Docker
```bash
docker-compose up
```

## API Endpoints

### Registrations
- `GET /` - Homepage (registration index)
- `GET /registrations/new` - New registration form
- `POST /registrations` - Create registration
- `GET /registrations/:id` - View registration
- `GET /registrations/cohorts` - List cohorts

### API
- `GET /api/students` - List all students
- `POST /api/ai_groupings/analyze` - Analyze student data for grouping
- `POST /api/ai_groupings/suggest_teams` - Generate AI team suggestions

## Testing
```bash
rails test
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Railway
```bash
railway up
```

### Kamal
```bash
kamal deploy
```

## Project Structure
```
├── app/
│   ├── controllers/      # Application controllers
│   ├── models/          # Data models
│   ├── views/           # View templates
│   ├── javascript/      # React components
│   └── helpers/         # Helper modules
├── config/              # Application configuration
├── db/                  # Database migrations and seeds
├── public/              # Static assets
└── test/               # Test suite
```

## Security

- Pre-commit hooks configured with detect-secrets
- Secure environment variable management
- See [SECURITY.md](SECURITY.md) for security policies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is developed for educational purposes.

## Additional Documentation

- [AI Setup Guide](AI_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Setup Complete Report](SETUP_COMPLETE.md)
- [Validation Report](VALIDATION_REPORT.md)
