# Pre-Deployment Checklist

## ✅ Completed
- [x] Changed adapter from `adapter-auto` to `adapter-node`
- [x] Created `.env.example` for reference
- [x] Verified `.env` is in `.gitignore`
- [x] Created deployment documentation
- [x] Tested production build locally

## 📋 Before Deploying to VPS

### 1. Directus Configuration
- [ ] Verify Directus permissions are set correctly:
  - [ ] `nav_item` collection has read access
  - [ ] `navigation` collection has read access
  - [ ] `navigation_nav_item` junction table has read access
  - [ ] `pages` collection has read access
  - [ ] `nettverkskonferanser` collection has read access
  - [ ] All block collections have read access
- [ ] Confirm admin token is valid and has proper permissions
- [ ] Test API endpoints manually to ensure they return data

### 2. Environment Variables
- [ ] Copy `.env.example` to `.env` on server
- [ ] Set `DIRECTUS_URL` to your Directus instance
- [ ] Set `PUBLIC_DIRECTUS_URL` (can be same as DIRECTUS_URL)
- [ ] Set `DIRECTUS_ADMIN_TOKEN` with valid token
- [ ] Optionally set `PORT` (defaults to 3000)

### 3. Server Setup
- [ ] Node.js 18+ installed
- [ ] pnpm installed globally
- [ ] PM2 installed globally
- [ ] Nginx installed and configured
- [ ] Firewall configured (allow ports 80, 443, 22)
- [ ] Domain DNS pointing to VPS IP

### 4. SSL Certificate
- [ ] Install certbot
- [ ] Run certbot to get SSL certificate
- [ ] Verify auto-renewal is configured

### 5. Application Deployment
- [ ] Clone repository to server
- [ ] Run `pnpm install`
- [ ] Create `.env` file with production values
- [ ] Run `pnpm build`
- [ ] Start with PM2: `pm2 start build/index.js --name medsimnorge`
- [ ] Save PM2 config: `pm2 save`
- [ ] Setup PM2 startup: `pm2 startup`

### 6. Testing
- [ ] Test application locally on server: `curl http://localhost:3000`
- [ ] Test through Nginx: `curl http://your-domain.com`
- [ ] Test HTTPS: `curl https://your-domain.com`
- [ ] Verify navigation dropdown works
- [ ] Verify pages load correctly
- [ ] Check browser console for errors
- [ ] Test asset proxy endpoints

### 7. Monitoring
- [ ] Setup PM2 monitoring: `pm2 monit`
- [ ] Check logs: `pm2 logs medsimnorge`
- [ ] Monitor Nginx logs: `tail -f /var/log/nginx/error.log`

## 🔧 Known Issues to Fix Before Deploy
1. **Navigation dropdown** - Ensure all nav items with children are returned from Directus
2. **Site settings** - Fix permissions or remove if not needed
3. **Asset URLs** - Verify asset proxy works with your Directus setup

## 📝 Post-Deployment
- [ ] Test all pages and functionality
- [ ] Setup monitoring/alerting
- [ ] Document any custom configurations
- [ ] Create backup strategy
- [ ] Setup automated deployments (optional)

## 🚀 Quick Deploy Commands
```bash
# On your VPS
git clone https://github.com/medsimnorge/medsimnorge-directus.git
cd medsimnorge-directus
pnpm install
cp .env.example .env
nano .env  # Edit with your values
pnpm build
pm2 start build/index.js --name medsimnorge
pm2 save
pm2 startup
```
