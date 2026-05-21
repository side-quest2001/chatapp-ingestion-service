import { z } from "zod";

export const dashboardStatusSchema = z.enum(["SUCCESS", "ERROR", "CANCELLED"]);
export const latencyBucketSchema = z.enum(["minute", "hour", "day"]);

export const recentLogsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: dashboardStatusSchema.optional(),
  provider: z.string().trim().min(1, "Provider cannot be empty").optional(),
  model: z.string().trim().min(1, "Model cannot be empty").optional(),
});

export const latencyQuerySchema = z.object({
  bucket: latencyBucketSchema.default("hour"),
  limit: z.coerce.number().int().positive().max(100).default(24),
});

export type RecentLogsQuery = z.infer<typeof recentLogsQuerySchema>;
export type LatencyQuery = z.infer<typeof latencyQuerySchema>;
