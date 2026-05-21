# Backend API Notes

Base URL: `http://localhost:4000`

## Environment

- `GROQ_API_KEY`
- `GROQ_MODEL` default: `llama-3.1-8b-instant`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` default: `gpt-4.1-mini`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL` default: `deepseek-chat`
- `DEFAULT_LLM_PROVIDER` default: `groq`

## Health

- `GET /api/health`

## Conversations

- `POST /api/conversations`
  - Body:
    ```json
    {
      "title": "Optional title"
    }
    ```
- `GET /api/conversations`
- `GET /api/conversations/:conversationId`
- `PATCH /api/conversations/:conversationId/cancel`

## Chat

- `POST /api/chat/:conversationId/messages`
  - Body:
    ```json
    {
      "content": "Hello",
      "provider": "groq",
      "model": "llama-3.1-8b-instant"
    }
    ```

## Ingestion

- `POST /api/ingestion/inference-logs`
  - Body:
    ```json
    {
      "conversationId": "optional-uuid",
      "provider": "groq",
      "model": "llama-3.1-8b-instant",
      "status": "SUCCESS",
      "latencyMs": 123,
      "inputPreview": "optional prompt preview",
      "outputPreview": "optional response preview",
      "errorMessage": "optional error",
      "promptTokens": 10,
      "completionTokens": 20,
      "totalTokens": 30,
      "startedAt": "2026-05-21T12:00:00.000Z",
      "completedAt": "2026-05-21T12:00:01.000Z",
      "metadata": {
        "source": "manual-test"
      }
    }
    ```

## Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/recent-logs?limit=20&status=SUCCESS&provider=groq&model=llama-3.1-8b-instant`
- `GET /api/dashboard/latency?bucket=hour&limit=24`
- `GET /api/dashboard/status-breakdown`
- `GET /api/dashboard/provider-breakdown`

### Dashboard curl examples

```bash
curl http://localhost:4000/api/dashboard/summary
```

```bash
curl "http://localhost:4000/api/dashboard/recent-logs?limit=20&status=SUCCESS&provider=groq&model=llama-3.1-8b-instant"
```

```bash
curl "http://localhost:4000/api/dashboard/latency?bucket=hour&limit=24"
```

```bash
curl http://localhost:4000/api/dashboard/status-breakdown
```

```bash
curl http://localhost:4000/api/dashboard/provider-breakdown
```

## Notes

- Conversation titles default to `"New conversation"` when omitted.
- Cancelled conversations reject new chat messages.
- Chat responses now use the configured Vercel AI SDK provider and model.
- `provider` and `model` are optional in chat requests. If omitted, backend env defaults are used.
- Inference log previews are redacted before saving to mask emails, Indian phone numbers, and common secret formats.
- Inference log requests return `400` when a provided `conversationId` does not exist.
- Dashboard APIs are read-only analytics over the existing `InferenceLog` table.
- Validation and not-found failures use the shared error response shape:
  ```json
  {
    "success": false,
    "message": "..."
  }
  ```
