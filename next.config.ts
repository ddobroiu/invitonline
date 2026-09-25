import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverul autonom pentru imaginea Docker (vezi Dockerfile)
  output: "standalone",
};

export default nextConfig;
