import type { CreateInferenceLogBody } from "./ingestion.schema";
import { ingestionService } from "./ingestion.service";

export const sendInferenceLog = async (payload: CreateInferenceLogBody) => {
  try {
    return await ingestionService.createInferenceLog(payload);
  } catch (error) {
    console.error("Failed to persist inference log", error);
    return null;
  }
};
