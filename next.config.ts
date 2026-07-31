import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
<<<<<<< HEAD
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
=======
  turbopack: {
    root: process.cwd(),
>>>>>>> origin/Sandakue
  },
};

export default nextConfig;
