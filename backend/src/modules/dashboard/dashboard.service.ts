import { Prisma } from "@prisma/client";

import { prisma } from "../../db/prisma";
import {
  toDashboardSummaryDto,
  toLatencyPointDto,
  toProviderBreakdownDto,
  toRecentInferenceLogDto,
  toStatusBreakdownDto,
} from "./dashboard.dto";
import type { LatencyQuery, RecentLogsQuery } from "./dashboard.schema";

const INFERENCE_STATUSES = ["SUCCESS", "ERROR", "CANCELLED"] as const;
const LATENCY_BUCKET_SQL: Record<LatencyQuery["bucket"], Prisma.Sql> = {
  minute: Prisma.sql`DATE_TRUNC('minute', "createdAt")`,
  hour: Prisma.sql`DATE_TRUNC('hour', "createdAt")`,
  day: Prisma.sql`DATE_TRUNC('day', "createdAt")`,
};

const getSummary = async () => {
  const [
    totalRequests,
    groupedStatuses,
    aggregateMetrics,
    distinctProviders,
    distinctModels,
  ] = await Promise.all([
    prisma.inferenceLog.count(),
    prisma.inferenceLog.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
    prisma.inferenceLog.aggregate({
      _avg: {
        latencyMs: true,
      },
      _sum: {
        totalTokens: true,
        promptTokens: true,
        completionTokens: true,
      },
    }),
    prisma.inferenceLog.findMany({
      distinct: ["provider"],
      select: {
        provider: true,
      },
    }),
    prisma.inferenceLog.findMany({
      distinct: ["model"],
      select: {
        model: true,
      },
    }),
  ]);

  const countsByStatus = INFERENCE_STATUSES.reduce<Record<string, number>>(
    (accumulator, status) => ({
      ...accumulator,
      [status]: 0,
    }),
    {},
  );

  for (const groupedStatus of groupedStatuses) {
    countsByStatus[groupedStatus.status] = groupedStatus._count.status;
  }

  const successCount = countsByStatus.SUCCESS;
  const errorCount = countsByStatus.ERROR;
  const cancelledCount = countsByStatus.CANCELLED;

  return toDashboardSummaryDto({
    totalRequests,
    successCount,
    errorCount,
    cancelledCount,
    successRate:
      totalRequests === 0
        ? 0
        : Number(((successCount / totalRequests) * 100).toFixed(2)),
    averageLatencyMs: Math.round(aggregateMetrics._avg.latencyMs ?? 0),
    totalTokens: aggregateMetrics._sum.totalTokens ?? 0,
    totalPromptTokens: aggregateMetrics._sum.promptTokens ?? 0,
    totalCompletionTokens: aggregateMetrics._sum.completionTokens ?? 0,
    providerCount: distinctProviders.length,
    modelCount: distinctModels.length,
  });
};

const getRecentLogs = async (query: RecentLogsQuery) => {
  const logs = await prisma.inferenceLog.findMany({
    where: {
      status: query.status,
      provider: query.provider,
      model: query.model,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: query.limit,
    select: {
      id: true,
      conversationId: true,
      provider: true,
      model: true,
      status: true,
      latencyMs: true,
      inputPreview: true,
      outputPreview: true,
      errorMessage: true,
      promptTokens: true,
      completionTokens: true,
      totalTokens: true,
      startedAt: true,
      completedAt: true,
      createdAt: true,
    },
  });

  return logs.map(toRecentInferenceLogDto);
};

type LatencyRow = {
  bucket: Date;
  averageLatencyMs: number | null;
  requestCount: bigint;
};

const getLatencySeries = async (query: LatencyQuery) => {
  const bucketExpression = LATENCY_BUCKET_SQL[query.bucket];

  const rows = await prisma.$queryRaw<LatencyRow[]>(Prisma.sql`
    SELECT
      ${bucketExpression} AS "bucket",
      ROUND(AVG("latencyMs"))::int AS "averageLatencyMs",
      COUNT(*)::bigint AS "requestCount"
    FROM "InferenceLog"
    GROUP BY 1
    ORDER BY 1 DESC
    LIMIT ${query.limit}
  `);

  return rows.map(toLatencyPointDto).reverse();
};

const getStatusBreakdown = async () => {
  const groupedStatuses = await prisma.inferenceLog.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  const countsByStatus = groupedStatuses.reduce<Record<string, number>>(
    (accumulator, groupedStatus) => ({
      ...accumulator,
      [groupedStatus.status]: groupedStatus._count.status,
    }),
    {},
  );

  return INFERENCE_STATUSES.map((status) =>
    toStatusBreakdownDto({
      status,
      count: countsByStatus[status] ?? 0,
    }),
  );
};

const getProviderBreakdown = async () => {
  const groupedBreakdown = await prisma.inferenceLog.groupBy({
    by: ["provider", "model"],
    _count: {
      _all: true,
    },
    _avg: {
      latencyMs: true,
    },
    _sum: {
      totalTokens: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  return groupedBreakdown.map((entry) =>
    toProviderBreakdownDto({
      provider: entry.provider,
      model: entry.model,
      requestCount: entry._count._all,
      averageLatencyMs: Math.round(entry._avg.latencyMs ?? 0),
      errorCount: 0,
      totalTokens: entry._sum.totalTokens ?? 0,
    }),
  );
};

const attachProviderErrorCounts = async () => {
  const errorGroups = await prisma.inferenceLog.groupBy({
    by: ["provider", "model"],
    where: {
      status: "ERROR",
    },
    _count: {
      _all: true,
    },
  });

  return errorGroups.reduce<Record<string, number>>((accumulator, entry) => {
    accumulator[`${entry.provider}::${entry.model}`] = entry._count._all;
    return accumulator;
  }, {});
};

const getProviderBreakdownWithErrors = async () => {
  const [breakdown, errorCounts] = await Promise.all([
    getProviderBreakdown(),
    attachProviderErrorCounts(),
  ]);

  return breakdown.map((entry) => ({
    ...entry,
    errorCount: errorCounts[`${entry.provider}::${entry.model}`] ?? 0,
  }));
};

export const dashboardService = {
  getSummary,
  getRecentLogs,
  getLatencySeries,
  getStatusBreakdown,
  getProviderBreakdown: getProviderBreakdownWithErrors,
};
