import { prisma } from "../../db/prisma";
import { AppError } from "../../utils/app-error";
import { loggedGenerateText } from "../llm/logged-llm-client";
import type { ProviderName } from "../llm/llm.types";

type SendMessageInput = {
  content: string;
  provider?: ProviderName;
  model?: string;
};

const sendMessage = async (conversationId: string, input: SendMessageInput) => {
  const conversation = await prisma.conversation.findUnique({
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

  const userMessage = await prisma.chatMessage.create({
    data: {
      conversationId,
      role: "USER",
      content: input.content,
    },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });

  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  const recentMessages = await prisma.chatMessage.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      role: true,
      content: true,
    },
  });

  const llmMessages = [
    {
      role: "system" as const,
      content: "You are a concise helpful assistant.",
    },
    ...recentMessages.reverse().map((message) => ({
      role: message.role.toLowerCase() as "user" | "assistant" | "system",
      content: message.content,
    })),
  ];

  let llmResponse;

  try {
    llmResponse = await loggedGenerateText({
      conversationId,
      provider: input.provider,
      model: input.model,
      messages: llmMessages,
    });
  } catch (_error) {
    throw new AppError("LLM request failed. Please try again.", 502);
  }

  const assistantMessage = await prisma.chatMessage.create({
    data: {
      conversationId,
      role: "ASSISTANT",
      content: llmResponse.content,
    },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });

  await prisma.conversation.update({
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
};

export const chatService = {
  sendMessage,
};
