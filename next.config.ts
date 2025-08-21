import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features available in Next.js 15 stable
  experimental: {
    // Enable server actions (stable in Next.js 15)
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3002"],
    },
  },

  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Enable strict mode
  reactStrictMode: true,

  // PoweredBy header removal for security
  poweredByHeader: false,

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options", 
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },


};

export default nextConfig;
