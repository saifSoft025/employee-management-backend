pipeline {
    agent any

    environment {
        IMAGE_NAME = "saifali3366/employee-management-backend"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/saifSoft025/employee-management-backend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                }
            }
        }

            stage('Trigger Helm Deployment') {
            steps {
                build job: 'employee-management-helm',
                parameters: [
                    string(name: 'IMAGE_TAG', value: "${IMAGE_TAG}")
                ],
                wait: true
            }
        }

        stage('Trigger Helm Deployment') {
            steps {
                build job: 'employee-management-helm', wait: true
            }
        }

        stage('Docker Logout') {
            steps {
                bat 'docker logout'
            }
        }
    }

    post {
        success {
            echo "Docker image pushed successfully: ${IMAGE_NAME}:${IMAGE_TAG}"
        }

        failure {
            echo 'Pipeline failed.'
        }

        always {
            cleanWs()
        }
    }
}