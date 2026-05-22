import type { CreateInferenceLogBody } from "./ingestion.schema";

type InferenceLogRecord = {
  id: string;
  conversationId: string | null;
  provider: string;
  model: string;
  status: string;
  latencyMs: number;
  inputPreview: string | null;
  outputPreview: string | null;
  errorMessage: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  metadata: unknown;
};

export type CreateInferenceLogRequestDto = CreateInferenceLogBody;

export const toInferenceLogDto = (log: InferenceLogRecord) => ({
  id: log.id,
  conversationId: log.conversationId,
  provider: log.provider,
  model: log.model,
  status: log.status,
  latencyMs: log.latencyMs,
  inputPreview: log.inputPreview,
  outputPreview: log.outputPreview,
  errorMessage: log.errorMessage,
  promptTokens: log.promptTokens,
  completionTokens: log.completionTokens,
  totalTokens: log.totalTokens,
  startedAt: log.startedAt.toISOString(),
  completedAt: log.completedAt?.toISOString() ?? null,
  createdAt: log.createdAt.toISOString(),
  metadata: log.metadata,
});
