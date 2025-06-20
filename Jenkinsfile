pipeline {
  agent any

  environment {
    IMAGE_NAME = 'basic-express-app'
    TAG = 'latest'
    GITHUB_CONTEXT = 'build'
    GITHUB_CREDENTIALS_ID = 'github-creds' // must match your Jenkins credentials ID
    GITHUB_REPO = 'phpbhaiya/learn-jenkins' // format: org_or_user/repo
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          // Get SHA for githubNotify
          env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        }
      }
    }

    stage('Notify GitHub - PENDING') {
      steps {
        script {
          githubNotify context: env.GITHUB_CONTEXT,
            status: 'PENDING',
            description: 'Build started',
            credentialsId: env.GITHUB_CREDENTIALS_ID,
            repo: env.GITHUB_REPO,
            sha: env.GIT_COMMIT
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
          docker exec temp-app curl -f http://localhost:6666
          docker rm -f temp-app
        """
      }
    }
  }

  post {
    success {
      script {
        githubNotify context: env.GITHUB_CONTEXT,
          status: 'SUCCESS',
          description: 'Build passed',
          credentialsId: env.GITHUB_CREDENTIALS_ID,
          repo: env.GITHUB_REPO,
          sha: env.GIT_COMMIT
      }
    }
    failure {
      script {
        githubNotify context: env.GITHUB_CONTEXT,
          status: 'FAILURE',
          description: 'Build failed',
          credentialsId: env.GITHUB_CREDENTIALS_ID,
          repo: env.GITHUB_REPO,
          sha: env.GIT_COMMIT
      }
    }
  }
}
