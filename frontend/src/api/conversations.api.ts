import { apiClient } from "./client";
import type {
  ApiSuccessResponse,
  ConversationDetail,
  ConversationSummary,
  CreateConversationPayload,
} from "./types";

export const conversationsApi = {
  list: async () => {
    const response = await apiClient<ApiSuccessResponse<ConversationSummary[]>>(
      "/conversations",
    );
    return response.data;
  },
  create: async (payload: CreateConversationPayload = {}) => {
    const response = await apiClient<ApiSuccessResponse<ConversationDetail>>(
      "/conversations",
      {
        method: "POST",
        body: payload,
      },
    );
    return response.data;
  },
  getById: async (conversationId: string) => {
    const response = await apiClient<ApiSuccessResponse<ConversationDetail>>(
      `/conversations/${conversationId}`,
    );
    return response.data;
  },
  cancel: async (conversationId: string) => {
    const response = await apiClient<
      ApiSuccessResponse<{ id: string; status: "CANCELLED" }>
    >(`/conversations/${conversationId}/cancel`, {
      method: "PATCH",
    });

    return response.data;
  },
};
