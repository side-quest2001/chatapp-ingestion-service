import type { Request, Response } from "express";

import { createInferenceLogBodySchema } from "./ingestion.schema";
import { ingestionService } from "./ingestion.service";

const createInferenceLog = async (request: Request, response: Response) => {
  const payload = createInferenceLogBodySchema.parse(request.body);
  const inferenceLog = await ingestionService.createInferenceLog(payload);

  response.status(201).json({
    success: true,
    data: inferenceLog,
  });
};

export const ingestionController = {
  createInferenceLog,
};
