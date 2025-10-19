# File: SECURITY.md
# Location: /registration-for-the-upcoming-practicum/SECURITY.md
# Purpose: Security best practices and setup documentation

## Security Setup Complete ✓

### 1. Virtual Environment (uv)
- Created with `uv venv .venv`
- Isolated Python dependencies
- Activate: `source .venv/bin/activate`

### 2. Secret Detection
- **Pre-commit hooks**: Installed and active
- **Pre-push hooks**: Installed and active
- **Baseline**: `.secrets.baseline` established
- **Plugins**: 27 secret detection plugins active

### 3. Protected Files
The following are blocked from Git:
- `.env` files (all variants)
- `.venv/` directory
- `__pycache__/` and Python artifacts
- IDE configurations

### 4. Pre-commit Workflow

**Before first commit:**
```bash
source .venv/bin/activate
pre-commit install
pre-commit install --hook-type pre-push
```

**On every commit:**
- Trailing whitespace removed
- End-of-file fixed
- Large files detected
- Private keys blocked
- **Secrets scanned automatically**

### 5. Environment Variables Required

Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with real values (NEVER commit this file)
```

Required variables:
- `DATABASE_URL`
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `SECRET_KEY_BASE`
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`

### 6. Docker with uv

Build: `docker build -t practicum-app .`

The Dockerfile uses `uv` instead of `pip` for faster, more reliable builds.

### 7. If Secrets Are Accidentally Committed

1. **Immediately rotate/revoke** the exposed credentials
2. Remove from history:
```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch PATH/TO/FILE" \
     --prune-empty --tag-name-filter cat -- --all
```
3. Update `.secrets.baseline`
4. Force push (coordinate with team)

### 8. Regular Maintenance

- Run `pre-commit autoupdate` monthly
- Review `.secrets.baseline` changes in PRs
- Never bypass hooks with `--no-verify`

## Verification Checklist

- [x] uv virtual environment created
- [x] Pre-commit hooks installed
- [x] Pre-push hooks installed
- [x] Secret detection baseline established
- [x] `.gitignore` blocks sensitive files
- [x] `.env.example` template created
- [x] Dockerfile uses uv
- [x] All hooks tested and passing
