export type ProviderName = "groq" | "openai" | "deepseek";

export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LoggedGenerateTextInput = {
  conversationId: string;
  provider?: ProviderName;
  model?: string;
  messages: LlmMessage[];
};

export type LoggedGenerateTextResult = {
  content: string;
  usage: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
};
