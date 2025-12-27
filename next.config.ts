import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تحسين الأداء
  images: {
    formats: ["image/avif", "image/webp"], // استخدام صيغ حديثة للصور
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // تحسين bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // إزالة console.log في الإنتاج
  },
};

export default nextConfig;
