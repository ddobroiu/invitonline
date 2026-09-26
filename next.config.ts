import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverul autonom pentru imaginea Docker (vezi Dockerfile)
  output: "standalone",
  // adrese scurte pentru paginile legale
  async redirects() {
    return [
      { source: "/termeni", destination: "/termeni-si-conditii", permanent: true },
      { source: "/confidentialitate", destination: "/politica-de-confidentialitate", permanent: true },
      { source: "/cookies", destination: "/politica-cookies", permanent: true },
    ];
  },
};

export default nextConfig;
