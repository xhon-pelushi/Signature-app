import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    authInterrupts: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "dev-secret-please-change",
  },
};

export default nextConfig;
