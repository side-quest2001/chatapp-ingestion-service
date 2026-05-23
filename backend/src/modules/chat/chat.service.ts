import { prisma } from "../../db/prisma";
import { AppError } from "../../utils/app-error";
import { createLoggedTextStream, loggedGenerateText } from "../llm/logged-llm-client";
import type { ProviderName } from "../llm/llm.types";
import { toChatMessageDto, toSendMessageResultDto, toStreamDoneDto } from "./chat.dto";

type SendMessageInput = {
  content: string;
  provider?: ProviderName;
  model?: string;
};

const getConversationForReply = async (conversationId: string) => {
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

  return conversation;
};

const markConversationUpdated = async (conversationId: string) => {
  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      updatedAt: new Date(),
    },
  });
};

const buildLlmMessages = async (conversationId: string) => {
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

  return [
    {
      role: "system" as const,
      content: "You are a concise helpful assistant.",
    },
    ...recentMessages.reverse().map((message) => ({
      role: message.role.toLowerCase() as "user" | "assistant" | "system",
      content: message.content,
    })),
  ];
};

const createUserMessage = async (conversationId: string, content: string) => {
  const userMessage = await prisma.chatMessage.create({
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

  await markConversationUpdated(conversationId);

  return userMessage;
};

const createAssistantMessage = async (conversationId: string, content: string) => {
  const assistantMessage = await prisma.chatMessage.create({
    data: {
      conversationId,
      role: "ASSISTANT",
      content,
    },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });

  await markConversationUpdated(conversationId);

  return assistantMessage;
};

const prepareReplyContext = async (conversationId: string, input: SendMessageInput) => {
  await getConversationForReply(conversationId);

  const userMessage = await createUserMessage(conversationId, input.content);
  const llmMessages = await buildLlmMessages(conversationId);

  return {
    userMessage,
    llmMessages,
  };
};

const sendMessage = async (conversationId: string, input: SendMessageInput) => {
  const { userMessage, llmMessages } = await prepareReplyContext(conversationId, input);

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

  const assistantMessage = await createAssistantMessage(
    conversationId,
    llmResponse.content,
  );

  return toSendMessageResultDto({
    userMessage,
    assistantMessage,
  });
};

const createStreamSession = async (conversationId: string, input: SendMessageInput) => {
  const { userMessage, llmMessages } = await prepareReplyContext(conversationId, input);
  const stream = createLoggedTextStream({
    conversationId,
    provider: input.provider,
    model: input.model,
    messages: llmMessages,
  });

  return {
    userMessage,
    stream,
    async finalize(fullAssistantText: string) {
      await stream.finish(fullAssistantText);

      const assistantMessage = await createAssistantMessage(
        conversationId,
        fullAssistantText,
      );

      return toStreamDoneDto({
        userMessage,
        assistantMessage,
      });
    },
    fail(error: unknown) {
      stream.fail(error);
      throw new AppError("LLM request failed. Please try again.", 502);
    },
  };
};

export const chatService = {
  sendMessage,
  createStreamSession,
};
