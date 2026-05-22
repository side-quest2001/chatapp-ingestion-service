import type { CreateConversationBody } from "./conversation.schema";

type ConversationRecord = {
  id: string;
  title: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type ConversationSummaryRecord = ConversationRecord & {
  _count: {
    messages: number;
  };
};

type ChatMessageRecord = {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
};

type ConversationDetailRecord = ConversationRecord & {
  messages: ChatMessageRecord[];
};

type ConversationStatusRecord = {
  id: string;
  status: string;
};

export type CreateConversationRequestDto = CreateConversationBody;

export const toConversationSummaryDto = (conversation: ConversationSummaryRecord) => ({
  id: conversation.id,
  title: conversation.title,
  status: conversation.status,
  createdAt: conversation.createdAt.toISOString(),
  updatedAt: conversation.updatedAt.toISOString(),
  messageCount: conversation._count.messages,
});

export const toConversationDetailDto = (conversation: ConversationDetailRecord) => ({
  id: conversation.id,
  title: conversation.title,
  status: conversation.status,
  createdAt: conversation.createdAt.toISOString(),
  updatedAt: conversation.updatedAt.toISOString(),
  messages: conversation.messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  })),
});

export const toConversationDto = (conversation: ConversationRecord) => ({
  id: conversation.id,
  title: conversation.title,
  status: conversation.status,
  createdAt: conversation.createdAt.toISOString(),
  updatedAt: conversation.updatedAt.toISOString(),
});

export const toConversationStatusDto = (conversation: ConversationStatusRecord) => ({
  id: conversation.id,
  status: conversation.status,
});
