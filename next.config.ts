import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // This tells the compiler to look for active light/dark classes
    darkMode: 'class',
  }
};

export default nextConfig;
