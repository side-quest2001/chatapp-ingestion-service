import { z } from "zod";

export const createConversationBodySchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
});

export const conversationParamsSchema = z.object({
  conversationId: z.uuid("Invalid conversation id"),
});

export type CreateConversationBody = z.infer<typeof createConversationBodySchema>;
export type ConversationParams = z.infer<typeof conversationParamsSchema>;
