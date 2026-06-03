import type { WebSearchResult } from "@/types/chat";

export function isWebSearchEnabled(): boolean {
  return process.env.WEB_SEARCH_ENABLED !== "false";
}

export function shouldUseWebSearch(
  message: string,
  userPreference?: boolean,
  retrievedChunkCount = 0
): boolean {
  if (!isWebSearchEnabled()) return false;
  if (userPreference === false) return false;
  if (retrievedChunkCount >= 2 && userPreference !== true) {
    const lower = message.toLowerCase();
    const needsLive =
      /\b(today|now|current|latest|price|market|trend|news|weather)\b/.test(
        lower
      );
    if (!needsLive) return false;
  }
  return true;
}

export async function searchWebFallback(
  query: string,
  maxResults = 4
): Promise<WebSearchResult[]> {
  try {
    const { search, SafeSearchType } = await import("duck-duck-scrape");
    const results = await search(query, { safeSearch: SafeSearchType.MODERATE });
    return (results.results ?? []).slice(0, maxResults).map((r) => ({
      title: r.title ?? "Untitled",
      url: r.url ?? "",
      snippet: r.description ?? "",
    }));
  } catch {
    return [];
  }
}

export function formatWebResultsForPrompt(results: WebSearchResult[]): string {
  if (!results.length) return "";
  return results
    .map((r, i) => `[Web ${i + 1}] ${r.title}\n${r.url}\n${r.snippet}`)
    .join("\n\n");
}
