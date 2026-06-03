export type InventoryStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface InventoryItem {
  id: string;
  userId: string;
  itemName: string;
  quantity: number;
  category: string;
  status: InventoryStatus | string;
  createdAt: string;
}

export type InventoryItemInput = Omit<InventoryItem, "id" | "userId" | "createdAt">;
