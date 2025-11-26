# Docker Deployment Guide

## Quick Start

### 1. Choose Your Deployment Method

**Docker Compose** - Best for simple, manual deployments
**Nixpacks** - Best for automated deployments and CI/CD

### 2. Docker Compose Deployment

```bash
# On your server
git clone https://github.com/medsimnorge/medsimnorge-directus.git
cd medsimnorge-directus

# Setup environment
cp .env.example .env
nano .env  # Add your Directus URL and token

# Start the application
docker compose up -d

# View logs
docker compose logs -f
```

### 3. Nixpacks Deployment

```bash
# Install Nixpacks (one-time)
curl -sSL https://nixpacks.com/install.sh | bash

# On your server
git clone https://github.com/medsimnorge/medsimnorge-directus.git
cd medsimnorge-directus

# Setup environment
cp .env.example .env
nano .env  # Add your Directus URL and token

# Make deploy script executable
chmod +x deploy.sh

# Deploy
./deploy.sh
```

## Nginx Configuration

Create `/etc/nginx/sites-available/medsimnorge`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/medsimnorge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d medsimnorge.no
```

## GitHub Webhook for Auto-Deploy

### 1. Create webhook endpoint (optional)
You can use a simple webhook receiver or set up a cron job:

```bash
# Add to crontab (checks for updates every 5 minutes)
crontab -e

# Add this line:
*/5 * * * * cd /path/to/medsimnorge-directus && git fetch && [ $(git rev-parse HEAD) != $(git rev-parse @{u}) ] && ./deploy.sh >> /var/log/medsimnorge-deploy.log 2>&1
```

### 2. Or use webhook-receiver
```bash
# Install webhook
sudo apt install webhook

# Create webhook config
sudo nano /etc/webhook.conf
```

Add:
```json
[
  {
    "id": "medsimnorge-deploy",
    "execute-command": "/path/to/medsimnorge-directus/deploy.sh",
    "command-working-directory": "/path/to/medsimnorge-directus",
    "response-message": "Deploying MedSimNorge...",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "your-webhook-secret",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
```

Start webhook:
```bash
webhook -hooks /etc/webhook.conf -verbose
```

## Useful Commands

### Docker Compose
```bash
# Start
docker compose up -d

# Stop
docker compose down

# Rebuild
docker compose up -d --build

# Logs
docker compose logs -f

# Restart
docker compose restart
```

### Nixpacks/Docker
```bash
# Deploy
./deploy.sh

# View logs
docker logs -f medsimnorge

# Restart
docker restart medsimnorge

# Stop
docker stop medsimnorge

# Remove
docker rm medsimnorge

# Shell into container
docker exec -it medsimnorge sh
```

### Cleanup
```bash
# Remove unused images
docker image prune -a

# Remove all stopped containers
docker container prune

# Full cleanup
docker system prune -a
```

## Monitoring

### Check container status
```bash
docker ps
docker stats medsimnorge
```

### View logs
```bash
# Real-time logs
docker logs -f medsimnorge

# Last 100 lines
docker logs --tail 100 medsimnorge

# Logs since 1 hour ago
docker logs --since 1h medsimnorge
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs medsimnorge

# Check if port is already in use
sudo lsof -i :3000

# Try running interactively
docker run -it --rm --env-file .env medsimnorge sh
```

### Build fails
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild from scratch
docker compose build --no-cache
```

### Environment variables not working
```bash
# Check .env file exists
cat .env

# Verify container has env vars
docker exec medsimnorge env
```

## Performance Tips

1. **Use multi-stage builds** (already configured in Dockerfile)
2. **Limit container resources** if needed:
   ```yaml
   # In docker-compose.yml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```
3. **Enable Docker logging limits**:
   ```yaml
   # In docker-compose.yml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```
