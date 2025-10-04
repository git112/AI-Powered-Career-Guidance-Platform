pipeline {
    agent any

    // This block loads all your secrets from Jenkins Credentials
    environment {
        // For Frontend
        VITE_GOOGLE_CLIENT_ID = credentials('VITE_GOOGLE_CLIENT_ID')
        
        MONGO_URI             = credentials('MONGO_URI')
        JWT_SECRET            = credentials('JWT_SECRET')
        GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
        GOOGLE_CLIENT_SECRET  = credentials('GOOGLE_CLIENT_SECRET')
        GEMINI_API_KEY        = credentials('GEMINI_API_KEY')
        EMAIL_FROM            = credentials('EMAIL_FROM')
        SESSION_SECRET        = credentials('SESSION_SECRET')
        GOOGLE_REDIRECT_URI   = credentials('GOOGLE_REDIRECT_URI')
        EMAIL_PASSWORD        = credentials('EMAIL_PASSWORD')
        FRONTEND_URL          = credentials('FRONTEND_URL')
        NODE_ENV              = credentials('NODE_ENV')
        PORT                  = credentials('PORT')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/git112/AI-Powered-Career-Guidance-Platform.git'
            }
        }

        stage('Build') {
            steps {
                // This build step now has access to VITE_GOOGLE_CLIENT_ID
                sh 'docker-compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                // This 'up' command now has access to all the backend secrets
                sh 'docker-compose up -d'
            }
        }
    }
}