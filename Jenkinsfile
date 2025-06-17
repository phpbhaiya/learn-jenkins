pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          githubNotify(
            status: 'PENDING',
            description: 'Starting build...',
            context: 'Jenkins CI'
          )
        }
      }
    }

    stage('Install & Test') {
      steps {
        script {
          try {
            sh 'npm install'
            sh 'npm test'
            githubNotify(
              status: 'SUCCESS',
              description: 'Tests passed ✅',
              context: 'Jenkins CI'
            )
          } catch (e) {
            githubNotify(
              status: 'FAILURE',
              description: 'Tests failed ❌',
              context: 'Jenkins CI'
            )
            throw e
          }
        }
      }
    }
  }

  post {
    failure {
      script {
        githubNotify(
          status: 'FAILURE',
          description: 'Build failed ❌',
          context: 'Jenkins CI'
        )
      }
    }
    success {
      script {
        githubNotify(
          status: 'SUCCESS',
          description: 'Build successful ✅',
          context: 'Jenkins CI'
        )
      }
    }
  }
}