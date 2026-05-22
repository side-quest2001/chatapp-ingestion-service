import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../app";

describe("GET /api/health", () => {
  it("returns status ok and service metadata", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      service: "llm-inference-logger-api",
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
  });
});
