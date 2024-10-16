pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'docker-hub-token' // Docker Hub credentials ID
        DOCKER_IMAGE_NAME = 'alay2003/grocery_store' // Updated Docker image name
        IMAGE_TAG = 'alayp' // Specify the tag for the image
        K8S_NAMESPACE = 'elk1' // Kubernetes namespace for ELK

        // Azure Service Principal credentials
        ARM_CLIENT_ID = credentials('azure-sp-client-id') // Jenkins credential ID for Azure clientId
        ARM_CLIENT_SECRET = credentials('azure-sp-client-secret') // Jenkins credential ID for Azure clientSecret
        ARM_SUBSCRIPTION_ID = credentials('azure-sp-subscription-id') // Jenkins credential ID for Azure subscriptionId
        ARM_TENANT_ID = credentials('azure-sp-tenant-id') // Jenkins credential ID for Azure tenantId
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
                    bat '''
                    az login --service-principal \
                    --username %ARM_CLIENT_ID% \
                    --password %ARM_CLIENT_SECRET% \
                    --tenant %ARM_TENANT_ID%
                    
                    terraform apply -auto-approve
                    '''
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
                // You could stop the server or perform other cleanup actions here
            }
        }
    }
}
