import type { Request, Response } from "express";

import {
  conversationParamsSchema,
  createConversationBodySchema,
} from "./conversation.schema";
import { conversationService } from "./conversation.service";

const createConversation = async (request: Request, response: Response) => {
  const { title } = createConversationBodySchema.parse(request.body);
  const conversation = await conversationService.createConversation(title);

  response.status(201).json({
    success: true,
    data: conversation,
  });
};

const listConversations = async (_request: Request, response: Response) => {
  const conversations = await conversationService.listConversations();

  response.status(200).json({
    success: true,
    data: conversations,
  });
};

const getConversation = async (request: Request, response: Response) => {
  const { conversationId } = conversationParamsSchema.parse(request.params);
  const conversation = await conversationService.getConversationById(conversationId);

  response.status(200).json({
    success: true,
    data: conversation,
  });
};

const cancelConversation = async (request: Request, response: Response) => {
  const { conversationId } = conversationParamsSchema.parse(request.params);
  const conversation = await conversationService.cancelConversation(conversationId);

  response.status(200).json({
    success: true,
    data: conversation,
  });
};

export const conversationController = {
  createConversation,
  listConversations,
  getConversation,
  cancelConversation,
};
