# File: Dockerfile
FROM ruby:3.2.1-slim
# Install dependencies
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev nodejs npm curl && \
    npm install -g yarn && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Copy dependency files
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY package.json package-lock.json ./
RUN npm install
# Copy application
COPY . .
# Precompile assets
RUN bundle exec rails assets:precompile
# Create non-root user
RUN useradd -m -u 1000 rails && \
    chown -R rails:rails /app
USER rails
EXPOSE 3000
# Run migrations and start server
CMD bundle exec rails db:migrate && bundle exec rails server -b 0.0.0.0 -p ${PORT:-3000}
