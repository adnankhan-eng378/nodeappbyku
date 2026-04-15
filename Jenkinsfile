pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "adnankhan48/nodeappbyku"
        DOCKER_TAG = "latest"
        GIT_REPO = "https://github.com/adnankhan-eng378/nodeappbyku"
        GIT_BRANCH = "main"

        // ✅ FIX: Jenkins uses direct kubeconfig path
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }

        // ✅ NEW STAGE (only added, nothing changed)
        stage('Test Kubernetes') {
            steps {
                sh 'kubectl get nodes'
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
                sh '''
                kubectl apply -f deployment.yaml
                kubectl apply -f service.yaml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
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