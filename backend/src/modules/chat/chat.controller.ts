import type { Request, Response } from "express";

import { chatService } from "./chat.service";
import { createChatMessageBodySchema, chatMessageParamsSchema } from "./chat.schema";

const sendMessage = async (request: Request, response: Response) => {
  const { conversationId } = chatMessageParamsSchema.parse(request.params);
  const { content, provider, model } = createChatMessageBodySchema.parse(request.body);
  const result = await chatService.sendMessage(conversationId, {
    content,
    provider,
    model,
  });

  response.status(201).json({
    success: true,
    data: result,
  });
};

export const chatController = {
  sendMessage,
};
