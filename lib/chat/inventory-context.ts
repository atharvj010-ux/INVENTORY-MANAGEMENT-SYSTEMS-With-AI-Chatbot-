import type { InventoryItem } from "@/types/inventory";

export type InventorySnapshot = {
  id?: string;
  itemName: string;
  quantity: number;
  category: string;
  status: string;
};

export function toSnapshot(items: InventoryItem[]): InventorySnapshot[] {
  return items.map((i) => ({
    id: i.id,
    itemName: i.itemName,
    quantity: i.quantity,
    category: i.category,
    status: String(i.status),
  }));
}

/** Summarize inventory for the LLM (cap at 80 items) */
export function formatInventoryForPrompt(
  items: InventorySnapshot[]
): string {
  if (!items.length) {
    return "The user has no inventory items yet.";
  }

  const slice = items.slice(0, 80);
  const inStock = slice.filter((i) => i.status === "in_stock").length;
  const low = slice.filter((i) => i.status === "low_stock").length;
  const out = slice.filter((i) => i.status === "out_of_stock").length;

  const table = slice
    .map(
      (i) =>
        `- ${i.itemName} | qty: ${i.quantity} | ${i.category} | ${i.status}`
    )
    .join("\n");

  const more =
    items.length > 80 ? `\n(…and ${items.length - 80} more items)` : "";

  return `Summary: ${items.length} items — in_stock: ${inStock}, low_stock: ${low}, out_of_stock: ${out}

Items:
${table}${more}`;
}
