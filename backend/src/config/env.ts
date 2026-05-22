import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const loadEnvironment = () => {
  const cwd = process.cwd();
  const testEnvPath = path.join(cwd, ".env.test");
  const defaultEnvPath = path.join(cwd, ".env");

  if (process.env.NODE_ENV === "test" && fs.existsSync(testEnvPath)) {
    dotenv.config({ path: testEnvPath });
    return;
  }

  if (fs.existsSync(defaultEnvPath)) {
    dotenv.config({ path: defaultEnvPath });
    return;
  }

  dotenv.config();
};

loadEnvironment();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  FRONTEND_URL: z.url().default("http://localhost:5173"),
  GROQ_API_KEY: z.string().min(1).optional(),
  GROQ_MODEL: z.string().min(1).default("llama-3.1-8b-instant"),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
  DEEPSEEK_API_KEY: z.string().min(1).optional(),
  DEEPSEEK_MODEL: z.string().min(1).default("deepseek-chat"),
  DEFAULT_LLM_PROVIDER: z
    .enum(["groq", "openai", "deepseek"])
    .default("groq"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");

  throw new Error(`Invalid environment configuration: ${formattedErrors}`);
}

export const env = parsedEnv.data;
