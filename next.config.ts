import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "chromadb", "mammoth"],
};

export default nextConfig;
