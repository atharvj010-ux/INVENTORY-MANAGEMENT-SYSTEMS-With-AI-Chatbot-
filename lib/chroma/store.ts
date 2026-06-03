import { v4 as uuidv4 } from "uuid";
import { getCollection, isChromaConfigured } from "./client";
import { generateEmbeddings, generateQueryEmbedding } from "./embeddings";
import type { ChromaChunkMetadata, RetrievedChunk } from "@/types/chat";

const DEFAULT_TOP_K = 5;

type ChromaMetaRecord = Record<string, string | number | boolean>;

function toChromaMeta(meta: ChromaChunkMetadata): ChromaMetaRecord {
  return { ...meta };
}

export async function storeDocumentChunks(
  userId: string,
  filename: string,
  fileType: "pdf" | "docx" | "txt",
  chunks: string[]
): Promise<number> {
  if (!isChromaConfigured() || chunks.length === 0) return 0;

  const collection = await getCollection();
  const embeddings = await generateEmbeddings(chunks);
  const uploadedAt = new Date().toISOString();

  const ids = chunks.map(() => uuidv4());
  const metadatas: ChromaMetaRecord[] = chunks.map((_, i) =>
    toChromaMeta({
      userId,
      source: "upload",
      filename,
      fileType,
      chunkIndex: i,
      totalChunks: chunks.length,
      uploadedAt,
      itemId: "",
    })
  );

  await collection.add({
    ids,
    embeddings,
    documents: chunks,
    metadatas,
  });

  return chunks.length;
}

export async function upsertInventoryChunks(
  userId: string,
  entries: { id: string; text: string }[]
): Promise<void> {
  if (!isChromaConfigured() || entries.length === 0) return;

  const collection = await getCollection();

  await collection.delete({
    where: { userId, source: "inventory" },
  });

  const texts = entries.map((e) => e.text);
  const embeddings = await generateEmbeddings(texts);
  const uploadedAt = new Date().toISOString();
  const total = entries.length;

  const ids = entries.map((e) => `inv-${userId}-${e.id}`);
  const metadatas: ChromaMetaRecord[] = entries.map((e, i) =>
    toChromaMeta({
      userId,
      source: "inventory",
      filename: e.id,
      fileType: "inventory",
      chunkIndex: i,
      totalChunks: total,
      uploadedAt,
      itemId: e.id,
    })
  );

  await collection.upsert({
    ids,
    embeddings,
    documents: texts,
    metadatas,
  });
}

export async function searchSimilarChunks(
  query: string,
  userId: string,
  topK: number = DEFAULT_TOP_K
): Promise<RetrievedChunk[]> {
  if (!isChromaConfigured()) return [];

  const collection = await getCollection();
  const queryEmbedding = await generateQueryEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    where: { userId },
    include: ["documents", "metadatas", "distances"],
  });

  const chunks: RetrievedChunk[] = [];

  if (results.documents?.[0]) {
    for (let i = 0; i < results.documents[0].length; i++) {
      const content = results.documents[0][i];
      const raw = results.metadatas?.[0]?.[i] as ChromaMetaRecord | undefined;
      const distance = results.distances?.[0]?.[i] ?? 1;

      if (content && raw) {
        chunks.push({
          content,
          metadata: {
            userId: String(raw.userId ?? userId),
            source: (raw.source as ChromaChunkMetadata["source"]) ?? "upload",
            filename: String(raw.filename ?? "unknown"),
            fileType: String(raw.fileType ?? "txt"),
            chunkIndex: Number(raw.chunkIndex ?? 0),
            totalChunks: Number(raw.totalChunks ?? 1),
            uploadedAt: String(raw.uploadedAt ?? ""),
            itemId: String(raw.itemId ?? ""),
          },
          score: 1 - distance,
        });
      }
    }
  }

  return chunks;
}

export async function getUserDocuments(userId: string): Promise<string[]> {
  if (!isChromaConfigured()) return [];

  const collection = await getCollection();
  const results = await collection.get({
    where: { userId, source: "upload" },
    include: ["metadatas"],
  });

  const filenames = new Set<string>();
  results.metadatas?.forEach((meta) => {
    const filename = (meta as ChromaMetaRecord).filename;
    if (filename) filenames.add(String(filename));
  });

  return Array.from(filenames);
}
