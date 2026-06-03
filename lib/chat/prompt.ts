import type {
  ChatMessage,
  RetrievedChunk,
  WebSearchResult,
} from "@/types/chat";
import { formatWebResultsForPrompt } from "@/lib/chat/web-search";
import {
  formatInventoryForPrompt,
  type InventorySnapshot,
} from "@/lib/chat/inventory-context";

const MAX_CHUNK_CHARS = 800;
const MAX_RETRIEVED_CHUNKS = 3;

function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max) + "…";
}

function formatRagChunks(chunks: RetrievedChunk[]): string {
  const top = chunks.slice(0, MAX_RETRIEVED_CHUNKS);
  if (!top.length) {
    return "No additional knowledge-base matches (upload docs or sync inventory to Chroma).";
  }

  return top
    .map((c, i) => {
      const label =
        c.metadata.source === "inventory"
          ? `Inventory item ${c.metadata.itemId || i + 1}`
          : `Uploaded doc: ${c.metadata.filename}`;
      return `[${i + 1}: ${label}]\n${truncate(c.content, MAX_CHUNK_CHARS)}`;
    })
    .join("\n\n---\n\n");
}

export function buildInventoryChatPrompt(
  userMessage: string,
  inventory: InventorySnapshot[],
  history: ChatMessage[],
  options: {
    useWebSearch?: boolean;
    webResults?: WebSearchResult[];
    retrievedChunks?: RetrievedChunk[];
  } = {}
): string {
  const {
    useWebSearch = false,
    webResults = [],
    retrievedChunks = [],
  } = options;

  const inventoryBlock = formatInventoryForPrompt(inventory);
  const ragBlock = formatRagChunks(retrievedChunks);

  const historyBlock = history
    .slice(-10)
    .map(
      (m) =>
        `${m.role === "user" ? "User" : "Assistant"}: ${truncate(m.content, 350)}`
    )
    .join("\n");

  const webBlock =
    useWebSearch && webResults.length > 0
      ? `## Web search snippets\n${formatWebResultsForPrompt(webResults)}\n\n`
      : "";

  const webNote = useWebSearch
    ? "You may use Google Search for live market prices, supplier info, industry trends, and general knowledge.\n"
    : "";

  return `You are Nexus AI, an expert inventory management assistant embedded in the user's inventory dashboard.
${webNote}
Answer questions about THEIR inventory data below. Give actionable advice: reorder quantities, low-stock alerts, category insights, and operational tips.
Use the knowledge-base excerpts (uploaded supplier docs + indexed inventory) when they add detail beyond the live snapshot.

## User's current inventory (live snapshot)
${inventoryBlock}

## Knowledge base (Chroma RAG — uploaded docs + indexed items)
${ragBlock}

${webBlock}## Conversation history
${historyBlock || "None"}

## Current question
User: ${userMessage}

Respond clearly in markdown. Reference specific item names when relevant.`;
}
