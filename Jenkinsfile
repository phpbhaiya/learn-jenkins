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
        script {
          sh """
            # Test the newly built image
            echo "🧪 Starting test container..."
            docker run -d -p 7777:$APP_PORT --name temp-test-app $IMAGE_NAME:$TAG
            
            # Wait for container to be ready with retry logic
            echo "⏳ Waiting for application to start..."
            for i in {1..30}; do
              if curl -f http://localhost:7777 > /dev/null 2>&1; then
                echo "✅ Health check passed on attempt \$i"
                break
              fi
              if [ \$i -eq 30 ]; then
                echo "❌ Health check failed after 30 attempts"
                echo "📋 Container logs:"
                docker logs temp-test-app
                echo "📊 Container status:"
                docker ps -a | grep temp-test-app
                exit 1
              fi
              echo "⏳ Attempt \$i failed, retrying in 1 second..."
              sleep 1
            done
            
            # Additional verification
            echo "🔍 Final verification..."
            response=\$(curl -s http://localhost:7777)
            echo "📄 Response: \$response"
          """
        }
      }
      post {
        always {
          sh 'docker rm -f temp-test-app || true'
        }
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
            
            # Verify deployment with retry logic
            echo "🔍 Verifying deployment..."
            for i in {1..15}; do
              if curl -f http://localhost:$APP_PORT > /dev/null 2>&1; then
                echo "✅ Production deployment verified on attempt \$i"
                break
              fi
              if [ \$i -eq 15 ]; then
                echo "❌ Production deployment verification failed"
                echo "📋 Container logs:"
                docker logs $CONTAINER_NAME
                exit 1
              fi
              echo "⏳ Verification attempt \$i failed, retrying..."
              sleep 2
            done
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