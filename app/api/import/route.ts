import { NextResponse } from "next/server";

import { db } from "../../../firebase/config";
import { collection, doc, setDoc } from "firebase/firestore";

import fs from "fs";
import path from "path";

type InventoryEntry = {
  itemName: string;
  quantity: number;
  category: string;
  status: string;
  createdAt: string;
  userId: string;
};

function getJsonPath() {
  // Runs inside ../Downloads/inventory-management-app/inventory-management-app
  // JSON file lives at:
  // C:/Users/athar/OneDrive/Desktop/INVENTORY MANAGEMENT/firestore_inventory_100_entries.json
  return path.resolve(
    process.cwd(),
    "..",
    "..",
    "OneDrive",
    "Desktop",
    "INVENTORY MANAGEMENT",
    "firestore_inventory_100_entries.json"
  );
}

export async function POST() {
  // Optional simple guard: require an explicit query flag.
  // Call once: POST /api/import?key=YOUR_KEY
  const url = new URL("http://localhost");
  // Next.js provides URL via request in route handlers; but since we
  // don't have request here in this simplified signature, skip strict key.

  const jsonPath = getJsonPath();
  if (!fs.existsSync(jsonPath)) {
    return NextResponse.json(
      {
        ok: false,
        error: `JSON file not found at: ${jsonPath}`,
        suggestion: "Put firestore_inventory_100_entries.json at the expected path, or update getJsonPath() in this file.",
      },
      { status: 400 }
    );
  }


  const raw = fs.readFileSync(jsonPath, "utf8");
  const entries: InventoryEntry[] = JSON.parse(raw);

  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json(
      { ok: false, error: `No entries found in JSON: ${jsonPath}` },
      { status: 400 }
    );
  }

  const itemsCol = collection(db, "items");

  // Deterministic doc id to avoid duplicates if run again.
  const writes = entries.map(async (entry, idx) => {
    const docId = `${idx}-${entry.itemName}-${entry.createdAt}`;
    const ref = doc(itemsCol, docId);

    await setDoc(ref, {
      ...entry,
      quantity: Number(entry.quantity),
      createdAt: entry.createdAt,
    });
  });

  await Promise.all(writes);

  return NextResponse.json({
    ok: true,
    imported: entries.length,
    collection: "items",
  });
}

