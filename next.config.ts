import type { NextConfig } from "next";

export default function createNextConfig(): NextConfig {
  const nextConfig: NextConfig = {
    reactCompiler: true,
    // outputFileTracingRoot: process.cwd(),
    images: {
      qualities: [80, 100],
    },
  };

  return nextConfig;
}
