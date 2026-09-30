import type { NextConfig } from "next";

// Private pages: never indexed (guest invitations, editor, account, auth, checkout, API).
// Sent as a header in addition to the robots meta tag so it also covers redirects and non-HTML responses.
const NOINDEX_PATHS = [
  "/invitatie/:path*",
  "/create",
  "/dashboard",
  "/admin",
  "/login",
  "/resetare-parola",
  "/checkout/:path*",
  "/templates/:path*",
  "/api/:path*",
];

const nextConfig: NextConfig = {
  // serverul autonom pentru imaginea Docker (vezi Dockerfile)
  output: "standalone",
  async redirects() {
    return [
      // host canonic: https://invitonline.ro (fără www); calea și query-ul se păstrează
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.invitonline.ro" }],
        destination: "https://invitonline.ro/:path*",
        permanent: true,
      },
      // adrese scurte pentru paginile legale
      { source: "/termeni", destination: "/termeni-si-conditii", permanent: true },
      { source: "/confidentialitate", destination: "/politica-de-confidentialitate", permanent: true },
      { source: "/cookies", destination: "/politica-cookies", permanent: true },
    ];
  },
  async headers() {
    return NOINDEX_PATHS.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
};

export default nextConfig;
