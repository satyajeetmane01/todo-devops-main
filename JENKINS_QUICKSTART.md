# 🚀 Jenkins Quick Start

## Get Jenkins Running in 5 Minutes!

This guide will get you up and running with Jenkins for your Todo App.

---

## 🎯 Option 1: One-Command Setup (Recommended for Beginners)

Run this script to automatically set up Jenkins:

```bash
./setup-jenkins.sh
```

That's it! The script will:
- ✅ Check if Docker is installed and running
- ✅ Pull and start Jenkins container
- ✅ Wait for Jenkins to be ready
- ✅ Display your admin password
- ✅ Show you next steps

---

## 🐳 Option 2: Manual Docker Setup

If you prefer to do it manually:

### Step 1: Start Jenkins
```bash
docker-compose -f docker-compose.jenkins.yml up -d
```

### Step 2: Wait a minute for Jenkins to start

### Step 3: Get the admin password
```bash
docker exec todo-app-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Step 4: Open Jenkins
Open http://localhost:8080 in your browser

---

## 📚 What You'll Get

After setup, you'll have:

1. **Jenkins running locally** at http://localhost:8080
2. **A complete Jenkinsfile** ready to use
3. **Comprehensive guide** (JENKINS_GUIDE.md) explaining everything
4. **Working pipeline** that can build your Todo App

---

## 🎓 Learning Path

### Step 1: Install Jenkins (5 minutes)
- Run the setup script
- Access Jenkins web interface
- Install suggested plugins

### Step 2: Understand the Basics (30 minutes)
- Read the [JENKINS_GUIDE.md](./JENKINS_GUIDE.md)
- Learn what CI/CD means
- Understand the pipeline stages

### Step 3: Create Your First Pipeline (15 minutes)
- Create a new pipeline job in Jenkins
- Point it to your Git repository
- Use the provided Jenkinsfile

### Step 4: Run Your First Build (5 minutes)
- Click "Build Now"
- Watch the pipeline execute
- See your app get built automatically!

### Step 5: Set Up Deployment (varies)
- Choose a hosting platform (Netlify, Vercel, AWS, etc.)
- Configure deployment credentials
- Enable automatic deployments

**Total time to first successful build: ~1 hour**

---

## 📂 Files Included

```
todo/
├── Jenkinsfile                      # Pipeline definition
├── JENKINS_GUIDE.md                 # Comprehensive learning guide
├── JENKINS_QUICKSTART.md           # This file
├── docker-compose.jenkins.yml      # Docker setup for Jenkins
└── setup-jenkins.sh                # Automated setup script
```

---

## ❓ Common Questions

### Q: Do I need to know Docker?
**A:** No! The setup script handles everything. Just install Docker Desktop and run the script.

### Q: Will this work on my Mac/Windows/Linux?
**A:** Yes! Docker works on all platforms. Just install Docker Desktop first.

### Q: Do I need a server to run Jenkins?
**A:** Not for learning! Run Jenkins locally on your machine using Docker.

### Q: Can I use this for real projects?
**A:** Absolutely! This is a production-ready setup. For real projects, you'd run Jenkins on a dedicated server.

### Q: What if I break something?
**A:** No worries! Just delete everything and start over:
```bash
docker-compose -f docker-compose.jenkins.yml down -v
./setup-jenkins.sh
```

### Q: Do I need to pay for Jenkins?
**A:** Nope! Jenkins is 100% free and open source.

---

## 🆘 Troubleshooting

### Jenkins won't start
```bash
# Check if Docker is running
docker ps

# Check Jenkins logs
docker logs todo-app-jenkins

# Restart Jenkins
docker-compose -f docker-compose.jenkins.yml restart
```

### Can't access Jenkins at localhost:8080
- Make sure Docker is running
- Check if port 8080 is already in use
- Try `docker ps` to see if container is running

### "Permission denied" errors
```bash
# Make sure the script is executable
chmod +x setup-jenkins.sh

# Or run with bash
bash setup-jenkins.sh
```

### Build fails with "npm: command not found"
- Install NodeJS plugin in Jenkins
- Configure Node.js in Tools section
- See JENKINS_GUIDE.md for detailed instructions

---

## 🎯 Your First Build Checklist

Follow this checklist for your first successful build:

- [ ] Docker is installed and running
- [ ] Jenkins is started (`./setup-jenkins.sh`)
- [ ] Jenkins is accessible at http://localhost:8080
- [ ] Initial setup wizard is completed
- [ ] NodeJS plugin is installed
- [ ] Node.js is configured in Tools
- [ ] New pipeline job is created
- [ ] Git repository is connected
- [ ] Jenkinsfile is in your repository
- [ ] First build is triggered
- [ ] Build completes successfully! 🎉

---

## 📖 Next: Read the Full Guide

For a deep dive into Jenkins and CI/CD concepts, read:

👉 **[JENKINS_GUIDE.md](./JENKINS_GUIDE.md)**

It covers:
- What is Jenkins and why use it?
- CI/CD concepts explained
- Detailed explanation of each pipeline stage
- How to set up deployments
- Common issues and solutions
- Resources for learning more

---

## 💡 Quick Commands Reference

```bash
# Start Jenkins
docker-compose -f docker-compose.jenkins.yml up -d

# Stop Jenkins
docker-compose -f docker-compose.jenkins.yml down

# View logs
docker logs -f todo-app-jenkins

# Restart Jenkins
docker-compose -f docker-compose.jenkins.yml restart

# Complete cleanup (deletes all Jenkins data)
docker-compose -f docker-compose.jenkins.yml down -v

# Get admin password
docker exec todo-app-jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Access Jenkins shell (advanced)
docker exec -it todo-app-jenkins bash
```

---

## 🎉 Ready to Start?

Run this command now:

```bash
./setup-jenkins.sh
```

Then open http://localhost:8080 and follow the setup wizard!

Happy learning! 🚀

---

## 📞 Need Help?

- Check [JENKINS_GUIDE.md](./JENKINS_GUIDE.md) for detailed instructions
- Search Stack Overflow with tag `jenkins`
- Visit [Jenkins Documentation](https://www.jenkins.io/doc/)
- Join [Jenkins Community Forums](https://community.jenkins.io/)

---

*Last Updated: November 2025*

