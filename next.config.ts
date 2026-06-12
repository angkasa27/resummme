import type { NextConfig } from "next";

export default function createNextConfig(): NextConfig {
  const nextConfig: NextConfig = {
    reactCompiler: true,
    // outputFileTracingRoot: process.cwd(),
  };

  return nextConfig;
}
