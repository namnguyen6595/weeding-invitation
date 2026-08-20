import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev",
        pathname: "/anh-cuoi/**",
      },
    ],
  },
};

export default nextConfig;
