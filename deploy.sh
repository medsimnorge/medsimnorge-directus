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

# Start new container
echo "▶️  Starting new container..."
docker run -d \
  --name medsimnorge \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  medsimnorge

# Wait a moment for container to start
sleep 3

# Check if container is running
if docker ps | grep -q medsimnorge; then
  echo "✅ Deployment successful!"
  echo "📊 Container status:"
  docker ps | grep medsimnorge
  echo ""
  echo "📝 View logs with: docker logs -f medsimnorge"
else
  echo "❌ Deployment failed! Container is not running."
  echo "📝 Check logs with: docker logs medsimnorge"
  exit 1
fi
