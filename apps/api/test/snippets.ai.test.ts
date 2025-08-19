import request from "supertest";
import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import mongoose from "mongoose";
import app from "../src/app";
import * as aiService from "../src/services/ai.services";

// Mock summarizeText to avoid real OpenAI calls
vi.spyOn(aiService, "summarizeText").mockResolvedValue("Mock summary here");

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/snippets_test");
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Snippets API", () => {
  it("should create a snippet", async () => {
    const res = await request(app)
      .post("/snippets")
      .send({
        text: `Content teams often need a quick way to paste in raw text (blog drafts,
transcripts, etc.) and get back short, AI-generated summaries they can reuse
elsewhere. You will build the back-end for such a service`,
      });

    expect(res.status).toBe(200);
    expect(res.body.summary).toContain("Mock summary here");
  });

  it("should list snippets", async () => {
    const res = await request(app).get("/snippets");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a snippet", async () => {
    const res = await request(app).get("/snippets/1");
    expect(res.status).toBe(200);
    expect(res.body.summary).toContain("content");
  });
});
