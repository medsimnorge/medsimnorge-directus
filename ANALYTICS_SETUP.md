# Analytics Setup Guide - Umami

## Why Umami?
- ✅ 100% GDPR compliant - no cookie banner needed
- ✅ Free and open source
- ✅ Self-hosted on your VPS
- ✅ Lightweight and fast
- ✅ Privacy-focused - no personal data collected
- ✅ Simple, clean dashboard

## Installation Steps

### 1. Generate App Secret
```bash
# Generate a random secret
openssl rand -base64 32
```

Copy this value and add it to your `.env` file as `UMAMI_APP_SECRET`

### 2. Start Umami
```bash
# Start Umami and its database
docker compose -f docker-compose.analytics.yml up -d

# Check logs
docker compose -f docker-compose.analytics.yml logs -f
```

Umami will be available at `http://localhost:3001`

### 3. Initial Login
- URL: `http://your-server-ip:3001`
- Default username: `admin`
- Default password: `umami`

**⚠️ Change the password immediately after first login!**

### 4. Add Your Website
1. Login to Umami dashboard
2. Go to Settings → Websites
3. Click "Add website"
4. Enter:
   - Name: MedSimNorge
   - Domain: your-domain.com
   - Enable "Share URL" if you want public stats
5. Click "Save"
6. Copy the "Website ID" (you'll need this)

### 5. Configure Environment Variables
Add to your `.env` file:
```bash
# Analytics
UMAMI_APP_SECRET=your-generated-secret-from-step-1
PUBLIC_UMAMI_WEBSITE_ID=your-website-id-from-step-4
PUBLIC_UMAMI_URL=http://your-server-ip:3001
```

### 6. Setup Nginx Reverse Proxy (Optional but Recommended)
Create `/etc/nginx/sites-available/umami`:

```nginx
server {
    listen 80;
    server_name analytics.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
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

Enable and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/umami /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d analytics.your-domain.com
```

Update `.env` with your domain:
```bash
PUBLIC_UMAMI_URL=https://analytics.your-domain.com
```

### 7. Rebuild Your App
```bash
# With Docker Compose
docker compose down
docker compose up -d --build

# Or with deploy script
./deploy.sh
```

## Viewing Analytics

### Dashboard Access
- URL: `https://analytics.your-domain.com`
- Login with your admin credentials

### What You'll See
- Real-time visitors
- Page views
- Unique visitors
- Bounce rate
- Visit duration
- Traffic sources
- Devices and browsers
- Countries
- Pages visited

### Public Stats (Optional)
You can make your stats public by:
1. Go to Settings → Websites
2. Click on your website
3. Enable "Share URL"
4. Copy the public URL to share

## Maintenance

### View Logs
```bash
docker compose -f docker-compose.analytics.yml logs -f umami
```

### Restart Umami
```bash
docker compose -f docker-compose.analytics.yml restart
```

### Backup Database
```bash
docker exec umami-db pg_dump -U umami umami > umami-backup-$(date +%Y%m%d).sql
```

### Restore Database
```bash
cat umami-backup-20241126.sql | docker exec -i umami-db psql -U umami umami
```

### Update Umami
```bash
docker compose -f docker-compose.analytics.yml pull
docker compose -f docker-compose.analytics.yml up -d
```

## Troubleshooting

### Can't access Umami dashboard
```bash
# Check if container is running
docker ps | grep umami

# Check logs
docker logs umami

# Verify port is open
sudo lsof -i :3001
```

### Database connection issues
```bash
# Check database health
docker exec umami-db pg_isready -U umami

# Restart both services
docker compose -f docker-compose.analytics.yml restart
```

### Analytics not tracking
1. Check browser console for errors
2. Verify `PUBLIC_UMAMI_WEBSITE_ID` is correct
3. Verify `PUBLIC_UMAMI_URL` is accessible
4. Check if ad-blocker is blocking the script
5. Verify the tracking script is in your HTML

## Privacy & GDPR Compliance

Umami is GDPR compliant by default because:
- ✅ No cookies used
- ✅ No personal data collected
- ✅ All data anonymized
- ✅ IP addresses hashed
- ✅ No cross-site tracking
- ✅ Data stored on your server

**You don't need a cookie consent banner for Umami!**

## Alternative: GoatCounter (Even Simpler)

If you want something even simpler without self-hosting:

1. Go to https://www.goatcounter.com/signup
2. Create a free account
3. Get your tracking code
4. Add to your `.env`:
   ```bash
   PUBLIC_GOATCOUNTER_CODE=your-code
   ```

GoatCounter is also GDPR compliant and free for personal/small sites.
