import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build the site as plain static files (in /out) so it can be hosted anywhere, e.g. Cloudflare Pages.
  output: "export",
};

export default nextConfig;
