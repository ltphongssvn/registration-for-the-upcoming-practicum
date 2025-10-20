#!/bin/bash
# File: bin/docker-entrypoint.sh
set -e

echo "Running database migrations..."
bundle exec rails db:migrate || bundle exec rails db:create && bundle exec rails db:migrate

echo "Starting Rails server..."
bundle exec rails server -b 0.0.0.0 -p ${PORT:-3000}
