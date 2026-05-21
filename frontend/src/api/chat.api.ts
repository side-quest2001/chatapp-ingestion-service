import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
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
};
