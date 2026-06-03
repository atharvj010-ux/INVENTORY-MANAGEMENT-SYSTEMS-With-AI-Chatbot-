import { isChromaConfigured } from "@/lib/chroma/client";
import { upsertInventoryChunks } from "@/lib/chroma/store";
import type { InventorySnapshot } from "@/lib/chat/inventory-context";

function inventoryEntryText(item: InventorySnapshot): string {
  return [
    `Item: ${item.itemName}`,
    `Quantity: ${item.quantity}`,
    `Category: ${item.category}`,
    `Status: ${item.status}`,
  ].join("\n");
}

/** Index live Firestore inventory into Chroma for RAG retrieval (per user). */
export async function syncInventoryToChroma(
  userId: string,
  items: InventorySnapshot[]
): Promise<void> {
  if (!isChromaConfigured() || !items.length) return;

  const entries = items
    .filter((i) => i.id)
    .map((i) => ({
      id: i.id!,
      text: inventoryEntryText(i),
    }));

  if (!entries.length) return;

  await upsertInventoryChunks(userId, entries);
}
