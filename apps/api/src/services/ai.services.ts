import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeText(text: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // lightweight + fast
      messages: [
        { role: "system", content: "You are a concise summarizer." },
        {
          role: "user",
          content: `Summarize this text in about 30 words:\n\n${text}`,
        },
      ],
      max_tokens: 100,
    });

    return (
      response.choices[0].message?.content?.trim() ?? "No summary generated."
    );
  } catch (err) {
    console.error("OpenAI summarization error:", err);
    return "Summary unavailable (AI error).";
  }
}
