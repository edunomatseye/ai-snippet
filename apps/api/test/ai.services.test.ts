import { describe, it, expect, vi, beforeEach } from "vitest";
import { summarizeText } from "../src/services/ai.services";
import OpenAI from "openai";

// Mock the OpenAI client
vi.mock("openai", () => {
  const mockChat = {
    completions: {
      create: vi.fn(),
    },
  };
  return { default: vi.fn(() => ({ chat: mockChat })) };
});

describe("summarizeText", () => {
  const originalOpenAIApiKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = originalOpenAIApiKey; // Restore original API key
  });

  it("should summarize text successfully when API key is set", async () => {
    process.env.OPENAI_API_KEY = "test-api-key";

    // Mock a successful OpenAI response
    (
      OpenAI as any
    ).mock.results[0].value.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: { content: "This is a concise summary." },
        },
      ],
    });

    const text = "This is a long text that needs to be summarized.";
    const summary = await summarizeText(text);

    expect(summary).toBe("This is a concise summary.");
    expect(new OpenAI().chat.completions.create).toHaveBeenCalledTimes(1);
    expect(new OpenAI().chat.completions.create).toHaveBeenCalledWith({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a concise summarizer." },
        {
          role: "user",
          content: `Summarize this text in about 30 words:\n\n${text}`,
        },
      ],
      max_tokens: 100,
    });
  });

  it("should throw an error if OPENAI_API_KEY is not set", async () => {
    delete process.env.OPENAI_API_KEY;

    const text = "Some text.";
    await expect(summarizeText(text)).rejects.toThrow(
      "OPENAI_API_KEY is not set"
    );
    expect(new OpenAI().chat.completions.create).not.toHaveBeenCalled();
  });

  it("should return 'No summary generated.' if content is null or undefined", async () => {
    process.env.OPENAI_API_KEY = "test-api-key";

    // Mock OpenAI response with null content
    (
      OpenAI as any
    ).mock.results[0].value.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: { content: null },
        },
      ],
    });

    const text = "Test text for null summary.";
    const summary = await summarizeText(text);
    expect(summary).toBe("No summary generated.");
  });

  it("should return 'Summary unavailable (AI error).' on API error", async () => {
    process.env.OPENAI_API_KEY = "test-api-key";

    // Mock OpenAI API to throw an error
    (
      OpenAI as any
    ).mock.results[0].value.chat.completions.create.mockRejectedValueOnce(
      new Error("API Error")
    );

    const text = "Text for API error.";
    const summary = await summarizeText(text);
    expect(summary).toBe("Summary unavailable (AI error).");
    expect(console.error).toHaveBeenCalled();
  });
});
