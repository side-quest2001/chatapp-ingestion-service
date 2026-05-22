# Kubernetes Deployment Notes

This manifest set is intended for a simple self-hosted deployment on a single-node Linux VPS running k3s.

It includes:

- namespace
- shared config map
- example secret manifest
- in-cluster PostgreSQL
- backend deployment and service
- frontend deployment and service
- Traefik-compatible ingress

## Prerequisites

- Linux VPS
- k3s installed
- `kubectl` configured to talk to the k3s cluster
- Docker available for building images
- Images pushed to GHCR or another reachable registry
- Domain DNS pointing to the VPS public IP

## 1. Build and Push Images

Replace `<your-github-username>` with your actual GHCR namespace.

### Backend

```bash
docker build -t ghcr.io/<your-github-username>/llm-inference-logger-backend:latest ./backend
docker push ghcr.io/<your-github-username>/llm-inference-logger-backend:latest
```

### Frontend

Build the frontend image with the public API base URL baked into the static assets:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://inference-logger.example.com/api \
  -t ghcr.io/<your-github-username>/llm-inference-logger-frontend:latest \
  ./frontend
docker push ghcr.io/<your-github-username>/llm-inference-logger-frontend:latest
```

## 2. Prepare Secrets

Copy the example secret file:

```bash
cp k8s/secrets.example.yaml k8s/secrets.yaml
```

Then edit `k8s/secrets.yaml` and replace:

- `DATABASE_URL`
- `GROQ_API_KEY`

Do not commit `k8s/secrets.yaml`.

## 3. Update Image Names

Edit these files before applying:

- `k8s/backend.yaml`
- `k8s/frontend.yaml`

Replace the placeholder image names:

- `ghcr.io/<your-github-username>/llm-inference-logger-backend:latest`
- `ghcr.io/<your-github-username>/llm-inference-logger-frontend:latest`

## 4. Apply Manifests

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

## 5. Check Deployment Status

```bash
kubectl get pods -n inference-logger
kubectl get services -n inference-logger
kubectl get ingress -n inference-logger
```

Describe a failing pod:

```bash
kubectl describe pod <pod-name> -n inference-logger
```

## 6. View Logs

### Backend

```bash
kubectl logs -f deploy/backend -n inference-logger
```

### Frontend

```bash
kubectl logs -f deploy/frontend -n inference-logger
```

### Postgres

```bash
kubectl logs -f statefulset/postgres -n inference-logger
```

## 7. Delete the Deployment

```bash
kubectl delete namespace inference-logger
```

## Notes

- Real `GROQ_API_KEY` must be added manually to `k8s/secrets.yaml`.
- The `DATABASE_URL` in the example points to the in-cluster `postgres` service.
- The backend container runs `npx prisma migrate deploy && npm start` on startup for simplicity.
- The frontend is a static build, so the API base URL should be set correctly at image build time.
- DNS for `inference-logger.example.com` should point to the VPS public IP.
