import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تحسين الأداء
  images: {
    formats: ["image/avif", "image/webp"], // استخدام صيغ حديثة للصور
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // تحسين caching للصور
  },
  // تحسين bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // إزالة console.log في الإنتاج
  },
  // ضغط الملفات
  compress: true,
  // تحسين React
  reactStrictMode: true,
  // تحسين Headers للأداء
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
