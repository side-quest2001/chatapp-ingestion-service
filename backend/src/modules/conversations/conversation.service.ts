import { prisma } from "../../db/prisma";
import { AppError } from "../../utils/app-error";
import {
  toConversationDetailDto,
  toConversationDto,
  toConversationStatusDto,
  toConversationSummaryDto,
} from "./conversation.dto";

const DEFAULT_CONVERSATION_TITLE = "New conversation";

const createConversation = async (title?: string) => {
  const conversation = await prisma.conversation.create({
    data: {
      title: title ?? DEFAULT_CONVERSATION_TITLE,
    },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return toConversationDto(conversation);
};

const listConversations = async () => {
  const conversations = await prisma.conversation.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  return conversations.map(toConversationSummaryDto);
};

const getConversationById = async (conversationId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  return toConversationDetailDto(conversation);
};

const cancelConversation = async (conversationId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    select: {
      id: true,
    },
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const updatedConversation = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      status: "CANCELLED",
    },
    select: {
      id: true,
      status: true,
    },
  });

  return toConversationStatusDto(updatedConversation);
};

export const conversationService = {
  createConversation,
  listConversations,
  getConversationById,
  cancelConversation,
};
