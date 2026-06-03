import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { EMBEDDING_MODEL } from "@/lib/chat/gemini";

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return apiKey;
}

let documentEmbeddings: GoogleGenerativeAIEmbeddings | null = null;
let queryEmbeddings: GoogleGenerativeAIEmbeddings | null = null;

function getDocumentEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (!documentEmbeddings) {
    documentEmbeddings = new GoogleGenerativeAIEmbeddings({
      model: EMBEDDING_MODEL,
      apiKey: getApiKey(),
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
  }
  return documentEmbeddings;
}

function getQueryEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (!queryEmbeddings) {
    queryEmbeddings = new GoogleGenerativeAIEmbeddings({
      model: EMBEDDING_MODEL,
      apiKey: getApiKey(),
      taskType: TaskType.RETRIEVAL_QUERY,
    });
  }
  return queryEmbeddings;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return getDocumentEmbeddings().embedDocuments(texts);
}

export async function generateQueryEmbedding(query: string): Promise<number[]> {
  return getQueryEmbeddings().embedQuery(query);
}
