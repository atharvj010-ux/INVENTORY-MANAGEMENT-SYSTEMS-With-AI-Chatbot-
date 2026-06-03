import { CATEGORIES } from "@/lib/constants";
import type { InventoryItemInput } from "@/types/inventory";
import { statusFromQuantity } from "@/utils/status";

const PRODUCT_CATEGORY_MAP: Record<string, (typeof CATEGORIES)[number]> = {
  "Wireless Mouse": "Electronics",
  "Mechanical Keyboard": "Electronics",
  "USB-C Hub": "Electronics",
  '27" 4K Monitor': "Electronics",
  "Bluetooth Speaker": "Audio",
  "Noise-Cancelling Headphones": "Audio",
  "Webcam HD": "Electronics",
  "Docking Station": "Electronics",
  "SSD 1TB": "Storage",
  "RAM 16GB Kit": "Electronics",
  "Gaming Chair": "Office",
  "Standing Desk": "Office",
  "Label Printer": "Office",
  "Barcode Scanner": "Electronics",
  "Thermal Paper Rolls": "Office",
  "Office Stapler Pack": "Office",
  "Whiteboard Markers": "Office",
  "Ethernet Cable 5m": "Electronics",
  "Router WiFi 6": "Electronics",
  "Smart Bulb Pack": "Electronics",
  "Coffee Beans 2kg": "Food",
  "Water Bottles Case": "Food",
  "Notebook A4": "Office",
  "Pen Set Premium": "Office",
  "Hoodie XL": "Apparel",
  "Running Shoes": "Apparel",
  "Yoga Mat": "Apparel",
  "Resistance Bands": "Apparel",
  "First Aid Kit": "Other",
  "Hand Sanitizer": "Other",
};

const PRODUCT_NAMES = [
  "Wireless Mouse",
  "Mechanical Keyboard",
  "USB-C Hub",
  "27\" 4K Monitor",
  "Bluetooth Speaker",
  "Noise-Cancelling Headphones",
  "Webcam HD",
  "Docking Station",
  "SSD 1TB",
  "RAM 16GB Kit",
  "Gaming Chair",
  "Standing Desk",
  "Label Printer",
  "Barcode Scanner",
  "Thermal Paper Rolls",
  "Office Stapler Pack",
  "Whiteboard Markers",
  "Ethernet Cable 5m",
  "Router WiFi 6",
  "Smart Bulb Pack",
  "Coffee Beans 2kg",
  "Water Bottles Case",
  "Notebook A4",
  "Pen Set Premium",
  "Hoodie XL",
  "Running Shoes",
  "Yoga Mat",
  "Resistance Bands",
  "First Aid Kit",
  "Hand Sanitizer",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function categoryForProduct(name: string): (typeof CATEGORIES)[number] {
  const base = name.replace(/\s+\d+$/, "").trim();
  return PRODUCT_CATEGORY_MAP[base] ?? "Other";
}

function randomDate(daysBack = 90): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
}

export function generateSampleItems(count = 30): InventoryItemInput[] {
  const used = new Set<string>();
  const items: InventoryItemInput[] = [];

  while (items.length < count) {
    const base = pick(PRODUCT_NAMES);
    const suffix = items.length > PRODUCT_NAMES.length ? ` ${items.length}` : "";
    const itemName = `${base}${suffix}`.trim();
    if (used.has(itemName)) continue;
    used.add(itemName);

    const quantity = Math.floor(Math.random() * 45);
    const status = statusFromQuantity(quantity);

    items.push({
      itemName,
      quantity,
      category: categoryForProduct(itemName),
      status,
    });
  }

  return items;
}

export type SampleItemPayload = InventoryItemInput & { createdAt: string };

export function generateSampleItemsWithDates(count = 30): SampleItemPayload[] {
  return generateSampleItems(count).map((item) => ({
    ...item,
    createdAt: randomDate(),
  }));
}
