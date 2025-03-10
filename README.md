# quiz-master
### docker build
```docker build -t kapuut-quiz-master .```

### docker run
```docker run -d -p 3000:3000 --env-file .env --name kapuut-quiz-master  kapuut-quiz-master```

---

# quiz-leaderboard
run rust backend : cargo run

### docker build
```docker build -t kapuut-quiz-leaderboard .``

### docker run
```docker run -d -p 3001:8080 --env-file .env --name kapuut-quiz-leaderboard  kapuut-quiz-leaderboard```

# database
```./db/start-database.sh```

---

# quiz-creator 

### docker build
```docker build -t kapuut.quiz-creator .```

### docker run
```docker run -p 3100:3100 --name kapuut.quiz-creator kapuut.quiz-creator ```

### Kubernetees

In order to test the isitio gateway use the port forwarding

```
kubectl port-forward -n istio-system svc/istio-ingressgateway 8080:80
```

apply quiz-creator service
```
kubectl apply -f backend/quiz-creator/deployments.yml 
```

apply deployment.yml
```
kubectl apply -f db/deployment.yml 
```

create secret with .env file
```
kubectl create secret generic quiz-creator-env --from-env-file=backend/quiz-creator/.env
```

#### Install istio globally

```
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
sudo mv bin/istioctl /usr/local/bin/
```

### Images

quiz-creator
```
https://github.com/DOMESDAY7/kapuut/pkgs/container/kapuut.quiz-creator
```