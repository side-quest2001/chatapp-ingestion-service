import type { CreateChatMessageBody } from "./chat.schema";

type ChatMessageRecord = {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
};

export type SendMessageRequestDto = CreateChatMessageBody;

export const toChatMessageDto = (message: ChatMessageRecord) => ({
  id: message.id,
  role: message.role,
  content: message.content,
  createdAt: message.createdAt.toISOString(),
});

export const toSendMessageResultDto = (result: {
  userMessage: ChatMessageRecord;
  assistantMessage: ChatMessageRecord;
}) => ({
  userMessage: toChatMessageDto(result.userMessage),
  assistantMessage: toChatMessageDto(result.assistantMessage),
});

export const toStreamDoneDto = toSendMessageResultDto;
