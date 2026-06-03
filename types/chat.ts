export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface SessionData extends Session {
  messages: ChatMessage[];
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface ChromaChunkMetadata {
  userId: string;
  source: "inventory" | "upload";
  filename: string;
  fileType: string;
  chunkIndex: number;
  totalChunks: number;
  uploadedAt: string;
  itemId: string;
}

export interface RetrievedChunk {
  content: string;
  metadata: ChromaChunkMetadata;
  score: number;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  chunksStored: number;
  message: string;
}

export interface InventoryChatRequest {
  sessionId: string;
  userId: string;
  message: string;
  useWebSearch?: boolean;
  inventorySnapshot?: {
    itemName: string;
    quantity: number;
    category: string;
    status: string;
  }[];
}
