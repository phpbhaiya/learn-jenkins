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
            account: 'phpbhaiya',  // Your GitHub username
            repo: 'learn-jenkins', // Your repository name
            sha: "${env.GIT_COMMIT}",
            credentialsId: '4ea9c5f0-bf0e-4dd6-a4b8-159222378fe6'  // Your existing credentials ID
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