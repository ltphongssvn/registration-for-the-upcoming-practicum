# Deployment Guide

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- API keys (optional): OpenAI and/or Anthropic

### Local Docker Setup

1. **Generate secret key**:
```bash
docker run --rm -it ruby:3.2.1-slim bash -c "gem install rails && rails secret"
```

2. **Create .env.docker**:
```bash
SECRET_KEY_BASE=your_generated_secret
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

3. **Build and run**:
```bash
docker-compose up --build
```

4. **Access**: http://localhost:3000

### Production Deployment

#### Option 1: Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and init:
```bash
railway login
railway init
```

3. Add PostgreSQL:
```bash
railway add postgresql
```

4. Set environment variables:
```bash
railway variables set SECRET_KEY_BASE=$(rails secret)
railway variables set OPENAI_API_KEY=sk-...
railway variables set ANTHROPIC_API_KEY=sk-ant-...
```

5. Deploy:
```bash
railway up
```

#### Option 2: Docker Hub + VPS

1. **Build and push**:
```bash
docker build -t yourusername/practicum-hub .
docker push yourusername/practicum-hub
```

2. **On VPS**:
```bash
docker pull yourusername/practicum-hub
docker-compose up -d
```

### Environment Variables

Required:
- `SECRET_KEY_BASE` - Rails secret
- `DATABASE_URL` - PostgreSQL connection string

Optional:
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key

### Health Check
```bash
curl http://localhost:3000/up
```

### Logs
```bash
docker-compose logs -f web
```

### Maintenance

Stop: `docker-compose down`
Restart: `docker-compose restart`
Clean: `docker-compose down -v`
