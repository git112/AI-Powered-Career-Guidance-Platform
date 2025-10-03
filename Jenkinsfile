pipeline {
    // 1. Specify where to run the pipeline
    agent any

    // 2. Define the stages of the pipeline
    stages {
        // Stage 1: Checkout the code
        stage('Checkout') {
            steps {
                // This command clones your repository
                git branch: 'main', url: 'https://github.com/git112/AI-Powered-Career-Guidance-Platform.git'
            }
        }

        // Stage 2: Build the application
        stage('Build') {
            steps {
                // This command builds your Docker images using your docker-compose file
                sh 'docker-compose build'
            }
        }

        // Stage 3: Deploy the application
        stage('Deploy') {
            steps {
                // These commands stop any old versions and start the new ones
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
}