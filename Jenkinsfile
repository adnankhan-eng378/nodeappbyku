pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "adnankhan48/nodeappbyku:latest"
        GIT_REPO = "https://github.com/adnankhan-eng378/nodeappbyku"
        GIT_BRANCH = "main"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                docker push $DOCKER_IMAGE
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                docker logout
                docker system prune -f
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build & Push Successful!"
        }

        failure {
            echo "❌ Pipeline Failed - check logs"
        }
    }
}