import fs from "fs";
import path from "path";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";


type InventoryEntry = {
  itemName: string;
  quantity: number;
  category: string;
  status: string;
  createdAt: string;
  userId: string;
};

function getJsonPath() {
  // JSON file lives outside the Next.js app:
  // C:/Users/athar/OneDrive/Desktop/INVENTORY MANAGEMENT/firestore_inventory_100_entries.json
  // This script is executed from within the Next.js app directory.
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

async function main() {
  const jsonPath = getJsonPath();
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found at: ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, "utf8");
  const entries: InventoryEntry[] = JSON.parse(raw);

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error(`No entries found in JSON: ${jsonPath}`);
  }

  // Import into root collection: items
  // Use a deterministic doc id based on index + itemName + createdAt
  const writes = entries.map(async (entry, idx) => {
    const docId = `${idx}-${entry.itemName}-${entry.createdAt}`;
    const ref = doc(db, "items", docId);

    await setDoc(ref, {
      ...entry,
      // Ensure types are clean
      quantity: Number(entry.quantity),
      createdAt: entry.createdAt,
    });
  });

  await Promise.all(writes);

  console.log(`✅ Imported ${entries.length} entries into Firestore collection: items`);
}

main().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});

