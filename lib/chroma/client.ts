import { CloudClient, Collection } from "chromadb";

export const COLLECTION_NAME =
  process.env.CHROMA_COLLECTION_NAME ?? "inventory_assistant_v1";

let chromaClient: CloudClient | null = null;
let collection: Collection | null = null;

export function isChromaConfigured(): boolean {
  return Boolean(
    process.env.CHROMA_API_KEY &&
      process.env.CHROMA_TENANT &&
      process.env.CHROMA_DATABASE
  );
}

export function getChromaClient(): CloudClient {
  if (!chromaClient) {
    const apiKey = process.env.CHROMA_API_KEY;
    const tenant = process.env.CHROMA_TENANT;
    const database = process.env.CHROMA_DATABASE;

    if (!apiKey || !tenant || !database) {
      throw new Error(
        "ChromaDB Cloud credentials missing. Set CHROMA_API_KEY, CHROMA_TENANT, and CHROMA_DATABASE in .env.local."
      );
    }

    chromaClient = new CloudClient({ apiKey, tenant, database });
  }
  return chromaClient;
}

export async function getCollection(): Promise<Collection> {
  if (!collection) {
    const client = getChromaClient();
    collection = await client.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { "hnsw:space": "cosine" },
      embeddingFunction: null,
    });
  }
  return collection;
}
