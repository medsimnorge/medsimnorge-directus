#!/bin/bash

# Deployment script for MedSimNorge with Nixpacks
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Build with Nixpacks
echo "🔨 Building with Nixpacks..."
nixpacks build . --name medsimnorge

# Stop and remove old container
echo "🛑 Stopping old container..."
docker stop medsimnorge 2>/dev/null || true
docker rm medsimnorge 2>/dev/null || true

# Start new container with healthcheck
echo "▶️  Starting new container..."
docker run -d \
  --name medsimnorge \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  --health-cmd="curl -f http://localhost:3000/health || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  --health-start-period=40s \
  medsimnorge

# Wait for healthcheck
echo "⏳ Waiting for application to be healthy..."
for i in {1..20}; do
  HEALTH=$(docker inspect --format='{{.State.Health.Status}}' medsimnorge 2>/dev/null || echo "starting")
  if [ "$HEALTH" = "healthy" ]; then
    echo "✅ Application is healthy!"
    break
  elif [ "$HEALTH" = "unhealthy" ]; then
    echo "❌ Application is unhealthy!"
    echo "📝 Check logs with: docker logs medsimnorge"
    exit 1
  fi
  echo "   Status: $HEALTH (attempt $i/20)"
  sleep 3
done

# Check if container is running
if docker ps | grep -q medsimnorge; then
  echo "✅ Deployment successful!"
  echo "📊 Container status:"
  docker ps | grep medsimnorge
  echo ""
  echo "🏥 Health status:"
  docker inspect --format='{{.State.Health.Status}}' medsimnorge
  echo ""
  echo "📝 View logs with: docker logs -f medsimnorge"
else
  echo "❌ Deployment failed! Container is not running."
  echo "📝 Check logs with: docker logs medsimnorge"
  exit 1
fi
