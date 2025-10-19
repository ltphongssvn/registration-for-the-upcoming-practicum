# File: Dockerfile
# Location: /registration-for-the-upcoming-practicum/Dockerfile
# Purpose: Docker configuration using uv for dependency management

FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Create virtual environment and install dependencies with uv
RUN uv venv /app/.venv && \
    . /app/.venv/bin/activate && \
    uv pip install --no-cache-dir -r requirements.txt

# Activate venv in shell
ENV PATH="/app/.venv/bin:$PATH"

# Expose port
EXPOSE 3000

# Start command (to be customized for Rails)
CMD ["rails", "server", "-b", "0.0.0.0"]
