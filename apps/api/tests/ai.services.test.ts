import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { summarizeText } from "../src/services/ai.services";
import OpenAI from "openai";

// Mock the entire openai module
const ipmock = vi.mock("openai", () => {
  const mockCreate = vi.fn();
  const mockChat = {
    completions: {
      create: mockCreate,
    },
  };
  const mockOpenAI = vi.fn(() => ({
    chat: mockChat,
  }));

  return {
    default: mockOpenAI,
    mockCreate, // Export for assertions
  };
});

// Import the mock after setting it up
const { mockCreate } = await import("openai");

describe("summarizeText", () => {
  const originalEnv = process.env;
  const sampleText =
    "This is a long text that needs to be summarized. It contains multiple sentences and ideas that should be condensed into a brief summary of about 30 words. The summary should capture the main points effectively.";

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.env for each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should throw an error when OPENAI_API_KEY is not set", async () => {
    delete process.env.OPENAI_API_KEY;

    await expect(summarizeText(sampleText)).rejects.toThrow(
      "OPENAI_API_KEY is not set"
    );
  });

  it("should call OpenAI with correct parameters when API key is set", async () => {
    process.env.OPENAI_API_KEY = "test-api-key-123";

    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: "This is a concise summary of the provided text.",
          },
        },
      ],
    });

    await summarizeText(sampleText);

    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockCreate).toHaveBeenCalledWith({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a concise summarizer." },
        {
          role: "user",
          content: `Summarize this text in about 30 words:\n\n${sampleText}`,
        },
      ],
      max_tokens: 100,
    });
  });

  it("should return the summary text when API call is successful", async () => {
    process.env.OPENAI_API_KEY = "test-api-key-123";
    const expectedSummary = "This is a concise summary of the provided text.";

    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: expectedSummary,
          },
        },
      ],
    });

    const result = await summarizeText(sampleText);

    expect(result).toBe(expectedSummary);
  });

  it("should return default message when summary content is null", async () => {
    process.env.OPENAI_API_KEY = "test-api-key-123";

    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: null, // Null content
          },
        },
      ],
    });

    const result = await summarizeText(sampleText);

    expect(result).toBe("No summary generated.");
  });

  it("should handle API errors and return fallback message", async () => {
    process.env.OPENAI_API_KEY = "test-api-key-123";
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockCreate.mockRejectedValue(new Error("API rate limit exceeded"));

    const result = await summarizeText(sampleText);

    expect(result).toBe("Summary unavailable (AI error).");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "OpenAI summarization error:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("should handle network errors and return fallback message", async () => {
    process.env.OPENAI_API_KEY = "test-api-key-123";
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockCreate.mockRejectedValue(new Error("Network error"));

    const result = await summarizeText(sampleText);

    expect(result).toBe("Summary unavailable (AI error).");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "OpenAI summarization error:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("should trim whitespace from the summary", async () => {
    process.env.OPENAI_API_KEY = "test-api-key-123";

    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: "   This summary has extra spaces.   ",
          },
        },
      ],
    });

    const result = await summarizeText(sampleText);

    expect(result).toBe("This summary has extra spaces.");
  });
});
