def gitCommit = ''
pipeline {
  agent any
  environment {
    IMAGE_NAME = 'basic-express-app'
    TAG = 'latest'
    CONTAINER_NAME = 'basic-express-app-prod'
    APP_PORT = '6666'
    GITHUB_CONTEXT = 'Jenkins CI/CD'
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
            description: 'Running checks...',
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
        script {
          // Build new image with commit SHA tag for versioning
          sh "docker build -t $IMAGE_NAME:$TAG ."
          sh "docker build -t $IMAGE_NAME:${gitCommit.take(7)} ."
        }
      }
    }
    stage('Test Run') {
      steps {
        sh """
          # Test the newly built image
          docker run -d -p 7777:$APP_PORT --name temp-test-app $IMAGE_NAME:$TAG
          sleep 5
          curl -f http://localhost:7777 || (echo 'App failed health check' && exit 1)
          docker rm -f temp-test-app
        """
      }
    }
    stage('Deploy to Production') {
      when {
        branch 'main'  // Only deploy from main branch
      }
      steps {
        script {
          sh """
            echo "🚀 Starting deployment of ${gitCommit.take(7)}..."
            
            # Check if production container is running
            if docker ps -q -f name=$CONTAINER_NAME; then
              echo "📦 Stopping existing production container..."
              docker stop $CONTAINER_NAME
              docker rm $CONTAINER_NAME
            else
              echo "ℹ️  No existing production container found"
            fi
            
            # Deploy new container
            echo "🆕 Starting new production container..."
            docker run -d \\
              --name $CONTAINER_NAME \\
              -p $APP_PORT:$APP_PORT \\
              --restart unless-stopped \\
              $IMAGE_NAME:$TAG
            
            # Verify deployment
            echo "🔍 Verifying deployment..."
            sleep 5
            if curl -f http://localhost:$APP_PORT; then
              echo "✅ Deployment successful!"
            else
              echo "❌ Deployment verification failed!"
              exit 1
            fi
          """
        }
      }
    }
    stage('Cleanup') {
      steps {
        script {
          sh """
            # Keep only the latest 3 images to save disk space
            echo "🧹 Cleaning up old images..."
            docker images $IMAGE_NAME --format "table {{.Tag}}" | grep -v "latest" | grep -v "TAG" | tail -n +4 | xargs -r docker rmi $IMAGE_NAME: || true
          """
        }
      }
    }
  }
  post {
    always {
      script {
        // Cleanup any test containers
        sh 'docker rm -f temp-test-app || true'
      }
    }
    success {
      script {
        def deploymentMessage = env.BRANCH_NAME == 'main' ? 
          'Checks passed and deployed to production' : 
          'Checks have passed'
        
        githubNotify(
          context: env.GITHUB_CONTEXT,
          status: 'SUCCESS',
          description: deploymentMessage,
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
          description: 'Checks have failed',
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