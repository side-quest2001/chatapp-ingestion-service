import { generateText } from "ai";
import { performance } from "node:perf_hooks";

import { env } from "../../config/env";
import { sendInferenceLog } from "../ingestion/ingestion.client";
import { createPreview } from "./redaction";
import {
  resolveDefaultModel,
  resolveModel,
} from "./provider-resolver";
import type {
  LoggedGenerateTextInput,
  LoggedGenerateTextResult,
  ProviderName,
} from "./llm.types";

type UsageShape = Partial<{
  inputTokens: number;
  promptTokens: number;
  outputTokens: number;
  completionTokens: number;
  totalTokens: number;
}>;

const getUsage = (usage: UsageShape | undefined) => ({
  promptTokens: usage?.inputTokens ?? usage?.promptTokens,
  completionTokens: usage?.outputTokens ?? usage?.completionTokens,
  totalTokens: usage?.totalTokens,
});

const buildInputPreview = (messages: LoggedGenerateTextInput["messages"]) => {
  const recentMessages = messages.slice(-4);
  const joined = recentMessages
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  return createPreview(joined);
};

export const loggedGenerateText = async (
  input: LoggedGenerateTextInput,
): Promise<LoggedGenerateTextResult> => {
  const provider: ProviderName = input.provider ?? env.DEFAULT_LLM_PROVIDER;
  const model = input.model ?? resolveDefaultModel(provider);
  const startedAt = new Date();
  const startedPerformance = performance.now();
  const inputPreview = buildInputPreview(input.messages);

  try {
    const result = await generateText({
      model: resolveModel(provider, model),
      messages: input.messages,
    });

    const latencyMs = Math.round(performance.now() - startedPerformance);
    const completedAt = new Date();
    const usage = getUsage(result.usage as UsageShape | undefined);

    await sendInferenceLog({
      conversationId: input.conversationId,
      provider,
      model,
      status: "SUCCESS",
      latencyMs,
      inputPreview,
      outputPreview: createPreview(result.text),
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
      startedAt,
      completedAt,
      metadata: {
        messageCount: input.messages.length,
      },
    });

    return {
      content: result.text,
      usage,
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startedPerformance);
    const completedAt = new Date();
    const errorMessage =
      error instanceof Error ? error.message : "Unknown LLM request failure";

    await sendInferenceLog({
      conversationId: input.conversationId,
      provider,
      model,
      status: "ERROR",
      latencyMs,
      inputPreview,
      errorMessage,
      startedAt,
      completedAt,
      metadata: {
        messageCount: input.messages.length,
      },
    });

    throw error;
  }
};
