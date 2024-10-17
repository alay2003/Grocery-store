pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'docker-hub-token' // Replace with your Jenkins credential ID
        DOCKER_IMAGE_NAME = 'alay2003/grocery-store' // Updated Docker image name
        IMAGE_TAG = 'alay' // Specify the tag for the image
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
                    // Build the Docker image using Docker
                    bat "docker build -t ${DOCKER_IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

       stage('Login to Docker') {
    steps {
        script {
            withCredentials([usernamePassword(credentialsId: 'docker-hub-token', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"
            }
        }
    }
}


        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to Docker Hub
                    bat "docker push ${DOCKER_IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                script {
                    // Run Docker Compose to start the application
                    bat "docker-compose up -d"
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
