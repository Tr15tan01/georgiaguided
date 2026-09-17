import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** Host of NEXT_PUBLIC_SITE_URL, e.g. "georgiaguided.com". */
const siteHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["mongoose", "sanitize-html"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
      // Server actions are rejected when the request Origin doesn't match the forwarded
      // host (a 500 on every action). Behind proxies, custom domains and preview URLs,
      // list the domains that are allowed to submit them.
      allowedOrigins: [
        ...new Set(
          [
            siteHost,
            process.env.VERCEL_URL,
            process.env.VERCEL_BRANCH_URL,
            process.env.VERCEL_PROJECT_PRODUCTION_URL,
            "localhost:3000",
          ].filter((v): v is string => Boolean(v)),
        ),
      ],
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async redirects() {
    return [
      { source: "/journal", destination: "/blog", permanent: true },
      { source: "/journal/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/custom-trip", destination: "/plan-your-trip", permanent: true },
    ];
  },
};

export default nextConfig;
