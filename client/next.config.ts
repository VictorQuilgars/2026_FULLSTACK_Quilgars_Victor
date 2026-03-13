import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/particuliers",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/professionnels",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
