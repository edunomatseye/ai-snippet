import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

dotenv.config();

const app = express();
app.use(express.json());

// Snippet model
const SnippetSchema = new mongoose.Schema({
  text: String,
  summary: String,
});
const Snippet = mongoose.model("Snippet", SnippetSchema);

// Routes
app.post("/snippets", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  const summary = await generateText({
    model: openai("gpt-3.5-turbo"),
    prompt: `Summarize the following text in less than 30 words: ${text}`,
  });

  const snippet = await Snippet.create({ text, summary: summary.text });
  res.json(snippet);
});

app.get("/snippets", async (_req, res) => {
  const snippets = await Snippet.find();
  res.json(snippets);
});

app.get("/snippets/:id", async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) return res.status(404).json({ error: "Not found" });
  res.json(snippet);
});

export default app;
