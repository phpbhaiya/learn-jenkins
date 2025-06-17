pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        githubNotify context: 'Jenkins CI', status: 'PENDING', description: 'Starting build...'
      }
    }

    stage('Install & Test') {
      steps {
        script {
          try {
            sh 'npm install'
            sh 'npm test'
            githubNotify context: 'Jenkins CI', status: 'SUCCESS', description: 'Tests passed ✅'
          } catch (e) {
            githubNotify context: 'Jenkins CI', status: 'FAILURE', description: 'Tests failed ❌'
            throw e
          }
        }
      }
    }
  }

  post {
    failure {
      githubNotify context: 'Jenkins CI', status: 'FAILURE', description: 'Build failed ❌'
    }
    success {
      githubNotify context: 'Jenkins CI', status: 'SUCCESS', description: 'Build successful ✅'
    }
  }
}
