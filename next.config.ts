import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { hostname } from "os";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
<<<<<<< HEAD
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      { protocol: "https", hostname: "example.com" },
=======
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
>>>>>>> origin
    ],
  },
};

export default withNextIntl(nextConfig);
