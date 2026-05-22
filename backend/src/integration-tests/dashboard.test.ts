import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../app";
import { cleanupDatabase, prisma } from "./test-helpers";

describe("dashboard API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it("returns correct summary aggregates from seeded logs", async () => {
    await prisma.inferenceLog.createMany({
      data: [
        {
          provider: "openai",
          model: "gpt-4.1-mini",
          status: "SUCCESS",
          latencyMs: 1000,
          totalTokens: 100,
          promptTokens: 40,
          completionTokens: 60,
          startedAt: new Date("2026-05-22T10:00:00.000Z"),
          completedAt: new Date("2026-05-22T10:00:01.000Z"),
        },
        {
          provider: "openai",
          model: "gpt-4.1-mini",
          status: "ERROR",
          latencyMs: 500,
          totalTokens: 50,
          promptTokens: 25,
          completionTokens: 25,
          startedAt: new Date("2026-05-22T11:00:00.000Z"),
          completedAt: new Date("2026-05-22T11:00:00.500Z"),
        },
        {
          provider: "groq",
          model: "llama-3.1-8b-instant",
          status: "SUCCESS",
          latencyMs: 1500,
          totalTokens: 150,
          promptTokens: 75,
          completionTokens: 75,
          startedAt: new Date("2026-05-22T12:00:00.000Z"),
          completedAt: new Date("2026-05-22T12:00:01.500Z"),
        },
      ],
    });

    const response = await request(app).get("/api/dashboard/summary");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      totalRequests: 3,
      successCount: 2,
      errorCount: 1,
      cancelledCount: 0,
      averageLatencyMs: 1000,
      totalTokens: 300,
      totalPromptTokens: 140,
      totalCompletionTokens: 160,
      providerCount: 2,
      modelCount: 2,
    });
  });
});
