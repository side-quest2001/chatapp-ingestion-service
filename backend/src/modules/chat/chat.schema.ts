import { z } from "zod";

import type { ProviderName } from "../llm/llm.types";

export const chatMessageParamsSchema = z.object({
  conversationId: z.uuid("Invalid conversation id"),
});

export const createChatMessageBodySchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
  provider: z.enum(["groq", "openai", "deepseek"]).optional(),
  model: z.string().trim().min(1, "Model cannot be empty").optional(),
});

export type ChatMessageParams = z.infer<typeof chatMessageParamsSchema>;
export type CreateChatMessageBody = z.infer<typeof createChatMessageBodySchema>;
export type ChatProviderName = ProviderName;
