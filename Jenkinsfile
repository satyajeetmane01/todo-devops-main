pipeline {
    // 'agent any' means this pipeline can run on any available Jenkins agent/node
    agent any
    
    // Environment variables that will be available throughout the pipeline
    environment {
        // Node version to use (you can adjust this)
        NODE_VERSION = '20'
        
        // Directory where build artifacts will be stored
        BUILD_DIR = 'dist'
        
        // Email for notifications (change this to your email)
        NOTIFICATION_EMAIL = 'your-email@example.com'
    }
    
    // Define the stages of your CI/CD pipeline
    stages {
        
        // ==========================================
        // STAGE 1: CHECKOUT CODE
        // ==========================================
        // This stage checks out your code from Git
        // Jenkins usually does this automatically, but we include it for clarity
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from repository...'
                // The checkout step fetches code from your version control
                checkout scm
            }
        }
        
        // ==========================================
        // STAGE 2: INSTALL DEPENDENCIES
        // ==========================================
        // Install all npm packages listed in package.json
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                script {
                    // Use 'npm ci' instead of 'npm install' for CI/CD
                    // npm ci is faster and more reliable for automated builds
                    sh 'npm ci'
                }
            }
        }
        
        // ==========================================
        // STAGE 3: LINT CODE
        // ==========================================
        // Check code quality and standards using ESLint
        stage('Lint Code') {
            steps {
                echo '🔍 Running ESLint to check code quality...'
                script {
                    // Run the lint command from package.json
                    sh 'npm run lint'
                }
            }
        }
        
        // ==========================================
        // STAGE 4: BUILD APPLICATION
        // ==========================================
        // Create production-ready build
        stage('Build Application') {
            steps {
                echo '🏗️  Building the application for production...'
                script {
                    // Run vite build - this creates optimized files in dist/
                    sh 'npm run build'
                }
            }
        }
        
        // ==========================================
        // STAGE 5: TEST BUILD
        // ==========================================
        // Verify that the build was successful
        stage('Test Build') {
            steps {
                echo '✅ Verifying build output...'
                script {
                    // Check if the build directory exists
                    sh '''
                        if [ -d "${BUILD_DIR}" ]; then
                            echo "✓ Build directory exists"
                            echo "Build directory contents:"
                            ls -lh ${BUILD_DIR}
                        else
                            echo "✗ Build directory not found!"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        // ==========================================
        // STAGE 6: ARCHIVE ARTIFACTS
        // ==========================================
        // Save the build files in Jenkins for later use
        stage('Archive Artifacts') {
            steps {
                echo '📦 Archiving build artifacts...'
                // This keeps your build files in Jenkins
                archiveArtifacts artifacts: "${BUILD_DIR}/**/*", 
                                 fingerprint: true,
                                 allowEmptyArchive: false
            }
        }
        
        // ==========================================
        // STAGE 7: DEPLOY TO VERCEL (Preview)
        // ==========================================
        // Deploy to Vercel preview environment for testing
        stage('Deploy to Vercel Preview') {
            when {
                // Deploy preview for non-main branches (develop, feature branches, etc.)
                not {
                    branch 'main'
                }
            }
            steps {
                echo '🚀 Deploying to Vercel Preview environment...'
                script {
                    // Deploy to Vercel preview (non-production)
                    // This creates a unique preview URL for testing
                    withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                        sh '''
                            npx vercel --token=${VERCEL_TOKEN} --yes
                        '''
                    }
                }
            }
        }
        
        // ==========================================
        // STAGE 8: DEPLOY TO VERCEL PRODUCTION
        // ==========================================
        // Deploy to Vercel production environment
        stage('Deploy to Vercel Production') {
            when {
                // Only deploy to production from 'main' branch
                branch 'main'
            }
            steps {
                echo '🚀 Deploying to Vercel Production...'
                script {
                    // Deploy to Vercel production
                    // This updates your live site at your-app.vercel.app
                    withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                        sh '''
                            npx vercel --prod --token=${VERCEL_TOKEN} --yes
                        '''
                    }
                }
            }
        }
    }
    
    // ==========================================
    // POST-BUILD ACTIONS
    // ==========================================
    // These run after all stages complete
    post {
        // Runs if the build succeeds
        success {
            echo '✅ Pipeline completed successfully!'
            // You can add email notifications here
            // emailext (
            //     subject: "✅ Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //     body: "The build completed successfully!",
            //     to: "${NOTIFICATION_EMAIL}"
            // )
        }
        
        // Runs if the build fails
        failure {
            echo '❌ Pipeline failed!'
            // Send failure notification
            // emailext (
            //     subject: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //     body: "The build failed. Check Jenkins for details.",
            //     to: "${NOTIFICATION_EMAIL}"
            // )
        }
        
        // Always runs, regardless of success/failure
        always {
            echo '🧹 Cleaning up workspace...'
            // Clean up workspace to save disk space
            cleanWs()
        }
    }
}

