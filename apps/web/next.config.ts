import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const workspaceRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const securityHeaders: Array<{ key: string; value: string }> = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

if (process.env.NODE_ENV === "production") {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  output: "standalone",
  outputFileTracingRoot: workspaceRoot,
  transpilePackages: ["@neatly/config", "@neatly/ui", "@neatly/utils"],
  async headers(): Promise<
    Array<{
      source: string;
      headers: Array<{ key: string; value: string }>;
    }>
  > {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
