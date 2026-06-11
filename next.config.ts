import type { NextConfig } from "next";

export default function createNextConfig(): NextConfig {
  const nextConfig: NextConfig = {
    reactCompiler: true,
    // outputFileTracingRoot: process.cwd(),
    images: {
      // Serve AVIF (smallest) where supported, falling back to WebP.
      formats: ["image/avif", "image/webp"],
    },
  };

  return nextConfig;
}
