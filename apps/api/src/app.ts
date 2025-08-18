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

export default app;
