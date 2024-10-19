pipeline {
    agent any

    environment {
        // Docker Hub credentials ID
        DOCKER_HUB_CREDENTIALS = 'docker-hub-token' 

        // Updated Docker image name and tag
        DOCKER_IMAGE_NAME = 'alay2003/grocery_store'
        IMAGE_TAG = 'alayp'

        // Kubernetes namespace for ELK
        K8S_NAMESPACE = 'elk1' 

        // Azure Service Principal credentials (direct assignment)
        ARM_CLIENT_ID = 'azure-sp-client-id' // Azure clientId 
        ARM_CLIENT_SECRET = 'azure-sp-client-secret' // Azure clientSecret 
        ARM_SUBSCRIPTION_ID = 'azure-sp-subscription-id' // Azure subscriptionId 
        ARM_TENANT_ID = 'azure-sp-tenant-id' // Azure tenantId
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
                    // Login to Docker Hub using credentials
                    withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
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

        // Debugging Stage for Tenant ID
        stage('Debug Tenant ID') {
            steps {
                script {
                    // Output the Tenant ID being used for debugging
                    bat "echo Using Tenant ID: %ARM_TENANT_ID%"
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
                    // Apply Terraform configuration with Azure login
                    bat """
                        az login --service-principal ^
                        --username %ARM_CLIENT_ID% ^
                        --password %ARM_CLIENT_SECRET% ^
                        --tenant %ARM_TENANT_ID%
                        terraform apply -auto-approve
                    """
                }
            }
        }

        stage('Create ELK Namespace') {
            steps {
                script {
                    // Create the namespace if it doesn't exist
                    bat """
                    kubectl get namespace ${K8S_NAMESPACE} || kubectl create namespace ${K8S_NAMESPACE}
                    """
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
            }
        }
    }
}
