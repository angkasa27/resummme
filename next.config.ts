import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const devWatchIgnoredPaths = ["**/.playwright-cli/**", "**/.superpowers/**"];

export default function createNextConfig(phase: string): NextConfig {
  const nextConfig: NextConfig = {
    reactCompiler: true,
    outputFileTracingRoot: process.cwd(),
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    nextConfig.webpack = (config, { dev }) => {
      if (!dev) {
        return config;
      }

      config.watchOptions = {
        ...config.watchOptions,
        ignored: devWatchIgnoredPaths,
      };

      return config;
    };
  }

  return nextConfig;
}
