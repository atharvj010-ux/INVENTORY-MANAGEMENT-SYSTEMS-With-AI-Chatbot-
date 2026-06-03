import mammoth from "mammoth";

export const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".txt"] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function getFileType(filename: string): "pdf" | "docx" | "txt" | null {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  if (ext === ".pdf") return "pdf";
  if (ext === ".docx") return "docx";
  if (ext === ".txt") return "txt";
  return null;
}

export function validateFile(
  filename: string,
  size: number
): { valid: boolean; error?: string } {
  const fileType = getFileType(filename);
  if (!fileType) {
    return {
      valid: false,
      error: `Unsupported file type. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`,
    };
  }
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: "File exceeds 10 MB limit." };
  }
  return { valid: true };
}

async function parsePdf(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function parseTxt(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

export async function parseDocument(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const fileType = getFileType(filename);
  if (!fileType) {
    throw new Error(`Unsupported file type: ${filename}`);
  }

  let text: string;
  switch (fileType) {
    case "pdf":
      text = await parsePdf(buffer);
      break;
    case "docx":
      text = await parseDocx(buffer);
      break;
    case "txt":
      text = parseTxt(buffer);
      break;
  }

  if (!text.trim()) {
    throw new Error("Document appears to be empty or unreadable.");
  }

  return text;
}
