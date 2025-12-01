# 🚀 Deploying Todo App to Vercel with Jenkins

This guide will help you set up automated deployment to Vercel using Jenkins.

---

## 📋 Table of Contents

1. [Quick Overview](#quick-overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Set Up Vercel Account](#step-1-set-up-vercel-account)
4. [Step 2: Get Vercel Token](#step-2-get-vercel-token)
5. [Step 3: Configure Jenkins](#step-3-configure-jenkins)
6. [Step 4: Test Deployment](#step-4-test-deployment)
7. [Understanding the Workflow](#understanding-the-workflow)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Overview

**What you'll achieve:**
- ✅ Automatic deployment to Vercel when you push code
- ✅ Preview deployments for develop/feature branches
- ✅ Production deployment for main branch
- ✅ Unique URLs for each preview deployment
- ✅ Instant rollbacks if needed

**Deployment Flow:**
```
Push to 'develop' → Jenkins builds → Vercel Preview
Push to 'main'    → Jenkins builds → Vercel Production
```

---

## ✅ Prerequisites

Before starting, make sure you have:

- [ ] Jenkins running locally (run `./setup-jenkins.sh` if not)
- [ ] Jenkins pipeline created for your Todo App
- [ ] Vercel account (free tier is fine!)
- [ ] Git repository with your code

---

## 🌐 Step 1: Set Up Vercel Account

### Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended) or email
4. Verify your email

### Import Your Project (Manual Setup First)

Before automating with Jenkins, let's set it up manually once:

1. Click **"Add New Project"** in Vercel dashboard
2. Import your Git repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **"Deploy"**

Wait for first deployment to complete. This sets up the project in Vercel.

**Note your URLs:**
- Production: `https://your-todo-app.vercel.app`
- Project name in Vercel (you'll need this)

---

## 🔑 Step 2: Get Vercel Token

### Generate Vercel Token

1. Go to Vercel dashboard
2. Click your **profile picture** (bottom left)
3. Click **"Settings"**
4. Go to **"Tokens"** tab
5. Click **"Create Token"**
6. Enter token name: `jenkins-deployment`
7. Select scope: **Full Account**
8. Set expiration: **No Expiration** (or 1 year for security)
9. Click **"Create Token"**

**IMPORTANT:** Copy the token NOW! You won't see it again.

```
Example token:
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ⚙️ Step 3: Configure Jenkins

### Add Vercel Token to Jenkins

1. Open Jenkins: http://localhost:8080
2. Go to **"Manage Jenkins"** → **"Credentials"**
3. Click on **(global)** domain
4. Click **"Add Credentials"**
5. Fill in:
   - **Kind**: Secret text
   - **Scope**: Global
   - **Secret**: Paste your Vercel token
   - **ID**: `vercel-token` (must be exactly this!)
   - **Description**: Vercel Deployment Token
6. Click **"Create"**

### Verify Jenkinsfile

Your `Jenkinsfile` is already configured for Vercel! It includes:

- ✅ Vercel Preview deployment for non-main branches
- ✅ Vercel Production deployment for main branch
- ✅ Automatic installation of Vercel CLI

The deployment stages will:
```groovy
// For develop/feature branches
npx vercel --token=${VERCEL_TOKEN} --yes

// For main branch
npx vercel --prod --token=${VERCEL_TOKEN} --yes
```

---

## 🧪 Step 4: Test Deployment

### Test Preview Deployment (Develop Branch)

1. Create or switch to develop branch:
```bash
git checkout -b develop
```

2. Make a small change (e.g., update a comment)
```bash
echo "// Test deployment" >> src/App.jsx
```

3. Commit and push:
```bash
git add .
git commit -m "Test Vercel preview deployment"
git push origin develop
```

4. Watch Jenkins:
   - Go to your pipeline job
   - Click on the running build
   - Watch **"Console Output"**
   - Look for Vercel deployment URL

**Expected Output:**
```
🚀 Deploying to Vercel Preview environment...
✅ Preview: https://todo-app-abc123.vercel.app
```

### Test Production Deployment (Main Branch)

1. Merge to main:
```bash
git checkout main
git merge develop
git push origin main
```

2. Watch Jenkins deploy to production

**Expected Output:**
```
🚀 Deploying to Vercel Production...
✅ Production: https://your-todo-app.vercel.app
```

---

## 🔄 Understanding the Workflow

### Complete Deployment Flow

```
┌─────────────────────────────────────────────────┐
│  DEVELOPER: Push code to Git                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  JENKINS: Detects change                        │
│  • Checkout code                                │
│  • Install dependencies                         │
│  • Run linter                                   │
│  • Build application (dist/)                    │
│  • Archive artifacts                            │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
    [develop]       [main]
         │               │
         ▼               ▼
┌──────────────┐  ┌──────────────┐
│   PREVIEW    │  │  PRODUCTION  │
│              │  │              │
│ Vercel       │  │ Vercel       │
│ Preview URL  │  │ Production   │
│              │  │              │
│ For Testing  │  │ Live Site!   │
└──────────────┘  └──────────────┘
```

### Branch-Based Deployment

**Develop Branch (or feature branches):**
- Creates preview deployment
- Unique URL for each deployment
- Perfect for testing before production
- URL: `https://your-app-abc123.vercel.app`

**Main Branch:**
- Deploys to production
- Updates your live site
- URL: `https://your-app.vercel.app`

---

## 🎨 Vercel Features You Get

### 1. Preview Deployments
Every non-main branch gets a unique URL:
```
feature/new-button    → https://todo-app-xyz789.vercel.app
develop               → https://todo-app-abc123.vercel.app
bugfix/login-issue    → https://todo-app-def456.vercel.app
```

### 2. Automatic HTTPS
All deployments get free SSL certificates

### 3. Global CDN
Your app is distributed worldwide for fast loading

### 4. Instant Rollbacks
Revert to any previous deployment with one click

### 5. Environment Variables
Set different variables for preview vs production

### 6. Custom Domains
Add your own domain (e.g., mytodo.com)

---

## 🛠️ Configuration Files Explained

### vercel.json

```json
{
  "version": 2,
  "name": "todo-app",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**What it does:**
- Tells Vercel this is a Vite app
- Build command: `npm run build`
- Output: `dist/` folder
- Routes: All URLs go to index.html (SPA routing)

### Jenkinsfile (Vercel Stages)

**Preview Deployment:**
```groovy
stage('Deploy to Vercel Preview') {
    when {
        not { branch 'main' }
    }
    steps {
        withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
            sh 'npx vercel --token=${VERCEL_TOKEN} --yes'
        }
    }
}
```

**Production Deployment:**
```groovy
stage('Deploy to Vercel Production') {
    when {
        branch 'main'
    }
    steps {
        withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
            sh 'npx vercel --prod --token=${VERCEL_TOKEN} --yes'
        }
    }
}
```

---

## 🐛 Troubleshooting

### Issue 1: "vercel: command not found"

**Problem:** Vercel CLI not installed

**Solution:** The Jenkinsfile uses `npx vercel` which automatically installs it. If still failing, add to Jenkinsfile:
```groovy
sh 'npm install -g vercel'
```

---

### Issue 2: "Error: Missing required scope"

**Problem:** Vercel token doesn't have correct permissions

**Solution:**
1. Go to Vercel → Settings → Tokens
2. Delete old token
3. Create new token with **Full Account** scope
4. Update in Jenkins credentials

---

### Issue 3: "Error: No Vercel project found"

**Problem:** Project not linked to Vercel

**Solution:** Run once manually first:
```bash
# In your project directory
npx vercel login
npx vercel link
```

Then commit the `.vercel` folder to Git (optional).

---

### Issue 4: Deployment succeeds but shows 404

**Problem:** Routing configuration issue

**Solution:** Check `vercel.json` has correct routes:
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

### Issue 5: "Error: Invalid token"

**Problem:** Token expired or incorrect

**Solution:**
1. Generate new token in Vercel
2. Update in Jenkins:
   - Manage Jenkins → Credentials
   - Find "vercel-token"
   - Click "Update"
   - Paste new token

---

## 📊 Monitoring Deployments

### In Jenkins

Check deployment status:
1. Go to your pipeline job
2. Click on build number
3. Check console output
4. Look for Vercel deployment URL

### In Vercel Dashboard

Monitor all deployments:
1. Go to https://vercel.com
2. Click on your project
3. See all deployments
4. Check logs, performance, analytics

---

## 🎯 Deployment Checklist

Use this checklist for your first deployment:

### Initial Setup
- [ ] Vercel account created
- [ ] Project imported to Vercel manually once
- [ ] Vercel token generated
- [ ] Token added to Jenkins credentials
- [ ] `vercel.json` file created
- [ ] Jenkinsfile updated with Vercel stages

### Test Deployment
- [ ] Push to develop branch
- [ ] Jenkins build succeeds
- [ ] Preview URL generated
- [ ] Can access preview site
- [ ] Site works correctly

### Production Deployment
- [ ] Push to main branch
- [ ] Jenkins build succeeds
- [ ] Production deployment successful
- [ ] Can access production site
- [ ] Site works correctly

### Post-Deployment
- [ ] Set up custom domain (optional)
- [ ] Configure environment variables (if needed)
- [ ] Set up monitoring/analytics
- [ ] Test rollback process

---

## 🚀 Advanced Configuration

### Environment Variables

Add environment variables in Vercel:
1. Go to project settings
2. Click **"Environment Variables"**
3. Add variables:
   - Name: `VITE_API_URL`
   - Value: `https://api.example.com`
   - Environment: Production / Preview

Access in your app:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Custom Domain

1. Go to project settings → **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `mytodo.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~24 hours max)

### Automatic Git Integration

For even more automation, enable Vercel's Git integration:
1. Vercel detects Git pushes automatically
2. Builds and deploys without Jenkins
3. Jenkins becomes optional (but useful for complex pipelines)

---

## 💡 Tips & Best Practices

### 1. Use Preview Deployments
Always test on preview before merging to main:
```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Test on preview URL
# Merge to main only if working
```

### 2. Descriptive Commit Messages
Vercel shows commit messages in dashboard:
```bash
git commit -m "feat: Add dark mode toggle"
git commit -m "fix: Correct todo deletion bug"
```

### 3. Monitor Build Times
Check Vercel dashboard for:
- Build duration
- Bundle size
- Performance metrics

### 4. Set Up Notifications
Get notified of deployments:
- Vercel → Project Settings → Git → Notifications
- Enable Slack/Discord/Email notifications

### 5. Keep Token Safe
- Never commit tokens to Git
- Rotate tokens periodically
- Use scoped tokens when possible

---

## 📈 What's Next?

After successful deployment:

### Week 1: Master Basics
- ✅ Deploy to preview
- ✅ Deploy to production
- ✅ Test rollbacks
- ✅ Monitor deployments

### Week 2: Advanced Features
- 🎯 Add custom domain
- 🎯 Set up environment variables
- 🎯 Configure Vercel analytics
- 🎯 Optimize build performance

### Week 3: Production Ready
- 🚀 Set up monitoring
- 🚀 Configure alerts
- 🚀 Document deployment process
- 🚀 Train team members

---

## 🎉 Success!

You now have:
- ✅ Automated deployment to Vercel
- ✅ Preview deployments for testing
- ✅ Production deployment from main branch
- ✅ Global CDN and HTTPS
- ✅ Professional CI/CD workflow

**Your Todo App is now live on Vercel! 🚀**

---

## 📞 Need Help?

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Vercel GitHub Discussions](https://github.com/vercel/vercel/discussions)
- Stack Overflow (tag: vercel)

### Troubleshooting
- Check Jenkins console output
- Check Vercel deployment logs
- Review this guide's troubleshooting section

---

## 🎓 You've Learned

- ✅ How to deploy to Vercel with Jenkins
- ✅ Branch-based deployment strategies
- ✅ Preview vs Production deployments
- ✅ Vercel configuration and features
- ✅ Troubleshooting deployment issues

**Congratulations on becoming a deployment pro! 🎊**

---

*Last Updated: November 2025*  
*Created for: Todo App Vercel Deployment*

