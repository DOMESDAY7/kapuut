# KAPUUT - A Kahoot Clone with Microservice Architecture

## 🚀 Project Overview

Kapuut is a clone of the popular online quiz tool Kahoot, developed as a learning project to explore microservice architecture. Our goal was to build a robust and scalable application using various modern technologies.

## 💻 Tech Stack

Our project uses a diverse architecture with multiple languages and frameworks:

- **Go**: Used for high-performance services requiring fast execution
- **Rust**: Implemented for critical services requiring safety and performance
- **JavaScript (Bun)**: For ultra-fast JavaScript runtime
- **React**: For responsive and modern user interfaces

## 🏗️ Architecture

Kapuut is built around several microservices that communicate with each other:

- **Quiz Master**: Manages game logic and real-time quiz sessions
- **Quiz Leaderboard**: Processes and displays real-time rankings and scores
- **Quiz Creator**: Allows users to create and manage their quizzes
- **Database**: Persistence service to store all application data

## 🛠️ Installation and Deployment

### Prerequisites
- Docker
- Kubernetes (for Kubernetes deployment)
- Istio (for network traffic management)

### Quiz Master (Go)

```bash
# Build Docker image
docker build -t kapuut-quiz-master .

# Start container
docker run -d -p 3000:3000 --env-file .env --name kapuut-quiz-master kapuut-quiz-master
```

### Quiz Leaderboard (Rust)

```bash
# Run backend locally
cargo run

# Build Docker image
docker build -t kapuut-quiz-leaderboard .

# Start container
docker run -d -p 3001:8080 --env-file .env --name kapuut-quiz-leaderboard kapuut-quiz-leaderboard
```

### Database

```bash
./db/start-database.sh
```

### Quiz Creator (JavaScript/Bun)

```bash
# Build Docker image
docker build -t kapuut.quiz-creator .

# Start container
docker run -p 3100:3100 --name kapuut.quiz-creator kapuut.quiz-creator
```

## 🚢 Kubernetes Deployment

The project can also be deployed on Kubernetes with Istio for traffic and service management.

### Istio Setup

```bash
# Install Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
sudo mv bin/istioctl /usr/local/bin/

# Port-forwarding to test Istio gateway
kubectl port-forward -n istio-system svc/istio-ingressgateway 8080:80
```

### Service Deployment

```bash
# Deploy Quiz Creator service
kubectl apply -f backend/quiz-creator/deployments.yml

# Deploy database
kubectl apply -f db/deployment.yml

# Create secret for environment variables
kubectl create secret generic quiz-creator-env --from-env-file=backend/quiz-creator/.env
```

## 📦 Docker Images

Docker images are available in the GitHub Package Registry:
https://github.com/DOMESDAY7?tab=packages&repo_name=kapuut

## 📚 What We Learned

This project allowed us to gain experience in:
- Designing and implementing microservice architectures
- Using different languages for different technical needs
- Deploying applications via Docker and Kubernetes
- Integrating Istio for service mesh management
- Challenges of inter-service communication

## 🔗 Project Link

Find the complete source code on GitHub: [https://github.com/DOMESDAY7/kapuut](https://github.com/DOMESDAY7/kapuut)

---

Developed with ❤️ as a microservice architecture learning project.
