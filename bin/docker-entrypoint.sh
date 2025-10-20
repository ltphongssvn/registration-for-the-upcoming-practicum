#!/bin/bash
# File: bin/docker-entrypoint.sh
# Location: /registration-for-the-upcoming-practicum/bin/docker-entrypoint.sh
set -e

echo "Running database migrations..."
bundle exec rails db:migrate 2>/dev/null || (bundle exec rails db:create && bundle exec rails db:migrate)

echo "Starting Rails server..."
bundle exec rails server -b 0.0.0.0 -p ${PORT:-3000}
