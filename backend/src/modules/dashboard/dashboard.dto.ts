import type { LatencyQuery, RecentLogsQuery } from "./dashboard.schema";

type DashboardSummaryRecord = {
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
};

type LatencyPointRecord = {
  bucket: Date;
  averageLatencyMs: number | null;
  requestCount: bigint;
};

type StatusBreakdownRecord = {
  status: string;
  count: number;
};

type ProviderBreakdownRecord = {
  provider: string;
  model: string;
  requestCount: number;
  averageLatencyMs: number;
  errorCount: number;
  totalTokens: number;
};

export type RecentLogsRequestDto = RecentLogsQuery;
export type LatencySeriesRequestDto = LatencyQuery;

export const toDashboardSummaryDto = (summary: DashboardSummaryRecord) => ({
  ...summary,
});

export const toRecentInferenceLogDto = (log: InferenceLogRecord) => ({
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
});

export const toLatencyPointDto = (row: LatencyPointRecord) => ({
  bucket: row.bucket.toISOString(),
  averageLatencyMs: row.averageLatencyMs ?? 0,
  requestCount: Number(row.requestCount),
});

export const toStatusBreakdownDto = (entry: StatusBreakdownRecord) => ({
  status: entry.status,
  count: entry.count,
});

export const toProviderBreakdownDto = (entry: ProviderBreakdownRecord) => ({
  provider: entry.provider,
  model: entry.model,
  requestCount: entry.requestCount,
  averageLatencyMs: entry.averageLatencyMs,
  errorCount: entry.errorCount,
  totalTokens: entry.totalTokens,
});
