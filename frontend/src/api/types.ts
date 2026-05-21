export type ProviderName = "groq" | "openai" | "deepseek";

export type ConversationStatus = "ACTIVE" | "CANCELLED" | "ARCHIVED";
export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export type ConversationSummary = {
  id: string;
  title: string | null;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type ConversationDetail = {
  id: string;
  title: string | null;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

export type CreateConversationPayload = {
  title?: string;
};

export type SendMessagePayload = {
  content: string;
  provider?: ProviderName;
  model?: string;
};

export type SendMessageResponse = {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};
