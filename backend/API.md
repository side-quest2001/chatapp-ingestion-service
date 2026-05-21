# Backend API Notes

Base URL: `http://localhost:4000`

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
      "content": "Hello"
    }
    ```

## Notes

- Conversation titles default to `"New conversation"` when omitted.
- Cancelled conversations reject new chat messages.
- Chat responses are mocked for Stage 2 and do not call a real LLM provider yet.
- Validation and not-found failures use the shared error response shape:
  ```json
  {
    "success": false,
    "message": "..."
  }
  ```
