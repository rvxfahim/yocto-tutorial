import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/yocto-tutorial",
  images: { unoptimized: true },
};

export default nextConfig;
