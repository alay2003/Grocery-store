pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'alaypatel' // Replace with your Jenkins credential ID
        DOCKER_IMAGE_NAME = 'alay2003' // Replace with your Docker Hub username
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    // Install dependencies
                    bat 'npm install'
                }
            }
        }

        stage('Start Server') {
            steps {
                script {
                    // Start the server in the background
                    bat 'start cmd /c node server.js'
                    sleep 10 // wait for the server to start
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Run the tests
                    bat 'node cart_test.js'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    bat "docker build -t ${DOCKER_IMAGE_NAME}:${env.BUILD_ID} ."
                }
            }
        }

        stage('Push Docker Image') {
    steps {
        script {
            withCredentials([usernamePassword(credentialsId: 'alaypatel', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                bat "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                bat "docker push alay2003:37"
            }
        }
    }
}

    }

    post {
        always {
            script {
                // Clean up actions, if needed
                echo 'Cleaning up...'
                // You could stop the server or perform other cleanup actions here
            }
        }
    }
}
