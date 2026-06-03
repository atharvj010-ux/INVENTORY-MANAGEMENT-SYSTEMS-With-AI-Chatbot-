import {
  getConversationHistory,
  addMessage,
} from "@/lib/chat/session-manager";
import {
  shouldUseWebSearch,
  searchWebFallback,
} from "@/lib/chat/web-search";
import { buildInventoryChatPrompt } from "@/lib/chat/prompt";
import { syncInventoryToChroma } from "@/lib/chat/sync-inventory-chroma";
import { searchSimilarChunks } from "@/lib/chroma/store";
import type { InventorySnapshot } from "@/lib/chat/inventory-context";
import type { RetrievedChunk } from "@/types/chat";

export async function prepareInventoryChat(
  userId: string,
  sessionId: string,
  userMessage: string,
  inventory: InventorySnapshot[],
  userWebPreference = true
) {
  const history = await getConversationHistory(userId, sessionId, 10);

  let retrievedChunks: RetrievedChunk[] = [];
  try {
    await syncInventoryToChroma(userId, inventory);
    retrievedChunks = await searchSimilarChunks(userMessage, userId, 5);
  } catch (err) {
    console.warn("[prepareInventoryChat] Chroma RAG skipped:", err);
  }

  const useWebSearch = shouldUseWebSearch(
    userMessage,
    userWebPreference,
    retrievedChunks.length
  );
  const webResults = useWebSearch
    ? await searchWebFallback(userMessage, 4)
    : [];

  const prompt = buildInventoryChatPrompt(userMessage, inventory, history, {
    useWebSearch,
    webResults,
    retrievedChunks,
  });

  return { prompt, useWebSearch, retrievedChunks };
}

export async function saveChatMessages(
  userId: string,
  sessionId: string,
  userMessage: string,
  assistantResponse: string
) {
  await addMessage(userId, sessionId, "user", userMessage);
  await addMessage(userId, sessionId, "assistant", assistantResponse);
}
