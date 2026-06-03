/**
 * Seeds 30 sample inventory items into Firestore for a Firebase Auth user.
 *
 * Usage:
 *   node scripts/seed-30-items.mjs <email> <password>
 *
 * Example:
 *   node scripts/seed-30-items.mjs you@example.com yourpassword
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) throw new Error(".env.local not found");
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return env;
}

const CATEGORIES = [
  "Electronics",
  "Accessories",
  "Audio",
  "Storage",
  "Office",
  "Apparel",
  "Food",
  "Other",
];

const PRODUCT_NAMES = [
  "Wireless Mouse",
  "Mechanical Keyboard",
  "USB-C Hub",
  "27 Inch 4K Monitor",
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

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function statusFromQuantity(qty) {
  if (qty <= 0) return "out_of_stock";
  if (qty <= 5) return "low_stock";
  return "in_stock";
}

function generateItems(count = 30) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const quantity = Math.floor(Math.random() * 45);
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 90));
    items.push({
      itemName: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} #${i + 1}`,
      quantity,
      category: pick(CATEGORIES),
      status: statusFromQuantity(quantity),
      createdAt: d.toISOString(),
    });
  }
  return items;
}

async function signIn(apiKey, email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Sign-in failed");
  }
  return { idToken: data.idToken, uid: data.localId };
}

async function writeItem(projectId, idToken, uid, item) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}/inventory`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        itemName: { stringValue: item.itemName },
        quantity: { integerValue: String(item.quantity) },
        category: { stringValue: item.category },
        status: { stringValue: item.status },
        userId: { stringValue: uid },
        createdAt: { stringValue: item.createdAt },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firestore write failed: ${err}`);
  }
}

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.error("Usage: node scripts/seed-30-items.mjs <email> <password>");
    process.exit(1);
  }

  const env = loadEnv();
  const apiKey = env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) {
    throw new Error("Missing Firebase env vars in .env.local");
  }

  console.log(`Signing in as ${email}...`);
  const { idToken, uid } = await signIn(apiKey, email, password);
  console.log(`User ID: ${uid}`);

  const items = generateItems(30);
  console.log(`Writing ${items.length} items to users/${uid}/inventory ...`);

  for (const item of items) {
    await writeItem(projectId, idToken, uid, item);
  }

  console.log(`Done! Seeded ${items.length} items.`);
  console.log("View them at: http://localhost:3000/dashboard/inventory");
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
