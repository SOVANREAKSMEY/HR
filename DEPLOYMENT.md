# 🚀 Deployment Guide

## Option 1: Vercel + Cloudinary (RECOMMENDED - FREE)

### Step 1: Setup Cloudinary (Free Image Storage)

1. **Create Cloudinary Account**
   - Go to https://cloudinary.com/users/register/free
   - Sign up for free account
   - Get your credentials from Dashboard

2. **Get Cloudinary Credentials**
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Prepare for Deployment

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ADMIN_USERNAME=adminsmey
   ADMIN_PASSWORD=@@@@wrongpassword168
   PORT=3000
   ```

### Step 3: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add all variables from `.env`

---

## Option 2: Railway.app ($5/month - Persistent Storage)

### Step 1: Setup Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Push your code to GitHub
   - Click "New Project" in Railway
   - Select your repository
   - Railway will auto-detect Node.js

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all from `.env.example`

4. **Add Volume for Persistent Storage**
   - Go to Settings
   - Add Volume: `/app/public/uploads`
   - This keeps your images safe

**Cost**: $5/month (no sleeping, persistent storage)

---

## Option 3: VPS (DigitalOcean, Vultr, Linode)

### Step 1: Create VPS

1. **Create Droplet/Server**
   - Ubuntu 22.04 LTS
   - $4-6/month plan
   - Get IP address

### Step 2: Setup Server

1. **SSH into server**
   ```bash
   ssh root@your_ip_address
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

4. **Clone your repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

5. **Install dependencies**
   ```bash
   npm install
   ```

6. **Create `.env` file**
   ```bash
   nano .env
   # Paste your environment variables
   ```

7. **Start with PM2**
   ```bash
   pm2 start server.js --name hr-website
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx (Optional - for domain)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/hr-website
   ```

   Add:
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
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/hr-website /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 📝 Comparison

| Option | Cost | Setup | Images Safe | Sleeping |
|--------|------|-------|-------------|----------|
| **Vercel + Cloudinary** | Free | Easy | ✅ Yes | ❌ Never |
| **Railway.app** | $5/mo | Easy | ✅ Yes | ❌ Never |
| **VPS** | $4-6/mo | Medium | ✅ Yes | ❌ Never |
| **Render.com Free** | Free | Easy | ❌ No | ✅ Yes |

---

## 🎯 Recommendation

**Use Vercel + Cloudinary** for:
- Free hosting
- No sleeping
- Cloud image storage
- Fast CDN
- Easy deployment

**Use Railway** if:
- You want simple setup
- Don't mind $5/month
- Want everything in one place

**Use VPS** if:
- You need full control
- Want to learn server management
- Have multiple projects

---

## 🔒 Security Notes

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Change default password** after deployment
3. **Use HTTPS** in production
4. **Keep dependencies updated**: `npm update`

---

## 📞 Support

If you need help with deployment, check:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Cloudinary Docs: https://cloudinary.com/documentation
