import { prisma } from "../../db/prisma";
import { AppError } from "../../utils/app-error";

const MAX_MOCK_PREVIEW_LENGTH = 120;

const sendMessage = async (conversationId: string, content: string) => {
  return prisma.$transaction(async (tx) => {
    const conversation = await tx.conversation.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    if (conversation.status === "CANCELLED") {
      throw new AppError("Cancelled conversations cannot accept new messages", 400);
    }

    const userMessage = await tx.chatMessage.create({
      data: {
        conversationId,
        role: "USER",
        content,
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    const assistantMessage = await tx.chatMessage.create({
      data: {
        conversationId,
        role: "ASSISTANT",
        content: `Mock assistant response: ${content.slice(0, MAX_MOCK_PREVIEW_LENGTH)}`,
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    await tx.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return {
      userMessage,
      assistantMessage,
    };
  });
};

export const chatService = {
  sendMessage,
};
