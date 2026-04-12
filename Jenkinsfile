pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "adnankhan48/nodeappbyku:latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/adnankhan-eng378/nodeappbyku'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
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

        stage('Clean Up') {
            steps {
                sh '''
                docker logout
                '''
            }
        }
    }
}