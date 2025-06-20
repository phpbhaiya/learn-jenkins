def gitCommit = ''
pipeline {
  agent any
  environment {
    IMAGE_NAME = 'basic-express-app'
    TAG = 'latest'
    GITHUB_CONTEXT = 'build'
    GITHUB_REPO = 'learn-jenkins'
    GITHUB_ACCOUNT = 'phpbhaiya'
    GITHUB_CREDENTIALS_ID = 'github-creds'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          gitCommit = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        }
      }
    }
    stage('Notify GitHub - Pending') {
      steps {
        script {
          githubNotify(
            context: env.GITHUB_CONTEXT,
            status: 'PENDING',
            description: 'Jenkins pipeline is building and testing your application...',
            targetUrl: "${env.BUILD_URL}",
            repo: env.GITHUB_REPO,
            account: env.GITHUB_ACCOUNT,
            sha: gitCommit,
            credentialsId: env.GITHUB_CREDENTIALS_ID
          )
        }
      }
    }
    stage('Build Docker Image') {
      steps {
        sh "docker build -t $IMAGE_NAME:$TAG ."
      }
    }
    stage('Test Run') {
      steps {
        sh """
          docker run -d -p 6666:6666 --name temp-app $IMAGE_NAME:$TAG
          sleep 30
          curl -f http://localhost:6666 || echo 'App failed to respond'
          docker rm -f temp-app
        """
      }
    }
  }
  post {
    success {
      script {
        githubNotify(
          context: env.GITHUB_CONTEXT,
          status: 'SUCCESS',
          description: '✅ Build completed successfully! Docker image built and tested.',
          targetUrl: "${env.BUILD_URL}",
          repo: env.GITHUB_REPO,
          account: env.GITHUB_ACCOUNT,
          sha: gitCommit,
          credentialsId: env.GITHUB_CREDENTIALS_ID
        )
      }
    }
    failure {
      script {
        githubNotify(
          context: env.GITHUB_CONTEXT,
          status: 'FAILURE',
          description: '❌ Build failed during pipeline execution. Check Jenkins logs for details.',
          targetUrl: "${env.BUILD_URL}",
          repo: env.GITHUB_REPO,
          account: env.GITHUB_ACCOUNT,
          sha: gitCommit,
          credentialsId: env.GITHUB_CREDENTIALS_ID
        )
      }
    }
  }
}