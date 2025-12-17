import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Configuración mínima de prefetch para evitar errores con unstable_prefetch
    staleTimes: {
      dynamic: 30,
      static: 30,
    },
  },
};

export default nextConfig;
