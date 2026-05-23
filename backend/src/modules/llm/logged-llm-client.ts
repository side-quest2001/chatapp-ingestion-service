import { generateText, streamText } from "ai";
import { performance } from "node:perf_hooks";

import { env } from "../../config/env";
import { publishInferenceLogCreated } from "../events/inference-log.events";
import { createPreview } from "./redaction";
import {
  resolveDefaultModel,
  resolveModel,
} from "./provider-resolver";
import type {
  LoggedGenerateTextInput,
  LoggedGenerateTextResult,
  LoggedTextStreamResult,
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

const publishSuccessLog = (payload: {
  conversationId: string;
  provider: ProviderName;
  model: string;
  inputPreview: string;
  outputText: string;
  usage: ReturnType<typeof getUsage>;
  startedAt: Date;
  completedAt: Date;
  latencyMs: number;
  messageCount: number;
}) => {
  publishInferenceLogCreated({
    conversationId: payload.conversationId,
    provider: payload.provider,
    model: payload.model,
    status: "SUCCESS",
    latencyMs: payload.latencyMs,
    inputPreview: payload.inputPreview,
    outputPreview: createPreview(payload.outputText),
    promptTokens: payload.usage.promptTokens,
    completionTokens: payload.usage.completionTokens,
    totalTokens: payload.usage.totalTokens,
    startedAt: payload.startedAt,
    completedAt: payload.completedAt,
    metadata: {
      messageCount: payload.messageCount,
    },
  });
};

const publishErrorLog = (payload: {
  conversationId: string;
  provider: ProviderName;
  model: string;
  inputPreview: string;
  startedAt: Date;
  completedAt: Date;
  latencyMs: number;
  messageCount: number;
  errorMessage: string;
}) => {
  publishInferenceLogCreated({
    conversationId: payload.conversationId,
    provider: payload.provider,
    model: payload.model,
    status: "ERROR",
    latencyMs: payload.latencyMs,
    inputPreview: payload.inputPreview,
    errorMessage: payload.errorMessage,
    startedAt: payload.startedAt,
    completedAt: payload.completedAt,
    metadata: {
      messageCount: payload.messageCount,
    },
  });
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

    publishSuccessLog({
      conversationId: input.conversationId,
      provider,
      model,
      inputPreview,
      outputText: result.text,
      usage,
      startedAt,
      completedAt,
      latencyMs,
      messageCount: input.messages.length,
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

    publishErrorLog({
      conversationId: input.conversationId,
      provider,
      model,
      inputPreview,
      startedAt,
      completedAt,
      latencyMs,
      messageCount: input.messages.length,
      errorMessage,
    });

    throw error;
  }
};

export const createLoggedTextStream = (
  input: LoggedGenerateTextInput,
): LoggedTextStreamResult => {
  const provider: ProviderName = input.provider ?? env.DEFAULT_LLM_PROVIDER;
  const model = input.model ?? resolveDefaultModel(provider);
  const startedAt = new Date();
  const startedPerformance = performance.now();
  const inputPreview = buildInputPreview(input.messages);

  try {
    const result = streamText({
      model: resolveModel(provider, model),
      messages: input.messages,
    });

    return {
      provider,
      model,
      startedAt,
      textStream: result.textStream,
      finish: async (fullText: string) => {
        const usage = getUsage((await result.usage) as UsageShape | undefined);
        const latencyMs = Math.round(performance.now() - startedPerformance);
        const completedAt = new Date();

        publishSuccessLog({
          conversationId: input.conversationId,
          provider,
          model,
          inputPreview,
          outputText: fullText,
          usage,
          startedAt,
          completedAt,
          latencyMs,
          messageCount: input.messages.length,
        });

        return {
          usage,
          latencyMs,
          completedAt,
        };
      },
      fail: (error: unknown) => {
        const latencyMs = Math.round(performance.now() - startedPerformance);
        const completedAt = new Date();
        const errorMessage =
          error instanceof Error ? error.message : "Unknown LLM request failure";

        publishErrorLog({
          conversationId: input.conversationId,
          provider,
          model,
          inputPreview,
          startedAt,
          completedAt,
          latencyMs,
          messageCount: input.messages.length,
          errorMessage,
        });
      },
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startedPerformance);
    const completedAt = new Date();
    const errorMessage =
      error instanceof Error ? error.message : "Unknown LLM request failure";

    publishErrorLog({
      conversationId: input.conversationId,
      provider,
      model,
      inputPreview,
      startedAt,
      completedAt,
      latencyMs,
      messageCount: input.messages.length,
      errorMessage,
    });

    throw error;
  }
};
