import type { Request, Response } from "express";

import { AppError } from "../../utils/app-error";
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

const streamMessage = async (request: Request, response: Response) => {
  const { conversationId } = chatMessageParamsSchema.parse(request.params);
  const { content, provider, model } = createChatMessageBodySchema.parse(request.body);
  let writeEvent: ((payload: Record<string, unknown>) => void) | null = null;
  let streamFailed: ((error: unknown) => never) | null = null;
  let streamStarted = false;

  try {
    const session = await chatService.createStreamSession(
      conversationId,
      {
        content,
        provider,
        model,
      },
    );

    response.status(200);
    response.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");
    streamStarted = true;

    writeEvent = (payload: Record<string, unknown>) => {
      response.write(`${JSON.stringify(payload)}\n`);
    };
    streamFailed = session.fail;

    let fullAssistantText = "";

    for await (const chunk of session.stream.textStream) {
      fullAssistantText += chunk;
      writeEvent({
        type: "chunk",
        text: chunk,
      });
    }

    const result = await session.finalize(fullAssistantText);
    writeEvent({
      type: "done",
      ...result,
    });
  } catch (error) {
    if (!streamStarted) {
      throw error;
    }

    if (streamFailed) {
      try {
        streamFailed(error);
      } catch (appError) {
        error = appError;
      }
    }

    writeEvent?.({
      type: "error",
      message: "LLM request failed. Please try again.",
    });
  } finally {
    if (streamStarted) {
      response.end();
    }
  }
};

export const chatController = {
  sendMessage,
  streamMessage,
};
