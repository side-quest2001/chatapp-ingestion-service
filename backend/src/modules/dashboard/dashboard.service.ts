import { Prisma } from "@prisma/client";

import { prisma } from "../../db/prisma";

const INFERENCE_STATUSES = ["SUCCESS", "ERROR", "CANCELLED"] as const;

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

  return {
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
  };
};

export const dashboardService = {
  getSummary,
};
