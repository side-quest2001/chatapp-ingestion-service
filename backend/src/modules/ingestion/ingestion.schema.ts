import { z } from "zod";

export const inferenceStatusSchema = z.enum(["SUCCESS", "ERROR", "CANCELLED"]);

export const createInferenceLogBodySchema = z.object({
  conversationId: z.uuid("Invalid conversation id").optional(),
  provider: z.string().trim().min(1, "Provider is required"),
  model: z.string().trim().min(1, "Model is required"),
  status: inferenceStatusSchema,
  latencyMs: z.number().int().nonnegative(),
  inputPreview: z.string().optional(),
  outputPreview: z.string().optional(),
  errorMessage: z.string().optional(),
  promptTokens: z.number().int().nonnegative().optional(),
  completionTokens: z.number().int().nonnegative().optional(),
  totalTokens: z.number().int().nonnegative().optional(),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateInferenceLogBody = z.infer<typeof createInferenceLogBodySchema>;
