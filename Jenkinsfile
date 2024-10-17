pipeline {
    agent any 

    stages {
        stage('Clone Repo') {
            steps {
                // Clone the repository from the main branch
                git branch: 'main', url: 'https://github.com/alay2003/Grocery-store.git'
            }
        }

        stage('Build') {
            steps {
                // Install project dependencies
                bat 'npm install' // Use 'bat' for Windows to execute commands
            }
        }

        stage('Test') {
            steps {
                // Run tests
                bat 'node cart_test.js' // Use 'bat' for Windows
            }
        }
    }

    post {
        success {
            echo 'Build and tests completed successfully!'
        }
        failure {
            echo 'Build or tests failed.'
        }
    }
}
