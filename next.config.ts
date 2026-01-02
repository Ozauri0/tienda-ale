import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '*.imgur.com',
      },
    ],
  },
  experimental: {
    // Configuración mínima de prefetch para evitar errores con unstable_prefetch
    staleTimes: {
      dynamic: 30,
      static: 30,
    },
  },
};

export default nextConfig;
