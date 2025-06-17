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
            context: 'Jenkins CI',
            account: 'phpbhaiya',
            repo: 'learn-jenkins',
            sha: "${env.GIT_COMMIT}",
            credentialsId: '4ea9c5f0-bf0e-4dd6-a4b8-159222378fe6'
          )
        }
      }
    }

    stage('Setup Node.js') {
      steps {
        script {
          // Check if Node.js is already installed
          def nodeInstalled = sh(script: 'which node', returnStatus: true) == 0
          
          if (!nodeInstalled) {
            echo 'Installing Node.js...'
            sh '''
              # Update package manager
              apt-get update -y
              
              # Install curl if not present
              apt-get install -y curl
              
              # Install Node.js 18.x
              curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
              apt-get install -y nodejs
            '''
          }
          
          // Verify installation
          sh 'node --version && npm --version'
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
              context: 'Jenkins CI',
              account: 'phpbhaiya',
              repo: 'learn-jenkins',
              sha: "${env.GIT_COMMIT}",
              credentialsId: '4ea9c5f0-bf0e-4dd6-a4b8-159222378fe6'
            )
          } catch (e) {
            githubNotify(
              status: 'FAILURE',
              description: 'Tests failed ❌',
              context: 'Jenkins CI',
              account: 'phpbhaiya',
              repo: 'learn-jenkins',
              sha: "${env.GIT_COMMIT}",
              credentialsId: '4ea9c5f0-bf0e-4dd6-a4b8-159222378fe6'
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
          context: 'Jenkins CI',
          account: 'phpbhaiya',
          repo: 'learn-jenkins',
          sha: "${env.GIT_COMMIT}",
          credentialsId: '4ea9c5f0-bf0e-4dd6-a4b8-159222378fe6'
        )
      }
    }
    success {
      script {
        githubNotify(
          status: 'SUCCESS',
          description: 'Build successful ✅',
          context: 'Jenkins CI',
          account: 'phpbhaiya',
          repo: 'learn-jenkins',
          sha: "${env.GIT_COMMIT}",
          credentialsId: '4ea9c5f0-bf0e-4dd6-a4b8-159222378fe6'
        )
      }
    }
  }
}