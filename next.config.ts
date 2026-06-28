import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ["images.unsplash.com","randomuser.me","https://avatar.vercel.sh/karthik","avatar.vercel.sh"],
  },
    eslint: {
    ignoreDuringBuilds: true,
  },
};


module.exports = nextConfig;


export default nextConfig;
