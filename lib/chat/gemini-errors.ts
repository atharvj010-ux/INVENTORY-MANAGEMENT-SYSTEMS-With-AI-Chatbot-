export function isRateLimitError(err: unknown): boolean {
  const msg = errorToString(err);
  return (
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("quota")
  );
}

function errorToString(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function parseRetryDelayMs(err: unknown): number {
  const msg = errorToString(err);
  const match = msg.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
  if (match) {
    return Math.min(Math.ceil(parseFloat(match[1]) * 1000) + 500, 60_000);
  }
  return 5_000;
}

export function formatGeminiError(err: unknown): string {
  const raw = errorToString(err);
  try {
    const outer = JSON.parse(raw) as { error?: { message?: string } };
    if (outer?.error?.message) return formatGeminiError(outer.error.message);
  } catch {
    /* not JSON */
  }
  if (isRateLimitError(raw)) {
    return "Gemini API quota exceeded. Wait ~30 seconds and try again.";
  }
  return raw.length > 280 ? `${raw.slice(0, 280)}…` : raw;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
