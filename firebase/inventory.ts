"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./client";
import type { InventoryItem, InventoryItemInput } from "@/types/inventory";

function inventoryCol(userId: string) {
  return collection(db, "users", userId, "inventory");
}

export function subscribeInventory(
  userId: string,
  callback: (items: InventoryItem[]) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const q = query(inventoryCol(userId));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data() as Omit<InventoryItem, "id">;
        return {
          id: d.id,
          ...data,
          quantity: Number(data.quantity) || 0,
        };
      });
      callback(items);
    },
    (err) => {
      onError?.(err.message || "Failed to load inventory");
      callback([]);
    }
  );
}

export async function addInventoryItem(
  userId: string,
  data: InventoryItemInput
): Promise<string> {
  const ref = await addDoc(inventoryCol(userId), {
    ...data,
    userId,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateInventoryItem(
  userId: string,
  id: string,
  data: Partial<InventoryItemInput>
): Promise<void> {
  await updateDoc(doc(db, "users", userId, "inventory", id), data);
}

export async function deleteInventoryItem(
  userId: string,
  id: string
): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "inventory", id));
}

export async function seedSampleInventory(
  userId: string,
  items: Array<InventoryItemInput & { createdAt?: string }>
): Promise<number> {
  let count = 0;
  for (const item of items) {
    await addDoc(inventoryCol(userId), {
      itemName: item.itemName,
      quantity: item.quantity,
      category: item.category,
      status: item.status,
      userId,
      createdAt: item.createdAt || new Date().toISOString(),
    });
    count++;
  }
  return count;
}
