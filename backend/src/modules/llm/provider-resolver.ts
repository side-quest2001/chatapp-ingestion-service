import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { deepseek } from "@ai-sdk/deepseek";

import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";
import type { ProviderName } from "./llm.types";

const assertConfigured = (provider: ProviderName, apiKey?: string) => {
  if (!apiKey) {
    throw new AppError(
      `LLM provider "${provider}" is not configured. Missing API key.`,
      500,
    );
  }
};

export const resolveModel = (provider: ProviderName, model: string) => {
  switch (provider) {
    case "groq":
      assertConfigured(provider, env.GROQ_API_KEY);
      return groq(model);
    case "openai":
      assertConfigured(provider, env.OPENAI_API_KEY);
      return openai(model);
    case "deepseek":
      assertConfigured(provider, env.DEEPSEEK_API_KEY);
      return deepseek(model);
    default:
      throw new AppError(`Unsupported LLM provider: ${provider satisfies never}`, 500);
  }
};

export const resolveDefaultModel = (provider: ProviderName): string => {
  switch (provider) {
    case "groq":
      return env.GROQ_MODEL;
    case "openai":
      return env.OPENAI_MODEL;
    case "deepseek":
      return env.DEEPSEEK_MODEL;
    default:
      throw new AppError(`Unsupported LLM provider: ${provider satisfies never}`, 500);
  }
};
