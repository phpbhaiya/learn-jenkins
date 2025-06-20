pipeline {
  agent any

  stages {
    stage('Notify GitHub (Pending)') {
      steps {
        script {
          githubNotify context: 'build', status: 'PENDING', description: 'Build started'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t my-app:latest ."
        }
      }
    }

    stage('Test Run') {
      steps {
        script {
          sh """
            docker run -d -p 6666:6666 --name temp-app my-app:latest
            sleep 30
            docker exec temp-app curl -f http://localhost:6666
            docker rm -f temp-app
          """
        }
      }
    }
  }

  post {
    success {
      script {
        githubNotify context: 'build', status: 'SUCCESS', description: 'Build passed'
      }
    }
    failure {
      script {
        githubNotify context: 'build', status: 'FAILURE', description: 'Build failed'
      }
    }
  }
}
