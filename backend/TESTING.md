# Backend Testing

## Overview

The backend integration suite uses `Vitest` + `Supertest` and runs against the real Express app and the configured Prisma database.

LLM providers are not called in these tests. The chat coverage only exercises the cancelled-conversation guard, which fails before any provider request is attempted.

## Database Configuration

Tests use `DATABASE_URL` from `.env.test` if that file exists.

If `.env.test` is not present, tests fall back to the current `.env` / `DATABASE_URL`.

Example test database URL:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chatapp_test
```

See [.env.test.example](/home/user/assignments/chatapp/backend/.env.test.example) for a starter file.

## Warning

The integration suite cleans database tables before tests.

Cleanup order:

1. `InferenceLog`
2. `ChatMessage`
3. `Conversation`

Only run the suite against a safe development or test database.

## Setup

1. Create `backend/.env.test` if you want a separate test database.
2. Ensure the configured database is reachable.
3. Ensure Prisma migrations have already been applied to that database.

## Commands

Run the backend build:

```bash
cd backend && npm run build
```

Run the integration tests once:

```bash
cd backend && npm test
```

Run in watch mode:

```bash
cd backend && npm run test:watch
```
