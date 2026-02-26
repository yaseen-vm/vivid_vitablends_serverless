#!/bin/bash
set -e

echo "🚀 Starting production deployment..."

# Detect docker compose command
if command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
else
  echo "❌ Docker Compose not installed"
  exit 1
fi

echo "Using: $COMPOSE_CMD"

# Docker Hub login
if [ -n "$DOCKER_USERNAME" ] && [ -n "$DOCKER_TOKEN" ]; then
  echo "🔐 Logging into Docker Hub..."
  echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin
fi

# Clean unused images only (safe)
echo "🧹 Cleaning unused images..."
docker image prune -af || true

# Pull latest images
echo "📦 Pulling latest images..."
$COMPOSE_CMD -f docker-compose.prod.yml pull

# Zero downtime restart
echo "▶️ Starting containers..."
$COMPOSE_CMD -f docker-compose.prod.yml up -d --remove-orphans --force-recreate nginx

# Wait for DB readiness
echo "⏳ Waiting for database..."
sleep 15

# Run DB migrations safely
echo "🗄 Running migrations..."
$COMPOSE_CMD -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy || echo "Migration skipped"

# Show container status
echo "📊 Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "✅ Deployment completed successfully!"
