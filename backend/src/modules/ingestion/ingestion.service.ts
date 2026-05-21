import type { Prisma } from "@prisma/client";

import { prisma } from "../../db/prisma";
import { createPreview } from "../llm/redaction";
import type { CreateInferenceLogBody } from "./ingestion.schema";
import { AppError } from "../../utils/app-error";

const createInferenceLog = async (payload: CreateInferenceLogBody) => {
  let conversationId = payload.conversationId;

  if (conversationId) {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        id: true,
      },
    });

    if (!conversation) {
      throw new AppError("Conversation not found for inference log", 400);
    }
  }

  return prisma.inferenceLog.create({
    data: {
      conversationId,
      provider: payload.provider,
      model: payload.model,
      status: payload.status,
      latencyMs: payload.latencyMs,
      inputPreview: payload.inputPreview
        ? createPreview(payload.inputPreview)
        : undefined,
      outputPreview: payload.outputPreview
        ? createPreview(payload.outputPreview)
        : undefined,
      errorMessage: payload.errorMessage,
      promptTokens: payload.promptTokens,
      completionTokens: payload.completionTokens,
      totalTokens: payload.totalTokens,
      startedAt: payload.startedAt,
      completedAt: payload.completedAt,
      metadata: payload.metadata as Prisma.InputJsonObject | undefined,
    },
  });
};

export const ingestionService = {
  createInferenceLog,
};
