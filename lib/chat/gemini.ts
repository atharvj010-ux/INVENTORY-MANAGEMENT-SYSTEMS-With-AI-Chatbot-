import { GoogleGenAI } from "@google/genai";

let genaiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!genaiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in .env.local");
    }
    genaiClient = new GoogleGenAI({ apiKey });
  }
  return genaiClient;
}

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export function getChatModelFallbacks(): string[] {
  const fromEnv = process.env.GEMINI_FALLBACK_MODELS?.split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const defaults = ["gemini-2.5-flash-lite", "gemini-flash-latest"];
  return [...new Set([GEMINI_MODEL, ...(fromEnv ?? defaults)])];
}

export const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001";

export const GEMINI_MAX_OUTPUT_TOKENS = Number(
  process.env.GEMINI_MAX_OUTPUT_TOKENS ?? "2048"
);
export const GEMINI_MIN_OUTPUT_TOKENS = 256;
