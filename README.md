# LLM Inference Logger

A full-stack assignment project for chatting with an LLM, logging inference metadata, and exploring usage analytics in a lightweight product-style dashboard.

The app includes:

- a chat workspace for creating and resuming conversations
- a backend API for conversations, chat, ingestion, and analytics
- structured inference logging with preview redaction
- a dashboard for request volume, latency, provider mix, and recent logs
- Docker Compose packaging for one-command local setup

## Features

- Multi-conversation chat workflow with cancel protection
- LLM provider abstraction through the Vercel AI SDK
- Demo-ready Groq integration, with multi-provider-ready architecture for OpenAI and DeepSeek
- Logged LLM wrapper that captures metadata and sends it to the ingestion module
- Redacted log previews for emails, Indian phone numbers, and token-like secrets
- Dashboard views for summary metrics, status mix, provider/model breakdown, latency trends, and recent requests
- Prisma-backed PostgreSQL persistence

## Tech Stack

- Backend: Express, TypeScript, Prisma, PostgreSQL, Zod
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Charts/UI: Recharts, lucide-react
- LLM: Vercel AI SDK with Groq for demo use
- Testing: Vitest and Supertest for backend integration coverage

## Docker Compose Setup

### Prerequisites

- Docker
- Docker Compose
- A valid `GROQ_API_KEY` if you want live chat completions

### Run

```bash
export GROQ_API_KEY=your_groq_api_key_here
docker compose up --build
```

### Services

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- Postgres: `localhost:5435`

### Stop

```bash
docker compose down
```

To also remove the persisted Postgres volume:

```bash
docker compose down -v
```

## Manual Setup

### 1. Start PostgreSQL

Use your own local PostgreSQL instance and create a database named `llm_inference_logger`, or adjust `DATABASE_URL` accordingly.

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Set `GROQ_API_KEY` in `backend/.env`, then run:

```bash
npm install
npx prisma migrate deploy
npm run build
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run build
npm run dev
```

Frontend local URL:

- `http://localhost:5173`

Backend local URL:

- `http://localhost:4000`

## Environment Variables

### Backend

See [backend/.env.example](/home/user/assignments/chatapp/backend/.env.example).

Key variables:

- `DATABASE_URL`
- `FRONTEND_URL`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL`
- `DEFAULT_LLM_PROVIDER`

### Frontend

See [frontend/.env.example](/home/user/assignments/chatapp/frontend/.env.example).

- `VITE_API_BASE_URL`

## API Overview

Base backend URL:

- `http://localhost:4000/api`

Main endpoints:

- `GET /health`
- `POST /conversations`
- `GET /conversations`
- `GET /conversations/:conversationId`
- `PATCH /conversations/:conversationId/cancel`
- `POST /chat/:conversationId/messages`
- `POST /ingestion/inference-logs`
- `GET /dashboard/summary`
- `GET /dashboard/recent-logs`
- `GET /dashboard/latency`
- `GET /dashboard/status-breakdown`
- `GET /dashboard/provider-breakdown`

More backend endpoint notes are in [backend/API.md](/home/user/assignments/chatapp/backend/API.md).

## Schema Design Decisions

- `Conversation` stores thread-level lifecycle state such as `ACTIVE` and `CANCELLED`.
- `ChatMessage` stores normalized role/content pairs with ordering by `createdAt`.
- `InferenceLog` is separate from chat messages so analytics can evolve independently from the user-facing transcript.
- Log previews are stored as redacted snippets rather than full observability dumps to reduce privacy risk and keep the assignment scope practical.

## Tradeoffs Made

- No repository layer: services talk to Prisma directly to keep the codebase small and assignment-friendly.
- No background queue: ingestion is synchronous for simplicity.
- No streaming chat UI: the app returns full user/assistant message pairs after the model call completes.
- Frontend structure is feature-oriented with a small shared UI layer instead of a strict design-system taxonomy.

## Bonus Features Implemented

- Multi-provider-ready LLM architecture using the Vercel AI SDK abstraction
- Custom logged wrapper around provider calls for usage metadata capture
- Preview redaction for common PII and secret patterns
- Lightweight dashboard analytics over the ingestion table
- Backend integration test coverage
- Docker Compose packaging for local demo setup

## What I Would Improve With More Time

- Add pagination and virtualization for large conversation and log lists
- Add streaming responses in the chat view
- Add richer provider failure analytics and retry visibility
- Split the frontend bundle for a smaller dashboard/chat payload
- Add Kubernetes manifests under `/k8s`
- Add production-ready secrets management and deployment automation

## Demo Instructions

### Fastest path

1. Export a Groq API key:

```bash
export GROQ_API_KEY=your_groq_api_key_here
```

2. Start everything:

```bash
docker compose up --build
```

3. Open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/api/health`

4. Create a conversation and send a prompt.

5. Open the dashboard view to inspect the resulting logs and aggregates.
