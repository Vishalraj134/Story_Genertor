import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

import process from "process";
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBoNi4cnjN6Gf8JhOmPpegd2a_25xQckiE";
const genAI = new GoogleGenerativeAI(apiKey);

app.use(cors());
app.use(express.json());

app.post("/generate-story", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const formattedPrompt = `Generate a creative and engaging story based on this idea: "${prompt}". The story should have a clear beginning, middle, and end.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(formattedPrompt);
    const story = result.response.text();
    res.json({ story });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate story." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

