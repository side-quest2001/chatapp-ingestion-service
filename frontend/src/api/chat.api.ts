import { apiClient, ApiClientError, buildApiUrl } from "./client";
import type {
  ApiSuccessResponse,
  ChatStreamEvent,
  SendMessagePayload,
  SendMessageResponse,
} from "./types";

export const chatApi = {
  sendMessage: async (conversationId: string, payload: SendMessagePayload) => {
    const response = await apiClient<ApiSuccessResponse<SendMessageResponse>>(
      `/chat/${conversationId}/messages`,
      {
        method: "POST",
        body: payload,
      },
    );

    return response.data;
  },
  streamMessage: async (
    conversationId: string,
    payload: SendMessagePayload,
    callbacks: {
      onChunk: (text: string) => void;
      onDone: (result: SendMessageResponse) => void;
      onError: (message: string) => void;
    },
  ) => {
    const response = await fetch(buildApiUrl(`/chat/${conversationId}/stream`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "Request failed";

      try {
        const errorResponse = (await response.json()) as { message?: string };
        message = errorResponse.message || message;
      } catch {
        message = response.statusText || message;
      }

      throw new ApiClientError(message, response.status);
    }

    if (!response.body) {
      throw new Error("Streaming is not available in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const processLine = (line: string) => {
      if (!line.trim()) {
        return;
      }

      const event = JSON.parse(line) as ChatStreamEvent;

      if (event.type === "chunk") {
        callbacks.onChunk(event.text);
        return;
      }

      if (event.type === "done") {
        callbacks.onDone({
          userMessage: event.userMessage,
          assistantMessage: event.assistantMessage,
        });
        return;
      }

      callbacks.onError(event.message);
    };

    while (true) {
      const { value, done } = await reader.read();

      buffer += decoder.decode(value, {
        stream: !done,
      });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        processLine(line);
      }

      if (done) {
        break;
      }
    }

    if (buffer.trim()) {
      processLine(buffer);
    }
  },
};
