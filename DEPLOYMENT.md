# Deployment Guide - Ubuntu VPS with Docker

## Prerequisites
- Ubuntu VPS with Docker and Docker Compose installed
- Nginx (for reverse proxy)
- Git

## Deployment Options

### Option 1: Docker Compose (Recommended for Manual Deploys)

#### 1. Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### 2. Clone and Setup
```bash
# Clone your repository
git clone https://github.com/medsimnorge/medsimnorge-directus.git
cd medsimnorge-directus

# Create .env file (copy from .env.example and fill in values)
cp .env.example .env
nano .env
```

#### 3. Build and Run
```bash
# Build and start the container
docker compose up -d

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

### Option 2: Nixpacks (Recommended for Automated Deploys)

Nixpacks automatically detects your project and builds it. Perfect for CI/CD pipelines.

#### Setup with Nixpacks
```bash
# Install Nixpacks
curl -sSL https://nixpacks.com/install.sh | bash

# Clone repository
git clone https://github.com/medsimnorge/medsimnorge-directus.git
cd medsimnorge-directus

# Create .env file
cp .env.example .env
nano .env

# Build with Nixpacks
nixpacks build . --name medsimnorge

# Run the container
docker run -d \
  --name medsimnorge \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  medsimnorge
```

#### Automated Deployment Script
Create `deploy.sh`:
```bash
#!/bin/bash
cd /path/to/medsimnorge-directus
git pull origin main
nixpacks build . --name medsimnorge
docker stop medsimnorge || true
docker rm medsimnorge || true
docker run -d \
  --name medsimnorge \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  medsimnorge
```

Make it executable: `chmod +x deploy.sh`

### 4. Configure Nginx
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

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/medsimnorge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables
Make sure these are set in your `.env` file:
- `DIRECTUS_URL` - Your Directus backend URL
- `PUBLIC_DIRECTUS_URL` - Public-facing Directus URL
- `DIRECTUS_ADMIN_TOKEN` - Admin token for Directus API

## Docker Commands

### With Docker Compose
```bash
# View logs
docker compose logs -f

# Restart app
docker compose restart

# Stop app
docker compose down

# Rebuild and restart
docker compose up -d --build
```

### With Plain Docker
```bash
# View logs
docker logs -f medsimnorge

# Restart app
docker restart medsimnorge

# Stop app
docker stop medsimnorge

# Remove container
docker rm medsimnorge
```

## Updating the Application

### With Docker Compose
```bash
cd medsimnorge-directus
git pull
docker compose down
docker compose up -d --build
```

### With Nixpacks
```bash
cd medsimnorge-directus
./deploy.sh
```

## Port Configuration
By default, SvelteKit with adapter-node runs on port 3000. You can change this:

```bash
# Set custom port
PORT=3000 pm2 start build/index.js --name medsimnorge

# Or in your .env file
echo "PORT=3000" >> .env
```

## Troubleshooting
- Check PM2 logs: `pm2 logs medsimnorge`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Verify build output exists: `ls -la build/`
- Test the app locally: `node build/index.js`
