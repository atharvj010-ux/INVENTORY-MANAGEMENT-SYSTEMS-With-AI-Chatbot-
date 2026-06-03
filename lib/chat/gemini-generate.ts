import {
  getGeminiClient,
  getChatModelFallbacks,
  GEMINI_MAX_OUTPUT_TOKENS,
  GEMINI_MIN_OUTPUT_TOKENS,
} from "@/lib/chat/gemini";
import {
  formatGeminiError,
  isRateLimitError,
  parseRetryDelayMs,
  sleep,
} from "@/lib/chat/gemini-errors";

export type GenerateOptions = { useWebSearch?: boolean };

function buildGenerateConfig(options: GenerateOptions = {}) {
  const config: Record<string, unknown> = {
    maxOutputTokens: Math.max(GEMINI_MAX_OUTPUT_TOKENS, GEMINI_MIN_OUTPUT_TOKENS),
    thinkingConfig: { thinkingBudget: 0 },
  };
  if (options.useWebSearch) {
    config.tools = [{ googleSearch: {} }];
  }
  return config;
}

export async function generateContentStreamWithFallback(
  prompt: string,
  options: GenerateOptions = {}
) {
  const client = getGeminiClient();
  const models = getChatModelFallbacks();
  let lastError: unknown;

  for (let i = 0; i < models.length; i++) {
    try {
      const stream = await client.models.generateContentStream({
        model: models[i],
        contents: prompt,
        config: buildGenerateConfig(options),
      });
      return { stream, model: models[i] };
    } catch (err) {
      lastError = err;
      if (isRateLimitError(err) && i < models.length - 1) {
        await sleep(parseRetryDelayMs(err));
        continue;
      }
      throw new Error(formatGeminiError(err));
    }
  }
  throw new Error(formatGeminiError(lastError));
}
