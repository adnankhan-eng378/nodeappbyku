pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "adnankhan48/nodeappbyku"
        DOCKER_TAG = "latest"
        GIT_REPO = "https://github.com/adnankhan-eng378/nodeappbyku"
        GIT_BRANCH = "main"
        KUBECONFIG_CRED = "kubeconfig"   // Jenkins credential ID
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
                docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                docker push $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG')]) {
                    sh '''
                    export KUBECONFIG=$KUBECONFIG
                    kubectl apply -f deployment.yaml
                    kubectl apply -f service.yaml
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                export KUBECONFIG=$KUBECONFIG
                kubectl get pods
                kubectl get svc
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
            echo "✅ Build, Push & Deployment Successful!"
        }

        failure {
            echo "❌ Pipeline Failed - check logs"
        }
    }
}