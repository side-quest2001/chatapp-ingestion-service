import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../app";
import { cleanupDatabase, prisma } from "./test-helpers";

describe("ingestion API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it("stores a valid inference log and redacts sensitive previews", async () => {
    const response = await request(app)
      .post("/api/ingestion/inference-logs")
      .send({
        provider: "openai",
        model: "gpt-4.1-mini",
        status: "SUCCESS",
        latencyMs: 842,
        inputPreview:
          "Contact me at test@example.com or +91 9876543210 with apiKey=sk_secret_12345678",
        outputPreview:
          "user email test@example.com token: ghp_1234567890abcdef and phone 09876543210",
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
        startedAt: "2026-05-22T10:00:00.000Z",
        completedAt: "2026-05-22T10:00:01.000Z",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      provider: "openai",
      model: "gpt-4.1-mini",
      status: "SUCCESS",
      latencyMs: 842,
      totalTokens: 30,
    });
    expect(response.body.data.inputPreview).toContain("[REDACTED_EMAIL]");
    expect(response.body.data.inputPreview).toContain("[REDACTED_PHONE]");
    expect(response.body.data.inputPreview).toContain("[REDACTED_SECRET]");
    expect(response.body.data.outputPreview).toContain("[REDACTED_EMAIL]");
    expect(response.body.data.outputPreview).toContain("[REDACTED_PHONE]");
    expect(response.body.data.outputPreview).toContain("[REDACTED_SECRET]");

    const storedLog = await prisma.inferenceLog.findUnique({
      where: { id: response.body.data.id as string },
    });

    expect(storedLog).not.toBeNull();
    expect(storedLog?.inputPreview).toContain("[REDACTED_EMAIL]");
    expect(storedLog?.outputPreview).toContain("[REDACTED_SECRET]");
  });

  it("returns 400 for invalid payloads", async () => {
    const response = await request(app)
      .post("/api/ingestion/inference-logs")
      .send({
        provider: "openai",
        model: "gpt-4.1-mini",
        status: "BROKEN",
        latencyMs: -1,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toEqual(expect.any(String));
  });
});
