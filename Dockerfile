# File: Dockerfile
# Location: /registration-for-the-upcoming-practicum/Dockerfile
# Purpose: Docker configuration for Rails with PostgreSQL using uv

FROM ruby:3.2.1-slim

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev nodejs postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Install uv for Python dependencies
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Install Ruby dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy application
COPY . .

# Setup Python venv with uv if needed
RUN uv venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Precompile assets
RUN SECRET_KEY_BASE=dummy bundle exec rails assets:precompile

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
