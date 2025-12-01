# 📝 Todo App with Productivity Features

A modern, feature-rich todo application built with React and Vite, featuring Pomodoro timer, focus mode, and productivity analytics.

## ✨ Features

- ✅ **Task Management** - Add, edit, delete, and complete todos
- 🎯 **Priority Levels** - Set high, medium, or low priority
- 📁 **Categories** - Organize tasks by category
- 📅 **Due Dates** - Set deadlines for your tasks
- 🔍 **Search & Filter** - Find tasks quickly
- 🍅 **Pomodoro Timer** - Built-in time management
- 🎯 **Focus Mode** - Distraction-free task completion
- 📊 **Analytics** - Track your productivity
- 💾 **Local Storage** - Your data persists automatically

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd todo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🏗️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **date-fns** - Date manipulation
- **lucide-react** - Icon library
- **ESLint** - Code quality

## 🤖 CI/CD with Jenkins → Vercel Deployment

This project includes a complete Jenkins pipeline setup for automated deployment to Vercel!

### ⚡ Quick Deploy to Vercel (5 Minutes)

```bash
# Option 1: Automatic with Jenkins
./setup-jenkins.sh
# Then follow VERCEL_QUICK_SETUP.md

# Option 2: Manual deployment
npm run deploy
```

### 📚 Documentation

- ⚡ **[VERCEL_QUICK_SETUP.md](./VERCEL_QUICK_SETUP.md)** - Deploy in 5 minutes!
- 📖 **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)** - Complete Vercel guide
- 📖 **[JENKINS_QUICKSTART.md](./JENKINS_QUICKSTART.md)** - Get Jenkins running
- 📚 **[JENKINS_GUIDE.md](./JENKINS_GUIDE.md)** - Comprehensive Jenkins guide
- ⚙️ **[Jenkinsfile](./Jenkinsfile)** - Pipeline configuration

### 🚀 What the Pipeline Does

1. ✅ Checks out code from Git
2. ✅ Installs npm dependencies
3. ✅ Runs ESLint for code quality
4. ✅ Builds the production app
5. ✅ Archives build artifacts
6. ✅ **Deploys to Vercel Preview** (develop branch)
7. ✅ **Deploys to Vercel Production** (main branch)

### 🌐 Deployment Flow

```
Push to 'develop' → Jenkins → Vercel Preview (testing)
Push to 'main'    → Jenkins → Vercel Production (live!)
```

Perfect for:
- Learning DevOps and CI/CD concepts
- Automated Vercel deployments
- Preview deployments for testing
- Ensuring code quality
- Professional deployment workflow

## 📁 Project Structure

```
todo/
├── src/
│   ├── components/          # React components
│   │   ├── AddTodo.jsx
│   │   ├── TodoItem.jsx
│   │   ├── TodoList.jsx
│   │   ├── FilterBar.jsx
│   │   ├── StatsPanel.jsx
│   │   ├── PomodoroTimer.jsx
│   │   ├── FocusMode.jsx
│   │   └── ProductivityAnalytics.jsx
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── Jenkinsfile             # CI/CD pipeline
├── docker-compose.jenkins.yml  # Jenkins setup
├── setup-jenkins.sh        # Automated Jenkins setup
├── JENKINS_GUIDE.md        # Jenkins learning guide
├── JENKINS_QUICKSTART.md   # Quick start guide
├── package.json            # Dependencies
└── vite.config.js          # Vite configuration
```

## 🎨 Component Overview

### Core Components
- **AddTodo** - Form to add new tasks
- **TodoItem** - Individual task display and editing
- **TodoList** - List of all todos
- **FilterBar** - Search and filter controls
- **StatsPanel** - Quick statistics overview

### Productivity Components
- **PomodoroTimer** - Time management timer
- **FocusMode** - Distraction-free interface
- **ProductivityAnalytics** - Detailed productivity insights

## 🌐 Deployment Options

This app can be deployed to:

- **Netlify** (recommended for beginners)
- **Vercel** 
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Any static hosting service**

See [JENKINS_GUIDE.md](./JENKINS_GUIDE.md) for detailed deployment instructions.

## 🔧 Configuration

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder, ready for deployment.

### Vite Configuration

The project uses standard Vite configuration. To customize:
- Edit `vite.config.js`
- See [Vite documentation](https://vite.dev/config/)

### ESLint Configuration

Code quality rules are defined in `eslint.config.js`. Customize as needed.

## 📝 Environment Variables

Currently, no environment variables are required. For production deployments:

1. Create `.env.production` file
2. Add any API keys or configuration
3. Access via `import.meta.env.VITE_*`

## 🐛 Troubleshooting

### Development Server Issues
```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm run dev
```

### Build Errors
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Jenkins Issues
See [JENKINS_GUIDE.md](./JENKINS_GUIDE.md) for common Jenkins problems and solutions.

## 📚 Learning Resources

### React + Vite
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)

### DevOps & Jenkins
- [JENKINS_QUICKSTART.md](./JENKINS_QUICKSTART.md) - Start here!
- [JENKINS_GUIDE.md](./JENKINS_GUIDE.md) - Complete guide
- [Jenkins Official Docs](https://www.jenkins.io/doc/)

## 🤝 Contributing

This is a learning project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Learning Goals

This project is perfect for learning:
- ✅ React state management with hooks
- ✅ Component composition
- ✅ Local storage integration
- ✅ Modern CSS styling
- ✅ **CI/CD with Jenkins**
- ✅ **DevOps practices**
- ✅ **Automated deployments**

## 🙏 Acknowledgments

- Built with [Vite](https://vite.dev/)
- UI inspired by modern productivity apps
- Icons from [Lucide React](https://lucide.dev/)

---

**Happy coding and learning DevOps! 🚀**

For Jenkins setup, start here: [JENKINS_QUICKSTART.md](./JENKINS_QUICKSTART.md)
