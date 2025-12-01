# 🚀 Jenkins Pipeline Guide for Beginners

This guide will help you understand and set up Jenkins CI/CD for your Todo App.

---

## 📚 Table of Contents

1. [What is Jenkins?](#what-is-jenkins)
2. [What is CI/CD?](#what-is-cicd)
3. [Understanding the Pipeline](#understanding-the-pipeline)
4. [Prerequisites](#prerequisites)
5. [Setting Up Jenkins](#setting-up-jenkins)
6. [Creating Your First Pipeline](#creating-your-first-pipeline)
7. [Deployment Options](#deployment-options)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Next Steps](#next-steps)

---

## 🤔 What is Jenkins?

**Jenkins** is an **automation server** that helps you:
- ✅ Automatically build your code when you push changes
- ✅ Run tests to catch bugs early
- ✅ Deploy your application automatically
- ✅ Save time by automating repetitive tasks

Think of it as a **robot assistant** for developers!

---

## 🔄 What is CI/CD?

### CI (Continuous Integration)
- Automatically **build and test** your code when changes are made
- Catches bugs early before they reach production
- Example: Every time you push code to GitHub, Jenkins builds it

### CD (Continuous Deployment/Delivery)
- Automatically **deploy** your app to servers
- Gets new features to users faster
- Example: After successful build, Jenkins deploys to your website

### The Flow:
```
Developer pushes code to Git
    ↓
Jenkins detects the change
    ↓
Jenkins pulls the latest code
    ↓
Jenkins installs dependencies
    ↓
Jenkins runs linting/tests
    ↓
Jenkins builds the app
    ↓
Jenkins deploys to server
    ↓
Users see the new version! 🎉
```

---

## 🔍 Understanding the Pipeline

Let's break down each stage of our Jenkinsfile:

### Stage 1: Checkout
```groovy
stage('Checkout') {
    steps {
        checkout scm
    }
}
```
**What it does:** Gets your code from Git  
**Why:** Jenkins needs the latest code to build

---

### Stage 2: Install Dependencies
```groovy
stage('Install Dependencies') {
    steps {
        sh 'npm ci'
    }
}
```
**What it does:** Installs all npm packages  
**Why:** Your app needs React, Vite, etc. to build  
**Note:** `npm ci` is like `npm install` but faster for automation

---

### Stage 3: Lint Code
```groovy
stage('Lint Code') {
    steps {
        sh 'npm run lint'
    }
}
```
**What it does:** Checks code quality with ESLint  
**Why:** Catches coding mistakes and maintains standards  
**Fails if:** Code has syntax errors or style violations

---

### Stage 4: Build Application
```groovy
stage('Build Application') {
    steps {
        sh 'npm run build'
    }
}
```
**What it does:** Creates production-ready files in `dist/` folder  
**Why:** Vite optimizes your React app for production  
**Output:** Minified, bundled files ready for deployment

---

### Stage 5: Test Build
```groovy
stage('Test Build') {
    steps {
        sh 'ls -lh dist'
    }
}
```
**What it does:** Verifies the build was successful  
**Why:** Makes sure `dist/` folder exists with files

---

### Stage 6: Archive Artifacts
```groovy
stage('Archive Artifacts') {
    steps {
        archiveArtifacts artifacts: 'dist/**/*'
    }
}
```
**What it does:** Saves build files in Jenkins  
**Why:** You can download builds later or use them in other jobs

---

### Stage 7-8: Deploy
```groovy
stage('Deploy to Production') {
    when { branch 'main' }
    steps {
        // Deployment commands here
    }
}
```
**What it does:** Copies files to your web server  
**Why:** Makes your app live for users  
**Smart:** Only deploys from specific branches

---

## ✅ Prerequisites

Before setting up Jenkins, you need:

### 1. **Jenkins Server**
Options:
- Install locally: `brew install jenkins-lts` (Mac)
- Use Docker: `docker run -p 8080:8080 jenkins/jenkins:lts`
- Use cloud: AWS, Azure, DigitalOcean, etc.

### 2. **Git Repository**
- GitHub, GitLab, or Bitbucket
- Your code must be in version control

### 3. **Node.js on Jenkins Server**
- Jenkins needs Node.js to run npm commands
- Install via NodeJS Plugin (recommended)

---

## 🛠️ Setting Up Jenkins

### Step 1: Install Jenkins

#### Option A: Using Homebrew (Mac)
```bash
brew install jenkins-lts
brew services start jenkins-lts
```

#### Option B: Using Docker (All Platforms)
```bash
docker run -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```

#### Option C: Download from Website
- Go to https://www.jenkins.io/download/
- Download and install for your OS

---

### Step 2: Access Jenkins
1. Open browser to `http://localhost:8080`
2. Get initial admin password:
   ```bash
   # Mac/Linux
   cat ~/.jenkins/secrets/initialAdminPassword
   
   # Or from Docker logs
   docker logs <container-id>
   ```
3. Paste password and continue
4. Click "Install suggested plugins"
5. Create your admin user

---

### Step 3: Install Required Plugins

Go to: **Manage Jenkins → Plugins → Available Plugins**

Install these:
- ✅ **NodeJS Plugin** (to run npm commands)
- ✅ **Git Plugin** (usually pre-installed)
- ✅ **Pipeline Plugin** (usually pre-installed)
- ✅ **Email Extension Plugin** (for notifications)

---

### Step 4: Configure Node.js

1. Go to **Manage Jenkins → Tools**
2. Scroll to **NodeJS installations**
3. Click "Add NodeJS"
4. Name: `Node-20` (or any name)
5. Version: Select Node.js 20.x
6. Save

---

## 🎯 Creating Your First Pipeline

### Step 1: Create New Pipeline Job

1. Click **"New Item"** on Jenkins dashboard
2. Enter name: `todo-app-pipeline`
3. Select **"Pipeline"**
4. Click **OK**

---

### Step 2: Configure the Pipeline

#### General Tab:
- ✅ Check **"GitHub project"** (if using GitHub)
- Add your repository URL

#### Build Triggers:
Choose one or more:
- ✅ **Poll SCM**: Jenkins checks for changes periodically
  - Schedule: `H/5 * * * *` (every 5 minutes)
  
- ✅ **GitHub hook trigger**: GitHub notifies Jenkins (recommended)
  - Requires webhook setup in GitHub

#### Pipeline Section:
- **Definition**: Select "Pipeline script from SCM"
- **SCM**: Git
- **Repository URL**: Your Git repository URL
  - Example: `https://github.com/yourusername/todo.git`
- **Credentials**: Add if private repo
  - Click "Add" → Jenkins
  - Kind: Username with password
  - Username: Your GitHub username
  - Password: Your GitHub Personal Access Token
- **Branch Specifier**: `*/main` (or `*/master`)
- **Script Path**: `Jenkinsfile`

Click **Save**!

---

### Step 3: Run Your First Build

1. Click **"Build Now"** on the left sidebar
2. Watch the build progress in **"Build History"**
3. Click on the build number (e.g., #1)
4. Click **"Console Output"** to see detailed logs

---

## 🚀 Deployment Options

Now let's discuss where to deploy your Todo App:

### Option 1: Netlify (Easiest for Beginners) ⭐

**Setup:**
```bash
# Install Netlify CLI in your project
npm install --save-dev netlify-cli
```

**Add to Jenkinsfile:**
```groovy
stage('Deploy to Production') {
    steps {
        withCredentials([string(credentialsId: 'netlify-token', variable: 'NETLIFY_AUTH_TOKEN')]) {
            sh 'npx netlify deploy --prod --dir=dist --auth=$NETLIFY_AUTH_TOKEN'
        }
    }
}
```

**Steps:**
1. Get Netlify auth token from netlify.com
2. Add token to Jenkins Credentials
3. Run pipeline!

---

### Option 2: Vercel

**Setup:**
```bash
npm install --save-dev vercel
```

**Add to Jenkinsfile:**
```groovy
stage('Deploy to Production') {
    steps {
        withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
            sh 'npx vercel --prod --token=$VERCEL_TOKEN'
        }
    }
}
```

---

### Option 3: AWS S3 + CloudFront (Static Hosting)

**Prerequisites:**
- AWS account
- S3 bucket configured for static website hosting
- CloudFront distribution (optional, for CDN)

**Add to Jenkinsfile:**
```groovy
stage('Deploy to AWS S3') {
    steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
            sh '''
                aws s3 sync dist/ s3://your-bucket-name/ --delete
                aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
            '''
        }
    }
}
```

---

### Option 4: Traditional Server (VPS/EC2)

**Prerequisites:**
- A server with Nginx/Apache
- SSH access

**Add to Jenkinsfile:**
```groovy
stage('Deploy to Server') {
    steps {
        sshagent(['server-ssh-key']) {
            sh '''
                scp -r dist/* user@your-server.com:/var/www/html/
                ssh user@your-server.com "sudo systemctl reload nginx"
            '''
        }
    }
}
```

---

### Option 5: GitHub Pages (Free!)

**Add to Jenkinsfile:**
```groovy
stage('Deploy to GitHub Pages') {
    steps {
        sh '''
            git config user.name "Jenkins"
            git config user.email "jenkins@example.com"
            npm install --save-dev gh-pages
            npx gh-pages -d dist
        '''
    }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "npm: command not found"
**Problem:** Jenkins doesn't have Node.js  
**Solution:** 
1. Install NodeJS plugin in Jenkins
2. Configure Node.js in Tools
3. Add to Jenkinsfile:
   ```groovy
   tools {
       nodejs 'Node-20'
   }
   ```

---

### Issue 2: "Permission denied" during deployment
**Problem:** Jenkins can't access server  
**Solution:**
1. Add SSH credentials in Jenkins
2. Use `sshagent` in Jenkinsfile
3. Ensure Jenkins user has proper permissions

---

### Issue 3: Build succeeds but deployment fails
**Problem:** Deployment credentials or paths incorrect  
**Solution:**
1. Check credentials in Jenkins
2. Verify server paths
3. Test deployment commands manually first

---

### Issue 4: "Git repository not found"
**Problem:** Jenkins can't access your Git repo  
**Solution:**
1. For private repos: Add GitHub credentials
2. Use HTTPS URL, not SSH (easier)
3. Check repository URL is correct

---

## 📈 Next Steps

### Level 1: Basic (You are here!)
- ✅ Understand what Jenkins does
- ✅ Create a basic pipeline
- ✅ Build and lint your code

### Level 2: Intermediate
- 🎯 Add automated tests
- 🎯 Set up webhooks for automatic builds
- 🎯 Deploy to staging environment
- 🎯 Add email notifications

### Level 3: Advanced
- 🚀 Add unit tests with Jest
- 🚀 Add E2E tests with Cypress/Playwright
- 🚀 Implement blue-green deployment
- 🚀 Add code coverage reports
- 🚀 Set up multi-branch pipeline
- 🚀 Add Docker containerization

---

## 📝 Learning Path

### Week 1-2: Jenkins Basics
- Install and configure Jenkins
- Create your first pipeline
- Understand the Jenkinsfile syntax

### Week 3-4: CI/CD Concepts
- Set up automated builds
- Learn about Git webhooks
- Configure build triggers

### Week 5-6: Deployment
- Choose a hosting platform
- Set up deployment credentials
- Deploy automatically

### Week 7-8: Advanced Topics
- Add automated tests
- Set up notifications
- Implement staging environments

---

## 🔗 Useful Resources

### Official Documentation
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax Reference](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Jenkins Plugins](https://plugins.jenkins.io/)

### Video Tutorials
- "Jenkins Tutorial for Beginners" on YouTube
- "CI/CD Pipeline with Jenkins" courses on Udemy

### Communities
- [Jenkins Community Forums](https://community.jenkins.io/)
- Stack Overflow (tag: jenkins)
- Reddit: r/devops

---

## 💡 Tips for Beginners

1. **Start Simple**: Don't try to do everything at once
2. **Read the Logs**: Console output tells you what went wrong
3. **Test Locally First**: Run commands on your machine before adding to Jenkins
4. **Use Version Control**: Always commit your Jenkinsfile
5. **Document Everything**: Add comments in your Jenkinsfile
6. **Ask for Help**: DevOps community is very helpful!

---

## 🎓 Quiz Your Knowledge

Can you answer these?

1. What does `npm ci` do?
2. Why do we lint code before building?
3. What's the difference between staging and production?
4. When should the pipeline run?
5. What happens if the lint stage fails?

**Answers at the bottom** ⬇️

---

## 📞 Getting Help

If you get stuck:

1. **Check Console Output** in Jenkins (90% of issues are visible here)
2. **Google the Error Message** (usually someone else had it)
3. **Ask on Stack Overflow** with the `jenkins` tag
4. **Jenkins Community Forums** are very active

---

## ✅ Checklist Before Going Live

- [ ] Jenkins is installed and accessible
- [ ] NodeJS plugin is installed
- [ ] Pipeline job is created
- [ ] Jenkinsfile is in your repository
- [ ] Build succeeds locally
- [ ] Pipeline runs successfully in Jenkins
- [ ] Deployment credentials are configured
- [ ] Test deployment to staging first
- [ ] Verify app works after deployment
- [ ] Set up email/Slack notifications

---

## 🎉 Congratulations!

You now understand the basics of Jenkins and CI/CD! Remember:
- 🐢 Start slow, master the basics
- 📚 Keep learning and experimenting
- 🤝 Join DevOps communities
- 💪 Practice makes perfect

Happy Building! 🚀

---

## Quiz Answers

1. **`npm ci`**: Clean install of dependencies, faster and more reliable than `npm install` for CI/CD
2. **Linting before building**: Catches code quality issues early, saves time by failing fast
3. **Staging vs Production**: Staging is for testing, production is live for real users
4. **When to run**: Automatically when code is pushed, or manually triggered
5. **If lint fails**: Pipeline stops, build doesn't happen, no deployment occurs

---

*Last Updated: November 2025*
*Created for: Todo App Jenkins Pipeline*

