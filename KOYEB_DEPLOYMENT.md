# 🚀 Deploy to Koyeb (FREE with Persistent Storage)

## Why Koyeb?
- ✅ **FREE tier available**
- ✅ **Persistent storage** (data never lost)
- ✅ **No sleeping** (always online)
- ✅ **Easy setup** (works with your code as-is)
- ✅ **Fast deployment**

---

## Step-by-Step Deployment

### Step 1: Create Koyeb Account

1. Go to: https://app.koyeb.com/auth/signup
2. Sign up with GitHub (recommended) or email
3. Verify your email

---

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Ready for Koyeb deployment"
git push
```

---

### Step 3: Create Cloudinary Account (for images)

1. Go to: https://cloudinary.com/users/register/free
2. Sign up (free account)
3. Copy from dashboard:
   - Cloud Name
   - API Key
   - API Secret

---

### Step 4: Deploy on Koyeb

1. **Login to Koyeb:** https://app.koyeb.com
2. Click **"Create App"**
3. Select **"GitHub"** as deployment method
4. **Authorize Koyeb** to access your GitHub
5. **Select your repository**

---

### Step 5: Configure App

#### Builder Settings:
- **Build command:** `npm install`
- **Run command:** `npm start`
- **Port:** `3000`

#### Environment Variables:
Click **"Add Environment Variable"** for each:

```
Name: CLOUDINARY_CLOUD_NAME
Value: [your_cloud_name_from_step_3]

Name: CLOUDINARY_API_KEY
Value: [your_api_key_from_step_3]

Name: CLOUDINARY_API_SECRET
Value: [your_api_secret_from_step_3]

Name: ADMIN_USERNAME
Value: adminsmey

Name: ADMIN_PASSWORD
Value: @@@@wrongpassword168

Name: PORT
Value: 3000

Name: DATA_DIR
Value: /app/data
```

---

### Step 6: Add Persistent Volume (IMPORTANT!)

1. Scroll to **"Volumes"** section
2. Click **"Add Volume"**
3. Configure:
   - **Name:** `hr-data`
   - **Mount path:** `/app/data`
   - **Size:** 1 GB (free tier)
4. Click **"Add"**

This ensures your job posters and settings are saved permanently!

---

### Step 7: Deploy

1. Review all settings
2. Click **"Deploy"**
3. Wait 2-3 minutes for deployment
4. ✅ Your website is live!

---

## 🌐 Access Your Website

After deployment, Koyeb gives you a URL like:
```
https://your-app-name-your-org.koyeb.app
```

- **Frontend:** https://your-app-name-your-org.koyeb.app
- **Admin Login:** https://your-app-name-your-org.koyeb.app/login.html

---

## 🔧 Update Your Website

To update your website:

```bash
# Make changes to your code
git add .
git commit -m "Update website"
git push
```

Koyeb will automatically redeploy! 🚀

---

## 💰 Pricing

**Free Tier Includes:**
- 1 web service
- 512 MB RAM
- 2 GB persistent storage
- Always online (no sleeping)
- Custom domain support

**Paid Plans:** Start at $5/month for more resources

---

## 🆚 Comparison

| Feature | Koyeb Free | Railway | Vercel |
|---------|------------|---------|--------|
| Cost | FREE | $5/mo | FREE |
| Storage | ✅ Persistent | ✅ Persistent | ❌ Lost |
| Sleeping | ❌ Never | ❌ Never | ❌ Never |
| Setup | Easy | Easy | Complex |
| Data Safe | ✅ Yes | ✅ Yes | ❌ No |

---

## 🔒 Security Tips

1. **Change default password** after first login
2. **Use strong passwords** for admin account
3. **Enable 2FA** on Koyeb account
4. **Keep dependencies updated:** `npm update`

---

## 🐛 Troubleshooting

### Build Failed?
- Check if `package.json` is in root directory
- Verify Node.js version compatibility

### Can't Login?
- Check environment variables are set correctly
- Verify ADMIN_USERNAME and ADMIN_PASSWORD

### Images Not Uploading?
- Verify Cloudinary credentials
- Check CLOUDINARY_* environment variables

### Data Lost After Restart?
- Make sure persistent volume is mounted at `/app/data`
- Verify DATA_DIR environment variable is set

---

## 📞 Support

- **Koyeb Docs:** https://www.koyeb.com/docs
- **Koyeb Community:** https://community.koyeb.com
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

## ✅ Checklist

Before deploying, make sure you have:

- [ ] GitHub account with your code pushed
- [ ] Koyeb account created
- [ ] Cloudinary account with credentials
- [ ] All environment variables ready
- [ ] Persistent volume configured

---

## 🎉 You're Done!

Your HR website is now:
- ✅ Live 24/7
- ✅ Data saved permanently
- ✅ Images in cloud (Cloudinary)
- ✅ Professional and fast
- ✅ FREE!

Enjoy your website! 🚀
