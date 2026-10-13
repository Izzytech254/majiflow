import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com", "10.162.122.91"],
  // Pin the Turbopack root so it does not scan parent directories, which
  // makes the first dev compile much faster.
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Speeds up compiling the large icon barrel imports.
    optimizePackageImports: ["lucide-react"],
  },
  compress: true,
};

export default nextConfig;
