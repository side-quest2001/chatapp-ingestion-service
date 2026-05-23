# Architecture Notes

## System Overview

The application has three primary runtime pieces:

- a React frontend for chat and analytics
- an Express API for chat orchestration, persistence, and reporting
- a PostgreSQL database accessed through Prisma

The chat flow is provider-agnostic at the service boundary. The Vercel AI SDK provides the provider abstraction layer, while the current demo configuration uses Groq by default.

## Backend Module Layout

The backend follows a pragmatic route-to-service structure:

- routes wire HTTP paths
- controllers parse requests and send responses
- Zod schemas validate params, query, and body payloads
- services hold business logic and Prisma access
- LLM-specific behavior stays inside the `llm` module

This keeps controllers thin without introducing a heavier repository layer.

## Chat Flows

### Non-Streaming Flow

1. A chat request reaches the chat service.
2. The chat service validates conversation state and persists the user message.
3. The chat service calls a custom logged LLM wrapper.
4. That wrapper invokes the provider through the Vercel AI SDK.
5. The wrapper collects provider/model/timing/token metadata.
6. It emits an inference log event.
7. The chat service stores the assistant response and updates the conversation timestamp.
8. The ingestion subscriber redacts previews and stores a normalized `InferenceLog`.

This lets the app separate user-facing messages from operational analytics.

### Streaming Flow

1. A streaming request reaches `POST /api/chat/:conversationId/stream`.
2. The chat service validates conversation state and persists the user message before calling the model.
3. The backend starts a `streamText` request through the Vercel AI SDK.
4. The API returns newline-delimited JSON events to the client as text chunks arrive.
5. The frontend appends the user message immediately and progressively fills an assistant bubble while chunks stream in.
6. After the stream completes, the backend stores the final assistant message, emits a success inference-log event, and sends a final `done` event.
7. If the provider fails mid-stream, the backend emits an error inference-log event and returns a user-safe streamed error event without breaking the rest of the app.

The original non-streaming endpoint remains intact for clients that prefer a one-shot response.

## Event-Based Ingestion Flow

Inference logging now passes through a lightweight in-process event bus:

1. Chat code and the logged LLM wrapper publish `inference.log.created`.
2. A subscriber listens for that event during app bootstrap.
3. The subscriber calls the ingestion service to validate, redact, and persist the log.
4. If persistence fails, the error is logged but the user-facing chat response continues.

This gives the codebase an event-driven boundary without adding deployment-heavy infrastructure.

## Logging Strategy

The logging strategy is intentionally metadata-focused:

- provider
- model
- status
- latency
- prompt/completion/total tokens
- input and output previews
- optional error message

Logs are redacted previews, not full observability dumps. This reduces the chance of persisting sensitive content while still providing enough information for demo analytics and debugging.

## Privacy and PII Redaction

The ingestion layer redacts common sensitive patterns before persistence, including:

- email addresses
- Indian phone numbers
- token-like or API-key-like secrets

The goal is to store useful diagnostics without turning the assignment into a full data-loss-prevention platform.

## Database Schema

### Conversation

- Represents a user thread
- Holds title and lifecycle status
- Tracks `createdAt` and `updatedAt`

### ChatMessage

- Belongs to a conversation
- Stores role, content, and timestamp
- Keeps the transcript normalized and easy to order

### InferenceLog

- Optionally links to a conversation
- Stores provider/model/latency/status/token metrics
- Stores redacted previews and error metadata
- Powers dashboard analytics independently from the chat transcript

This separation makes it easier to evolve analytics without overloading the transcript model.

## Frontend Separation

The frontend uses a pragmatic feature-based structure:

- `features/chat` for conversation and composer behavior
- `features/dashboard` for charts and analytics tables
- `components/ui` for small shared primitives
- `components/layout` for shell pieces like the sidebar

The chat workspace and dashboard are intentionally distinct views:

- chat optimizes for message flow and conversation state
- dashboard optimizes for read-only operational visibility

## Scaling Considerations

For the assignment, synchronous request handling is enough. If the system grew, likely next steps would be:

- replace the in-process event bus with Kafka, NATS, BullMQ, SQS, or another external broker
- fan out ingestion subscribers independently from chat API instances
- read-optimized analytics tables or materialized views
- pagination for recent logs and long conversations
- frontend bundle splitting
- provider-level circuit breaking or retry policies

The current architecture is still a good base because chat, ingestion, dashboard, and provider concerns are already separated by module.

## Failure Handling Assumptions

- Validation failures return the shared `{ success: false, message }` shape
- Missing resources return application-level `404` errors
- Cancelled conversations are blocked before any provider call
- LLM provider failures are translated into a user-safe backend error

The design favors predictable API responses over deeply specialized error taxonomies.

## Multi-Provider Readiness

The demo uses Groq for live completions, but the architecture is multi-provider-ready.

The Vercel AI SDK abstraction allows the application to resolve different providers behind a consistent interface, while the custom logged wrapper keeps metadata capture consistent across providers.

## Docker Compose Packaging

The root `docker-compose.yml` packages:

- `postgres`
- `backend`
- `frontend`

The backend container runs Prisma migrations at startup with `prisma migrate deploy` before launching the API. This keeps local demo startup simple and repeatable.

## Kubernetes Note

Kubernetes manifests are now available under `/k8s` for a simple self-hosted single-node k3s deployment.

They are intentionally plain YAML rather than Helm charts so the deployment flow stays readable and assignment-friendly.
