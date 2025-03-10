import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["i.imgflip.com"], // Add external image domain here
  },
};
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};


module.exports = nextConfig;
export default nextConfig;
