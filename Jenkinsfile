pipeline {
  agent any

  environment {
    IMAGE_NAME = "basic-express-app"
    TAG = "latest"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t $IMAGE_NAME:$TAG ."
        }
      }
    }

    stage('Run (Optional)') {
      steps {
        script {
          sh "docker run -d -p 6666:6666 --name temp-app $IMAGE_NAME:$TAG"
          sh "sleep 15"
          sh "curl -f http://localhost:6666 || echo 'App failed to respond'"
          sh "docker rm -f temp-app"
        }
      }
    }
  }
}
