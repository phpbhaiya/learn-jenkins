pipeline {
  agent any
  stages {
    stage('Test Docker') {
      steps {
        script {
          // Test if Docker is available
          sh 'docker --version'
          
          // Test if Docker Pipeline plugin works
          docker.image('hello-world').run()
        }
      }
    }
  }
}