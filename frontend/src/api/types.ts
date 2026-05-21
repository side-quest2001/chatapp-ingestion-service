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

export type DashboardSummary = {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  cancelledCount: number;
  successRate: number;
  averageLatencyMs: number;
  totalTokens: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  providerCount: number;
  modelCount: number;
};

export type RecentInferenceLog = {
  id: string;
  conversationId: string | null;
  provider: string;
  model: string;
  status: "SUCCESS" | "ERROR" | "CANCELLED";
  latencyMs: number;
  inputPreview: string | null;
  outputPreview: string | null;
  errorMessage: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
};

export type LatencyPoint = {
  bucket: string;
  averageLatencyMs: number;
  requestCount: number;
};

export type StatusBreakdownItem = {
  status: "SUCCESS" | "ERROR" | "CANCELLED";
  count: number;
};

export type ProviderBreakdownItem = {
  provider: string;
  model: string;
  requestCount: number;
  averageLatencyMs: number;
  errorCount: number;
  totalTokens: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};
