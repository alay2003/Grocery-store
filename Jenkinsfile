pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'docker-ishaan' // Replace with your Jenkins credential ID
        DOCKER_IMAGE_NAME = 'ishaanbhadrike/grocery-store' // Updated Docker image name
        IMAGE_TAG = 'alay' // Specify the tag for the image
        K8S_NAMESPACE = 'elk' // Kubernetes namespace for ELK
        GIT_BRANCH = 'Ishaan' // Specify the new branch name
        KUBECONFIG = 'C:\\Users\\ibhad\\.kube\\config' // Path to your kubeconfig file
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Checkout the specified branch
                    checkout([$class: 'GitSCM', branches: [[name: "*/${GIT_BRANCH}"]], 
                    userRemoteConfigs: [[url: 'https://github.com/alay2003/Grocery-store.git']]])
                }
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
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
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

        stage('Terraform Init') {
            steps {
                script {
                    // Initialize Terraform
                    bat 'terraform init'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                script {
                    // Apply Terraform configuration
                    bat 'terraform apply -auto-approve'
                }
            }
        }

        stage('Create ELK Namespace') {
            steps {
                script {
                    // Create the namespace if it doesn't exist
                    bat "kubectl create namespace ${K8S_NAMESPACE} || echo 'Namespace already exists'"
                }
            }
        }

        stage('Deploy ELK Stack') {
            steps {
                script {
                    // Apply the ELK ConfigMap and other resources
                    bat "kubectl apply -f logstash-config.yaml -n ${K8S_NAMESPACE} --validate=false"
                    bat "kubectl apply -f elasticsearch-deployment.yaml -n ${K8S_NAMESPACE} --validate=false"
                    bat "kubectl apply -f kibana-deployment.yaml -n ${K8S_NAMESPACE} --validate=false"
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