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

export type LoggedUsage = LoggedGenerateTextResult["usage"];

export type LoggedTextStreamResult = {
  provider: ProviderName;
  model: string;
  startedAt: Date;
  textStream: AsyncIterable<string>;
  finish: (
    fullText: string,
  ) => Promise<{
    usage: LoggedUsage;
    latencyMs: number;
    completedAt: Date;
  }>;
  fail: (error: unknown) => void;
};
