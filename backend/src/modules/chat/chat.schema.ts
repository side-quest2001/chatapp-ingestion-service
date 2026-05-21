import { z } from "zod";

export const chatMessageParamsSchema = z.object({
  conversationId: z.uuid("Invalid conversation id"),
});

export const createChatMessageBodySchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
});

export type ChatMessageParams = z.infer<typeof chatMessageParamsSchema>;
export type CreateChatMessageBody = z.infer<typeof createChatMessageBodySchema>;
