pipeline {
  agent any

  environment {
    IMAGE_NAME = 'basic-express-app'
    TAG = 'latest'
    GITHUB_CONTEXT = 'build'
    GITHUB_CREDENTIALS_ID = 'github-creds' // Your GitHub token credentials in Jenkins
    REPO = 'phpbhaiya/your-repo-name' // GitHub org/user + repo
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        }
      }
    }

    stage('Notify GitHub - PENDING') {
      steps {
        githubNotify context: env.GITHUB_CONTEXT, status: 'PENDING',
          description: 'Build started',
          repo: env.REPO,
          sha: env.GIT_COMMIT,
          credentialsId: env.GITHUB_CREDENTIALS_ID
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
          sleep 5
          docker exec temp-app curl -f http://localhost:6666
          docker rm -f temp-app
        """
      }
    }
  }

  post {
    success {
      githubNotify context: env.GITHUB_CONTEXT, status: 'SUCCESS',
        description: 'Build succeeded',
        repo: env.REPO,
        sha: env.GIT_COMMIT,
        credentialsId: env.GITHUB_CREDENTIALS_ID
    }
    failure {
      githubNotify context: env.GITHUB_CONTEXT, status: 'FAILURE',
        description: 'Build failed',
        repo: env.REPO,
        sha: env.GIT_COMMIT,
        credentialsId: env.GITHUB_CREDENTIALS_ID
    }
  }
}
