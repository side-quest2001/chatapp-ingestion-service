import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { app } from "../app";
import { cleanupDatabase } from "./test-helpers";

describe("conversation and chat APIs", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  it("creates, lists, fetches, and cancels conversations", async () => {
    const createResponse = await request(app)
      .post("/api/conversations")
      .send({ title: "Integration thread" });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data).toMatchObject({
      title: "Integration thread",
      status: "ACTIVE",
    });

    const conversationId = createResponse.body.data.id as string;

    const listResponse = await request(app).get("/api/conversations");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.success).toBe(true);
    expect(listResponse.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: conversationId,
          title: "Integration thread",
          messageCount: 0,
        }),
      ]),
    );

    const getResponse = await request(app).get(
      `/api/conversations/${conversationId}`,
    );
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.success).toBe(true);
    expect(getResponse.body.data).toMatchObject({
      id: conversationId,
      title: "Integration thread",
      messages: [],
    });
    expect(Array.isArray(getResponse.body.data.messages)).toBe(true);

    const cancelResponse = await request(app).patch(
      `/api/conversations/${conversationId}/cancel`,
    );
    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.success).toBe(true);
    expect(cancelResponse.body.data).toMatchObject({
      id: conversationId,
      status: "CANCELLED",
    });
  });

  it("guards cancelled conversations before any LLM call", async () => {
    const createResponse = await request(app).post("/api/conversations").send({});
    const conversationId = createResponse.body.data.id as string;

    await request(app).patch(`/api/conversations/${conversationId}/cancel`);

    const sendResponse = await request(app)
      .post(`/api/chat/${conversationId}/messages`)
      .send({
        content: "This should be blocked",
        provider: "groq",
        model: "llama-3.1-8b-instant",
      });

    expect(sendResponse.status).toBe(400);
    expect(sendResponse.body).toMatchObject({
      success: false,
      message: "Cancelled conversations cannot accept new messages",
    });
  });
});
