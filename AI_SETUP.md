# File: AI_SETUP.md
# Location: /registration-for-the-upcoming-practicum/AI_SETUP.md

## Multi-AI Agents System

### Architecture

The system uses **two AI providers** for intelligent student grouping:

1. **OpenAI GPT-4** - Primary analysis engine
2. **Anthropic Claude** - Fallback and validation

### Features

- **Automatic Project Grouping**: Analyzes student ideas using semantic understanding
- **Team Formation**: Creates balanced teams based on cohort, skills, and project compatibility
- **Fallback System**: Keyword-based grouping if APIs unavailable

### Setup

1. **Get API Keys**:
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/

2. **Configure Environment**:
```bash
   cp .env.example .env
   # Edit .env with your keys:
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
```

3. **Test API Connection**:
```bash
   rails console
   > service = AiGroupingService.new
   > service.analyze_student_ideas(Student.all)
```

### API Endpoints

- `POST /api/ai_groupings/analyze` - Group students by project similarity
- `POST /api/ai_groupings/suggest_teams` - Generate balanced teams

### How It Works

1. **Collection**: Gathers registered students with completed prerequisites
2. **Analysis**: Sends project ideas to AI for semantic analysis
3. **Grouping**: AI identifies patterns in:
   - Technology stack
   - Problem domain
   - Target users
   - Feature complexity
4. **Team Formation**: Balances teams by:
   - Cohort diversity
   - Complementary skills
   - Project compatibility

### Fallback Behavior

If API keys missing or calls fail, system uses keyword matching:
- AI & Machine Learning
- Social & Community
- Finance & Business
- Health & Wellness
- Education & Learning

### Cost Estimation

- GPT-4: ~$0.03 per analysis (20 students)
- Claude: ~$0.015 per analysis (20 students)
- Recommended: Set API usage limits

### Security

- API keys stored in environment variables
- Never committed to git
- Requests logged for debugging
- Rate limiting recommended
